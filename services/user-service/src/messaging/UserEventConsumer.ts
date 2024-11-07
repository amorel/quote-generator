import {
  RabbitMQBase,
  RabbitMQConfig,
  QUEUES,
  EXCHANGES,
  ROUTING_KEYS,
  EventMessage,
  UserEventData,
} from "@quote-generator/shared";
import { UserService } from "../services/UserService";

export class UserEventConsumer extends RabbitMQBase {
  constructor(
    url: string,        
    private readonly userService: UserService 
  ) {
    const config: RabbitMQConfig = {
      url: url,
      serviceName: "user-service",
      reconnectAttempts: 5,
      reconnectInterval: 5000,
      prefetch: 1
    };
    
    super(config);
  }

  async setupSubscriptions(): Promise<void> {
    await Promise.all([
      this.subscribeToUserCreated(),
      this.subscribeToUserUpdated(),
      this.subscribeToQuoteFavorited(),
    ]);
  }

  private async subscribeToUserCreated(): Promise<void> {
    await this.subscribe<UserEventData>(
      QUEUES.USER_EVENTS,
      EXCHANGES.USER_EVENTS,
      ROUTING_KEYS.USER.CREATED,
      async (message) => {
        console.log("Processing USER_CREATED event:", message);
        try {
          const eventData = {
            ...message.data,
            timestamp: message.metadata.timestamp,
          };
          await this.userService.handleUserCreated(eventData);
        } catch (error) {
          console.error("Error handling USER_CREATED event:", error);
          throw error;
        }
      }
    );
  }

  private async subscribeToUserUpdated(): Promise<void> {
    await this.subscribe<UserEventData>(
      QUEUES.USER_EVENTS,
      EXCHANGES.USER_EVENTS,
      ROUTING_KEYS.USER.UPDATED,
      async (message) => {
        console.log("Processing USER_UPDATED event:", message);
        try {
          const eventData = {
            ...message.data,
            timestamp: message.metadata.timestamp,
          };
          await this.userService.handleUserUpdated(eventData);
        } catch (error) {
          console.error("Error handling USER_UPDATED event:", error);
          throw error;
        }
      }
    );
  }

  private async subscribeToQuoteFavorited(): Promise<void> {
    await this.subscribe<{ userId: string; quoteId: string }>(
      QUEUES.QUOTE_EVENTS,
      EXCHANGES.QUOTE_EVENTS,
      ROUTING_KEYS.QUOTE.FAVORITED,
      async (message) => {
        console.log("Processing QUOTE_FAVORITED event:", message);
        try {
          await this.userService.handleQuoteFavorited(
            message.data.userId,
            message.data.quoteId
          );
        } catch (error) {
          console.error("Error handling QUOTE_FAVORITED event:", error);
          throw error;
        }
      }
    );
  }
}