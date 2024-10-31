import { AuthService } from "@/services/AuthService";
import { UserRepositoryMock } from "@tests/mocks/UserRepositoryMock";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "@/config/jwt";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: UserRepositoryMock;

  beforeEach(() => {
    userRepository = new UserRepositoryMock();
    authService = new AuthService(userRepository);
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const email = "test@example.com";
      const password = "password123";

      const token = await authService.register(email, password);

      // Vérifier que le token est valide
      const decoded = jwt.verify(token, JWT_CONFIG.secret) as any;
      expect(decoded.email).toBe(email);
      expect(decoded.role).toBe("user");
    });

    it("should throw an error if email already exists", async () => {
      const email = "test@example.com";
      const password = "password123";

      await authService.register(email, password);

      await expect(authService.register(email, password)).rejects.toThrow(
        "Email already exists"
      );
    });
  });

  describe("login", () => {
    it("should login successfully with correct credentials", async () => {
      // D'abord enregistrer un utilisateur
      const email = "test@example.com";
      const password = "password123";
      await authService.register(email, password);

      // Tenter de se connecter
      const token = await authService.login(email, password);

      // Vérifier que le token est valide
      const decoded = jwt.verify(token, JWT_CONFIG.secret) as any;
      expect(decoded.email).toBe(email);
    });

    it("should throw an error with incorrect password", async () => {
      const email = "test@example.com";
      const password = "password123";
      await authService.register(email, password);

      await expect(authService.login(email, "wrongpassword")).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should throw an error with non-existent email", async () => {
      await expect(
        authService.login("nonexistent@example.com", "password123")
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("validateToken", () => {
    it("should validate a valid token", async () => {
      const email = "test@example.com";
      const token = await authService.register(email, "password123");

      const result = await authService.validateToken(token);
      expect(result.email).toBe(email);
    });

    it("should throw an error for invalid token", async () => {
      await expect(authService.validateToken("invalid-token")).rejects.toThrow(
        "Invalid token"
      );
    });
  });
});
