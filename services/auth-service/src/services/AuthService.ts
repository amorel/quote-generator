import bcrypt from "bcrypt";
import { JWTService } from "./JWTService";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { User } from "../domain/entities/User";

export class AuthService {
  private jwtService: JWTService;
  private userRepository: UserRepository;

  constructor() {
    this.jwtService = new JWTService();
    this.userRepository = new UserRepository();
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
    // Vérifier l'utilisateur
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.getPassword());
    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    // Générer le token
    const token = this.jwtService.generateToken(user);

    return {
      user: {
        id: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      },
      token,
    };
  }

  async validateToken(token: string) {
    return this.jwtService.verifyToken(token);
  }
}
