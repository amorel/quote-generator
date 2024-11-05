import bcrypt from "bcrypt";
import { JWTService } from "./JWTService";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { User } from "../domain/entities/User";
import { IUserRepository } from "@/domain/repositories/IUserRepository";

export class AuthService {
  private jwtService: JWTService;
  private userRepository: IUserRepository;

  constructor(userRepository?: IUserRepository, jwtService?: JWTService) {
    this.jwtService = jwtService || new JWTService();
    this.userRepository = userRepository || new UserRepository();
  }

  async register(email: string, password: string) {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = new User(Date.now().toString(), email, hashedPassword, "user");
    const savedUser = await this.userRepository.create(user);

    // Générer le token
    const token = this.jwtService.generateToken(savedUser);

    return {
      user: {
        id: savedUser.getId(),
        email: savedUser.getEmail(),
        role: savedUser.getRole(),
      },
      token,
    };
  }

  async login(email: string, password: string) {
    try {
      console.log("Login attempt for:", email);

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        console.log("User not found:", email);
        throw new Error("Invalid credentials");
      }

      const validPassword = await bcrypt.compare(password, user.getPassword());
      if (!validPassword) {
        console.log("Invalid password for:", email);
        throw new Error("Invalid credentials");
      }

      const token = this.jwtService.generateToken(user);
      console.log("Login successful for:", email);

      return {
        user: {
          id: user.getId(),
          email: user.getEmail(),
          role: user.getRole(),
        },
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async validateToken(token: string) {
    const cleanToken = token.replace("Bearer ", "");
    console.log("Token reçu:", token);
    console.log("Token nettoyé:", cleanToken);
    return this.jwtService.verifyToken(cleanToken);
  }
}
