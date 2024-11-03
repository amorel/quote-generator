import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import { EventMessage, RabbitMQMessage } from "./types";
import { EXCHANGES, QUEUES } from "./constants";

export abstract class RabbitMQBase {
  protected connection: Connection | null = null;
  protected channel: Channel | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  constructor(
    protected readonly url: string,
    protected readonly serviceName: string
  ) {}

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      // Créer les exchanges nécessaires
      await this.setupExchanges();

      console.log(`[${this.serviceName}] Connected to RabbitMQ`);

      this.connection.on("close", async () => {
        console.log(
          "Connection to RabbitMQ closed. Attempting to reconnect..."
        );
        await this.reconnect();
      });
    } catch (error) {
      console.error(`[${this.serviceName}] RabbitMQ connection error:`, error);
      await this.reconnect();
    }
  }

  protected async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached. Giving up.");
      process.exit(1);
    }

    this.reconnectAttempts++;
    console.log(`Reconnection attempt ${this.reconnectAttempts}...`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    await this.connect();
  }

  async publish<T>(
    exchange: string,
    routingKey: string,
    message: EventMessage<T>
  ): Promise<void> {
    if (!this.channel) throw new Error("Not connected to RabbitMQ");

    try {
      await this.channel.assertExchange(exchange, "topic", { durable: true });

      const success = this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          messageId: message.id,
          timestamp: message.metadata.timestamp,
          type: message.type,
          correlationId: message.metadata.correlationId,
          headers: {
            version: message.metadata.version,
            service: message.metadata.service,
          },
        }
      );

      if (!success) {
        throw new Error("Message was not published");
      }
    } catch (error) {
      console.error(`[${this.serviceName}] Error publishing message:`, error);
      throw error;
    }
  }

  async subscribe<T>(
    queue: string,
    exchange: string,
    routingKey: string,
    handler: (message: EventMessage<T>) => Promise<void>
  ): Promise<void> {
    if (!this.channel) throw new Error("Not connected to RabbitMQ");

    try {
      await this.channel.assertExchange(exchange, "topic", { durable: true });
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(queue, exchange, routingKey);

      await this.channel.prefetch(1);

      await this.channel.consume(queue, async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const message = JSON.parse(msg.content.toString()) as EventMessage<T>;
          await handler(message);
          this.channel?.ack(msg);
        } catch (error) {
          console.error(
            `[${this.serviceName}] Error processing message:`,
            error
          );
          if (msg.fields.redelivered) {
            this.channel?.reject(msg, false);
          } else {
            this.channel?.reject(msg, true);
          }
        }
      });
    } catch (error) {
      console.error(
        `[${this.serviceName}] Error setting up subscription:`,
        error
      );
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  protected async setupExchanges(): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");

    // Créer l'exchange DLX
    await this.channel.assertExchange('dlx', 'topic', {
      durable: true
    });

    // Créer les autres exchanges principaux
    await this.channel.assertExchange(EXCHANGES.USER_EVENTS, 'topic', {
      durable: true
    });
    await this.channel.assertExchange(EXCHANGES.QUOTE_EVENTS, 'topic', {
      durable: true
    });
    await this.channel.assertExchange(EXCHANGES.NOTIFICATION_EVENTS, 'topic', {
      durable: true
    });

    // Créer les queues avec leurs configurations DLX
    await this.channel.assertQueue(QUEUES.USER_EVENTS, {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'user.events.dead'
    });

    await this.channel.assertQueue(QUEUES.QUOTE_EVENTS, {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'quote.events.dead'
    });

    await this.channel.assertQueue(QUEUES.NOTIFICATION_EVENTS, {
      durable: true,
      deadLetterExchange: 'dlx',
      deadLetterRoutingKey: 'notification.events.dead'
    });

    // Créer les queues DLQ
    await this.channel.assertQueue(QUEUES.USER_EVENTS_DLQ, {
      durable: true
    });
    await this.channel.assertQueue(QUEUES.QUOTE_EVENTS_DLQ, {
      durable: true
    });
    await this.channel.assertQueue(QUEUES.NOTIFICATION_EVENTS_DLQ, {
      durable: true
    });

    // Bind les queues DLQ à l'exchange DLX
    await this.channel.bindQueue(
      QUEUES.USER_EVENTS_DLQ,
      'dlx',
      'user.events.dead'
    );
    await this.channel.bindQueue(
      QUEUES.QUOTE_EVENTS_DLQ,
      'dlx',
      'quote.events.dead'
    );
    await this.channel.bindQueue(
      QUEUES.NOTIFICATION_EVENTS_DLQ,
      'dlx',
      'notification.events.dead'
    );
  }
}