import { EventTypes } from "../events";

export interface EventMessage<T = unknown> {
  id: string;
  type: EventTypes;
  data: T;
  metadata: {
    timestamp: number;
    version: string;
    service: string;
    correlationId?: string;
    userId?: string;
  };
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
    contentEncoding?: string;
    headers?: Record<string, any>;
    deliveryMode?: number;
    priority?: number;
    correlationId?: string;
    replyTo?: string;
    expiration?: string;
    messageId?: string;
    timestamp?: number;
    type?: string;
    userId?: string;
    appId?: string;
    clusterId?: string;
  };
}
