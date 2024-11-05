import { AuthService } from "../../src/services/AuthService";
import { UserRepositoryMock } from "../mocks/UserRepositoryMock";
import { JWTService } from "../../src/services/JWTService";
import { User } from "../../src/domain/entities/User";
import bcrypt from "bcrypt";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: UserRepositoryMock;
  let jwtService: JWTService;

  beforeEach(() => {
    userRepository = new UserRepositoryMock();
    jwtService = new JWTService();
    authService = new AuthService(userRepository, jwtService);
  });

  describe("register", () => {
    it("should throw an error if email already exists", async () => {
      const email = "test@example.com";
      const password = "password123";

      // Crée d'abord un utilisateur
      await authService.register(email, password);

      // Tente de créer un autre utilisateur avec le même email
      await expect(authService.register(email, password)).rejects.toThrow(
        "Email already exists"
      );
    });

    it("should register a new user successfully", async () => {
      const email = "test@example.com";
      const password = "password123";

      const result = await authService.register(email, password);

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("user");
      expect(result.user).toHaveProperty("email", email);
      expect(result.user).toHaveProperty("role", "user");
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      // Créer un utilisateur de test
      const email = "test@example.com";
      const password = "password123";
      await authService.register(email, password);
    });

    it("should login successfully with correct credentials", async () => {
      const result = await authService.login("test@example.com", "password123");

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("user");
      expect(result.user).toHaveProperty("email", "test@example.com");
      expect(result.user).toHaveProperty("role", "user");
    });

    it("should throw an error with incorrect password", async () => {
      await expect(
        authService.login("test@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw an error with non-existent email", async () => {
      await expect(
        authService.login("nonexistent@example.com", "password123")
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("validateToken", () => {
    let validToken: string;

    beforeEach(async () => {
      // Créer un utilisateur et obtenir un token valide
      const result = await authService.register(
        "test@example.com",
        "password123"
      );
      validToken = result.token;
    });

    it("should validate token successfully", async () => {
      const result = await authService.validateToken(validToken);

      expect(result).toHaveProperty("email", "test@example.com");
      expect(result).toHaveProperty("role", "user");
    });

    it("should reject invalid token", async () => {
      await expect(authService.validateToken("invalid-token")).rejects.toThrow(
        "Invalid token"
      );
    });
  });
});
