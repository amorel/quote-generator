import { EventTypes } from "@quote-generator/shared";
import { User } from "../domain/entities/User";

export class AuthEventPublisher {
  private readonly messageBrokerUrl: string;

  constructor() {
    this.messageBrokerUrl =
      process.env.MESSAGE_BROKER_URL || "amqp://admin:password@localhost:5672";
  }

  async publishUserCreated(user: User) {
    await this.publishEvent(EventTypes.USER_CREATED, {
      id: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    });
  }

  async publishUserUpdated(user: User) {
    await this.publishEvent(EventTypes.USER_UPDATED, {
      id: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    });
  }

  private async publishEvent(type: EventTypes, data: any) {
    // TODO: Implémenter la logique de publication des événements
    // Exemple avec RabbitMQ:
    try {
      console.log(`Publishing event ${type}:`, data);
      // Ici viendra le code pour publier sur RabbitMQ ou Kafka
    } catch (error) {
      console.error(`Error publishing ${type} event:`, error);
      throw error;
    }
  }
}
