// services/user-service/src/infrastructure/messaging/RabbitMQClient.ts
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
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      // Configuration des exchanges
      await this.setupExchanges();

      // Configuration des queues
      await this.setupQueues();

      // Configuration des bindings
      await this.setupBindings();

      // Reset le compteur de tentatives de reconnexion
      this.reconnectAttempts = 0;

      console.log("Connected to RabbitMQ");

      // Gestion de la fermeture de la connexion
      this.connection.on("close", async () => {
        console.log(
          "Connection to RabbitMQ closed. Attempting to reconnect..."
        );
        await this.reconnect();
      });
    } catch (error) {
      console.error("RabbitMQ connection error:", error);
      await this.reconnect();
    }
  }

  private async setupExchanges() {
    if (!this.channel) throw new Error("Channel not initialized");

    await this.channel.assertExchange("user.events", "topic", {
      durable: true,
    });
    await this.channel.assertExchange("quote.events", "topic", {
      durable: true,
    });
  }

  private async setupQueues() {
    if (!this.channel) throw new Error("Channel not initialized");

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
  }

  private async setupBindings() {
    if (!this.channel) throw new Error("Channel not initialized");

    // Bind la queue principale aux routing keys appropriés
    await this.channel.bindQueue("user_events", "user.events", "user.created");
    await this.channel.bindQueue("user_events", "user.events", "user.updated");

    // Bind la DLQ
    await this.channel.bindQueue("user_events_dlq", "dlx", "user.events.dead");
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
