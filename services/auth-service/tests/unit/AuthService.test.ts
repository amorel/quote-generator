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
    authService = new AuthService();
  });

  describe("register", () => {
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
    it("should login successfully", async () => {
      const expectedResponse = {
        user: {
          id: "123",
          email: "test@test.com",
          role: "user",
        },
        token: "mock-token",
      };

      const result = await authService.login("test@test.com", "password");
      expect(result).toEqual(expectedResponse);
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
    it("should validate token successfully", async () => {
      const validToken = "valid-token";
      const expectedUser = {
        id: "123",
        email: "test@test.com",
        role: "user",
      };

      const result = await authService.validateToken(validToken);
      expect(result).toEqual(expectedUser);
    });
  });
});
