import jwt from "jsonwebtoken";

export class JWTService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || "your-secret-key";
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secretKey);
  }
}
