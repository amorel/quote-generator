import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/jwt";
import { User } from "../domain/entities/User";
import { IUserRepository } from "../domain/repositories/IUserRepository";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(email: string, password: string): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(
      Date.now().toString(), // Temporaire, MongoDB générera le vrai ID
      email,
      hashedPassword,
      "user"
    );

    const createdUser = await this.userRepository.create(user);
    return this.generateToken(createdUser);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.getPassword());
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return this.generateToken(user);
  }

  async validateToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn }
    );
  }
}
