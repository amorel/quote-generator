import { FastifyRequest as OriginalFastifyRequest } from "fastify";
import { JWTPayload } from "@quote-generator/shared";

declare module "fastify" {
  interface FastifyRequest extends OriginalFastifyRequest {
    metrics: {
      startTime: [number, number];
    };
    user?: JWTPayload;
    routerPath?: string;
  }
}