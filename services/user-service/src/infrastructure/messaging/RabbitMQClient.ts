import { EventTypes, UserEventData } from "@quote-generator/shared";
import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import { UserService } from "../../services/UserService";

export class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly reconnectInterval = 5000; // 5 seconds
  private readonly maxReconnectAttempts = 5;
  private reconnectAttempts = 0;

  constructor(
    private readonly url: string,
    private readonly userService: UserService
  ) {}

  async connect() {
    try {
      console.log("Connecting to RabbitMQ:", this.url);
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      // Configuration des exchanges
      await this.setupExchanges();

      // Configuration des queues
      await this.setupQueues();

      // Configuration des bindings
      await this.setupBindings();

      console.log("✅ Connected to RabbitMQ");
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
      throw error;
    }
  }

  private async setupExchanges() {
    if (!this.channel) throw new Error("Channel not initialized");

    console.log("Setting up exchanges...");

    // Créer d'abord l'exchange DLX
    await this.channel.assertExchange("dlx", "topic", {
      durable: true,
    });

    // Puis les autres exchanges
    await this.channel.assertExchange("user.events", "topic", {
      durable: true,
    });
    await this.channel.assertExchange("quote.events", "topic", {
      durable: true,
    });

    console.log("✅ Exchanges setup complete");
  }

  private async setupQueues() {
    if (!this.channel) throw new Error("Channel not initialized");

    console.log("Setting up queues...");

    // Queue principale avec DLX
    await this.channel.assertQueue("user_events", {
      durable: true,
      deadLetterExchange: "dlx",
      deadLetterRoutingKey: "user.events.dead",
    });

    // Dead Letter Queue
    await this.channel.assertQueue("user_events_dlq", {
      durable: true,
    });

    console.log("✅ Queues setup complete");
  }

  private async setupBindings() {
    if (!this.channel) throw new Error("Channel not initialized");

    console.log("Setting up bindings...");

    // Bind la queue principale
    await this.channel.bindQueue("user_events", "user.events", "user.#");

    // Bind la DLQ
    await this.channel.bindQueue("user_events_dlq", "dlx", "user.events.dead");

    console.log("✅ Bindings setup complete");
  }

  private async reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached. Giving up.");
      process.exit(1);
    }

    this.reconnectAttempts++;
    console.log(`Reconnection attempt ${this.reconnectAttempts}...`);

    await new Promise((resolve) => setTimeout(resolve, this.reconnectInterval));
    await this.connect();
  }

  async subscribe() {
    if (!this.channel) throw new Error("Not connected to RabbitMQ");

    // Configuration de la prefetch
    await this.channel.prefetch(1);

    // Écouter les événements utilisateur
    await this.channel.consume(
      "user_events",
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const event = JSON.parse(msg.content.toString());

          switch (event.type) {
            case EventTypes.USER_CREATED:
              await this.userService.handleUserCreated(
                event.data as UserEventData
              );
              break;
            case EventTypes.USER_UPDATED:
              await this.userService.handleUserUpdated(
                event.data as UserEventData
              );
              break;
            default:
              console.warn(`Unknown event type: ${event.type}`);
          }

          // Acquitter le message
          this.channel?.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);

          // Vérifier si le message a déjà été rejeté avant
          if (msg.fields.redelivered) {
            // Si oui, envoyer vers la DLQ
            this.channel?.reject(msg, false);
          } else {
            // Sinon, remettre dans la queue pour réessayer
            this.channel?.reject(msg, true);
          }
        }
      }
    );
  }

  async publish(exchange: string, routingKey: string, message: any) {
    if (!this.channel) throw new Error("Not connected to RabbitMQ");

    try {
      const success = this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          messageId: message.id || crypto.randomUUID(),
          timestamp: Date.now(),
          headers: {
            "x-retry-count": 0,
          },
        }
      );

      if (!success) {
        throw new Error("Message was not published");
      }
    } catch (error) {
      console.error("Error publishing message:", error);
      throw error;
    }
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}