import jwt from "jsonwebtoken";
import { User } from "../domain/entities/User";

export class JWTService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || "your-secret-key";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  }

  generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      },
      this.secretKey,
      { expiresIn: this.expiresIn }
    );
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secretKey);
  }
}
