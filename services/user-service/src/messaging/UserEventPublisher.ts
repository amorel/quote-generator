import {
  RabbitMQBase,
  RabbitMQConfig,
  EXCHANGES,
  ROUTING_KEYS,
  EventMessage,
  UserEventData,
  EventTypes,
} from "@quote-generator/shared";

export class UserEventPublisher extends RabbitMQBase {
  constructor(config: RabbitMQConfig) {
    super(config);
  }

  async publishUserCreated(userData: UserEventData): Promise<void> {
    const message: EventMessage<UserEventData> = {
      id: crypto.randomUUID(),
      type: EventTypes.USER_CREATED,
      data: userData,
      metadata: {
        timestamp: Date.now(),
        version: "1.0",
        service: this.config.serviceName,
      },
    };

    await this.publish(
      EXCHANGES.USER_EVENTS,
      ROUTING_KEYS.USER.CREATED,
      message
    );
  }
}