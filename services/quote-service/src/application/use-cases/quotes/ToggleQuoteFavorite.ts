import {
  RabbitMQBase,
  EventMessage,
  EventTypes,
  EXCHANGES,
  ROUTING_KEYS,
} from "@quote-generator/shared";

export class ToggleQuoteFavoriteUseCase {
  private rabbitMQClient: RabbitMQBase;

  constructor(rabbitMQClient: RabbitMQBase) {
    this.rabbitMQClient = rabbitMQClient;
  }

  async execute(
    quoteId: string,
    userId: string,
    isFavorite: boolean
  ): Promise<void> {
    console.log("🎯 ToggleQuoteFavoriteUseCase.execute:", {
      quoteId,
      userId,
      isFavorite,
    });

    const event: EventMessage = {
      id: crypto.randomUUID(),
      type: isFavorite ? EventTypes.QUOTE_FAVORITED : EventTypes.QUOTE_VIEWED,
      data: {
        quoteId,
        userId,
        timestamp: Date.now(),
      },
      metadata: {
        timestamp: Date.now(),
        version: "1.0",
        service: "quote-service",
      },
    };

    console.log("📝 Created event:", event);

    const routingKey = isFavorite
      ? ROUTING_KEYS.QUOTE.FAVORITED
      : ROUTING_KEYS.QUOTE.VIEWED;
    console.log("🔄 Publishing to:", {
      exchange: EXCHANGES.QUOTE_EVENTS,
      routingKey,
      eventType: event.type,
    });

    try {
      await this.rabbitMQClient.publish(
        EXCHANGES.QUOTE_EVENTS,
        routingKey,
        event
      );
      console.log("✅ Event published successfully");
    } catch (error) {
      console.error("❌ Failed to publish event to RabbitMQ:", error);
      // En développement, on peut continuer sans RabbitMQ
      if (process.env.NODE_ENV !== "development") {
        throw error;
      } else {
        console.warn("⚠️ Continuing without RabbitMQ in development mode");
      }
    }
  }
}
