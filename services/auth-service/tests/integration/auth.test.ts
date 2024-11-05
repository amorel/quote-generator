import { build } from "../../src/app";
import { FastifyInstance } from "fastify";
import { UserRepositoryMock } from "../mocks/UserRepositoryMock";
import { AuthService } from "../../src/services/AuthService";
import { UserModel } from "../../src/infrastructure/persistence/models/UserModel";

describe("Auth Routes Integration", () => {
  let app: FastifyInstance;
  let userRepository: UserRepositoryMock;

  beforeAll(async () => {
    userRepository = new UserRepositoryMock();
    const authService = new AuthService(userRepository);
    app = await build(authService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Créer un utilisateur pour les tests
      const registerResponse = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "login-test@example.com",
          password: "Password123!", // Mot de passe plus fort
        },
      });

      // Vérifier que l'enregistrement a réussi
      expect(registerResponse.statusCode).toBe(201);
      const registerBody = JSON.parse(registerResponse.payload);
      expect(registerBody).toHaveProperty("token");
    });

    it("should login successfully", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          email: "login-test@example.com",
          password: "Password123!", // Même mot de passe fort
        },
      });

      // Log pour debug
      if (response.statusCode !== 201) {
        console.log("Login failed:", response.payload);
      }

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty("token");
    });

    it("should reject invalid credentials", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
          email: "login-test@example.com",
          password: "wrongpassword",
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("POST /auth/validate", () => {
    let token: string;

    beforeEach(async () => {
      const registerResponse = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "validate-test@example.com",
          password: "Password123!", // Mot de passe fort
        },
      });

      // Vérifier l'enregistrement
      expect(registerResponse.statusCode).toBe(201);
      const registerBody = JSON.parse(registerResponse.payload);
      expect(registerBody).toHaveProperty("token");
      token = registerBody.token;
      expect(token).toBeTruthy();
    });

    it("should validate a valid token", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/validate",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log pour debug
      if (response.statusCode !== 200) {
        console.log("Validation failed:", response.payload);
      }

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.valid).toBe(true);
      expect(body.user).toBeDefined();
    });

    it("should reject invalid token", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/validate",
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.payload);
      expect(body.valid).toBe(false);
    });
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "test@example.com",
          password: "Password123!",
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty("token");
    });

    it("should reject invalid email", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/auth/register",
        payload: {
          email: "invalid-email",
          password: "Password123!",
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
