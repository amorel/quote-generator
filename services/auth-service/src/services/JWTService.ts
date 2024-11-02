import jwt from "jsonwebtoken";
import { User } from "../domain/entities/User";
import { JWTPayload } from "@quote-generator/shared";

export class JWTService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || "your-secret-key";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  }

  generateToken(user: User): string {
    const payload: JWTPayload = {
      id: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    };

    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secretKey) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
