/// <reference path="../types/fastify.d.ts" />
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/AuthService";
import { JWTPayload } from "../types/auth";

const authService = new AuthService();

const publicRoutes = [
  "/health",
  "/auth/login",
  "/auth/register",
  "/auth/validate",
  "/documentation",
  "/documentation/json",
  "/documentation/yaml",
  "/documentation/static/*",
  "/debug/auth-info",
];

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (publicRoutes.some((route) => request.url.startsWith(route))) {
    return;
  }
  console.log("⭐ Auth Middleware - Start");
  console.log("Request Headers:", request.headers);
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    console.log("Token extracted:", token ? "***" : "null");
    if (!token) {
      console.log("❌ No token provided");
      throw new Error("No token provided");
    }

    console.log("🔍 Validating token...");
    const user = (await authService.validateToken(token)) as JWTPayload;
    console.log("✅ Token validated, user:", user);
    request.user = user;
    console.log("👤 User added to request");
  } catch (error) {
    console.error("❌ Auth error:", error);
    reply.status(401).send({ error: "Unauthorized" });
  } finally {
    console.log("⭐ Auth Middleware - End");
  }
}
