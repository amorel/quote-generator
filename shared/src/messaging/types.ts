import { EventTypes } from "../types/events";

export interface RabbitMQConfig {
  url: string;
  serviceName: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  prefetch?: number; // Ajout de cette propriété
}

export interface RabbitMQMessage {
  content: Buffer;
  fields: {
    deliveryTag: number;
    redelivered: boolean;
    exchange: string;
    routingKey: string;
  };
  properties: {
    contentType?: string;
    headers?: Record<string, any>;
    messageId?: string;
    timestamp?: number;
    type?: string;
    userId?: string;
  };
}

export interface PublishOptions {
  persistent?: boolean;
  messageId?: string;
  timestamp?: number;
  headers?: Record<string, any>;
}

export interface SubscribeOptions {
  prefetch?: number;
  durable?: boolean;
  noAck?: boolean;
}