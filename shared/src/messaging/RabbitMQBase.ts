import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import { EventMessage } from "../types/events";
import { EXCHANGES, QUEUES, ROUTING_KEYS } from "../constants/messaging";
import { RabbitMQConfig, PublishOptions, SubscribeOptions } from "./types";

export class RabbitMQBase {
  protected connection: Connection | null = null;
  protected channel: Channel | null = null;
  private reconnectAttempts = 0;
  protected readonly config: Required<RabbitMQConfig>;

  constructor(config: RabbitMQConfig) {
    this.config = {
      reconnectAttempts: 5,
      reconnectInterval: 5000,
      prefetch: 1,
      ...config,
    };
    this.connect().catch((error) => {
      console.error(`Failed to connect to RabbitMQ:`, error);
    });
  }

  private async setupQueueBindings(): Promise<void> {
    if (!this.channel) return;

    // Bind user service queue to quote events
    await this.channel.bindQueue(
      QUEUES.USER_EVENTS,
      EXCHANGES.QUOTE_EVENTS,
      ROUTING_KEYS.QUOTE.FAVORITED
    );

    console.log("Queue bindings configured");
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.url);
      this.channel = await this.connection.createChannel();

      // Configuration de base du canal
      await this.channel.prefetch(this.config.prefetch);

      // Configuration des exchanges et queues
      await this.setupExchanges();

      // Configuration des gestionnaires d'événements
      this.setupErrorHandlers();

      console.log(`[${this.config.serviceName}] Connected to RabbitMQ`);
      this.reconnectAttempts = 0;
    } catch (error) {
      await this.handleConnectionError(error);
    }
  }

  async publish<T>(
    exchange: string,
    routingKey: string,
    message: EventMessage<T>,
    options: PublishOptions = {}
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("Not connected to RabbitMQ");
    }

    try {
      await this.channel.assertExchange(exchange, "topic", { durable: true });

      const publishOptions = {
        persistent: true,
        messageId: message.id || crypto.randomUUID(),
        timestamp: Date.now(),
        headers: {
          "x-retry-count": 0,
          ...options.headers,
        },
        ...options,
      };

      const success = this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        publishOptions
      );

      if (!success) {
        throw new Error("Message publishing failed");
      }

      console.log(
        `[${this.config.serviceName}] Published message to ${exchange}:${routingKey}`
      );
    } catch (error) {
      await this.handlePublishError(error, exchange, routingKey);
    }
  }

  async subscribe<T>(
    queue: string,
    exchange: string,
    routingKey: string,
    handler: (message: EventMessage<T>) => Promise<void>,
    options: SubscribeOptions = {}
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("Not connected to RabbitMQ");
    }

    try {
      await this.setupQueue(queue, exchange, routingKey, options);

      await this.channel.consume(
        queue,
        async (msg: ConsumeMessage | null) => {
          if (!msg) return;
          await this.handleMessage(msg, handler);
        },
        { noAck: options.noAck }
      );

      console.log(
        `[${this.config.serviceName}] Subscribed to ${exchange}:${routingKey}`
      );
    } catch (error) {
      await this.handleSubscribeError(error, queue, exchange, routingKey);
    }
  }
  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      console.log(`[${this.config.serviceName}] Disconnected from RabbitMQ`);
    } catch (error) {
      console.error(
        `[${this.config.serviceName}] Error closing connections:`,
        error
      );
    }
  }

  private async setupExchanges(): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");

    // Configuration de l'exchange DLX
    await this.channel.assertExchange(EXCHANGES.DLX, "topic", {
      durable: true,
    });

    // Configuration des queues principales
    await this.channel.assertQueue(QUEUES.USER_EVENTS, {
      durable: true,
    });
    await this.channel.assertQueue(QUEUES.QUOTE_EVENTS, {
      durable: true,
    });

    // Configuration des exchanges principaux et leurs bindings
    const exchangesAndBindings = [
      {
        exchange: EXCHANGES.USER_EVENTS,
        routingKey: ROUTING_KEYS.USER.ALL,
        queue: QUEUES.USER_EVENTS,
      },
      {
        exchange: EXCHANGES.QUOTE_EVENTS,
        routingKey: ROUTING_KEYS.QUOTE.ALL,
        queue: QUEUES.QUOTE_EVENTS,
      },
    ];

    for (const { exchange, routingKey, queue } of exchangesAndBindings) {
      await this.channel.assertExchange(exchange, "topic", {
        durable: true,
      });

      // Bind la queue à l'exchange
      await this.channel.bindQueue(queue, exchange, routingKey);
    }

    console.log("Exchanges and queues setup completed");
  }

  private async setupDeadLetterQueues(): Promise<void> {
    if (!this.channel) return;

    const queuesConfig = [
      {
        queue: QUEUES.USER_EVENTS,
        dlq: QUEUES.USER_EVENTS_DLQ,
        routingKey: "user.events.dead",
      },
      {
        queue: QUEUES.QUOTE_EVENTS,
        dlq: QUEUES.QUOTE_EVENTS_DLQ,
        routingKey: "quote.events.dead",
      },
      {
        queue: QUEUES.NOTIFICATION_EVENTS,
        dlq: QUEUES.NOTIFICATION_EVENTS_DLQ,
        routingKey: "notification.events.dead",
      },
    ];

    for (const config of queuesConfig) {
      // Queue principale avec DLX
      await this.channel.assertQueue(config.queue, {
        durable: true,
        deadLetterExchange: EXCHANGES.DLX,
        deadLetterRoutingKey: config.routingKey,
      });

      // Dead Letter Queue
      await this.channel.assertQueue(config.dlq, {
        durable: true,
      });

      // Binding de la DLQ
      await this.channel.bindQueue(
        config.dlq,
        EXCHANGES.DLX,
        config.routingKey
      );
    }
  }

  private async setupQueue(
    queue: string,
    exchange: string,
    routingKey: string,
    options: SubscribeOptions
  ): Promise<void> {
    if (!this.channel) return;

    await this.channel.assertQueue(queue, {
      durable: options.durable !== false,
      deadLetterExchange: EXCHANGES.DLX,
      deadLetterRoutingKey: `${queue}.dead`,
    });

    await this.channel.bindQueue(queue, exchange, routingKey);
  }

  protected async handleMessage<T>(
    msg: ConsumeMessage,
    handler: (message: EventMessage<T>) => Promise<void>
  ): Promise<void> {
    if (!this.channel) return;

    try {
      const message = JSON.parse(msg.content.toString()) as EventMessage<T>;
      await handler(message);
      this.channel.ack(msg);
    } catch (error) {
      const retryCount = (msg.properties.headers?.["x-retry-count"] || 0) + 1;
      const maxRetries = 3;

      if (retryCount <= maxRetries) {
        // Retry with backoff
        await this.retryMessage(msg, retryCount);
      } else {
        // Send to DLQ
        this.channel.reject(msg, false);
        console.error(
          `[${this.config.serviceName}] Message moved to DLQ after ${maxRetries} retries`
        );
      }
    }
  }

  private async retryMessage(
    msg: ConsumeMessage,
    retryCount: number
  ): Promise<void> {
    if (!this.channel) return;

    const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    const headers = { ...msg.properties.headers, "x-retry-count": retryCount };

    setTimeout(() => {
      this.channel?.publish(
        msg.fields.exchange,
        msg.fields.routingKey,
        msg.content,
        { ...msg.properties, headers }
      );
      this.channel?.ack(msg);
    }, retryDelay);
  }

  private setupErrorHandlers(): void {
    if (this.connection) {
      this.connection.on("error", this.handleConnectionError.bind(this));
      this.connection.on("close", this.handleConnectionClose.bind(this));
    }

    if (this.channel) {
      this.channel.on("error", this.handleChannelError.bind(this));
      this.channel.on("close", this.handleChannelClose.bind(this));
    }
  }

  private async handleConnectionError(error: any): Promise<void> {
    console.error(
      `[${this.config.serviceName}] RabbitMQ connection error:`,
      error
    );
    await this.reconnect();
  }

  private async handleConnectionClose(): Promise<void> {
    console.log(`[${this.config.serviceName}] RabbitMQ connection closed`);
    await this.reconnect();
  }

  private handleChannelError(error: any): void {
    console.error(
      `[${this.config.serviceName}] RabbitMQ channel error:`,
      error
    );
  }

  private handleChannelClose(): void {
    console.log(`[${this.config.serviceName}] RabbitMQ channel closed`);
  }

  private async handlePublishError(
    error: any,
    exchange: string,
    routingKey: string
  ): Promise<void> {
    console.error(
      `[${this.config.serviceName}] Error publishing to ${exchange}:${routingKey}:`,
      error
    );
    throw error;
  }

  private async handleSubscribeError(
    error: any,
    queue: string,
    exchange: string,
    routingKey: string
  ): Promise<void> {
    console.error(
      `[${this.config.serviceName}] Error subscribing to ${queue} (${exchange}:${routingKey}):`,
      error
    );
    throw error;
  }

  protected async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.config.reconnectAttempts) {
      console.error(
        `[${this.config.serviceName}] Max reconnection attempts reached. Giving up.`
      );
      process.exit(1);
    }

    this.reconnectAttempts++;
    console.log(
      `[${this.config.serviceName}] Reconnection attempt ${this.reconnectAttempts}...`
    );

    await new Promise((resolve) =>
      setTimeout(resolve, this.config.reconnectInterval)
    );
    await this.connect();
  }
}
