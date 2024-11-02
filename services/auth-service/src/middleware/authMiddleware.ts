import { FastifyRequest, FastifyReply } from "fastify";
import { JWTService } from "../services/JWTService";
import { JWTPayload } from "@quote-generator/shared";

const jwtService = new JWTService();

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/health",
  "/auth/login",
  "/auth/register",
  "/auth/validate",
  "/documentation",
  "/documentation/json",
  "/documentation/yaml",
  "/documentation/static/*",
];

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Vérifier si c'est une route publique
  if (publicRoutes.some((route) => request.url.startsWith(route))) {
    return;
  }

  const token = request.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return reply.status(401).send({ error: "No token provided" });
  }

  try {
    const user = jwtService.verifyToken(token) as JWTPayload;
    request.user = user;
  } catch (error) {
    return reply.status(401).send({ error: "Invalid token" });
  }
}
