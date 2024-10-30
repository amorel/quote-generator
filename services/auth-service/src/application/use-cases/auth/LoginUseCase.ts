import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import { JWTService } from "../../../services/JWTService";
import { UnauthorizedError } from "../../../interface/errors";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JWTService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);

    // Vérifier si l'utilisateur n'existe pas
    if (!user) {
      throw new UnauthorizedError("Email non trouvé");
    }

    // Vérifier si le mot de passe correspond
    const isValidPassword = await bcrypt.compare(password, user.getPassword());
    if (!isValidPassword) {
      throw new UnauthorizedError("Mot de passe incorrect");
    }

    // Générer le token si tout est bon
    return this.jwtService.generateToken(user);
  }
}
