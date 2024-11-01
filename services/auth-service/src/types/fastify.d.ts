import { FastifyRequest as OriginalFastifyRequest } from "fastify";
export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extension du type FastifyRequest
declare module "fastify" {
  interface FastifyRequest extends OriginalFastifyRequest {
    user?: JWTPayload;
  }
}
