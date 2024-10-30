import { FastifyRequest as OriginalFastifyRequest } from "fastify";
import { JWTPayload } from "./auth";

declare module "fastify" {
  interface FastifyRequest extends OriginalFastifyRequest {
    user?: JWTPayload;
  }
}
