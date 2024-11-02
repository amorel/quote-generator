export interface EventMetadata {
  timestamp: number;
  version: string;
  service: string;
  correlationId?: string;
}
