import { build } from "../../src/app";
import { FastifyInstance } from "fastify";

describe("API Integration Tests", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /quotes/random", () => {
    it("should return multiple quotes when limit is specified", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?limit=3",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveLength(3);
    });

    it("should filter quotes by maxLength", async () => {
      const maxLength = 50;
      const response = await app.inject({
        method: "GET",
        url: `/quotes/random?maxLength=${maxLength}`,
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      payload.forEach((quote: any) => {
        expect(quote.content.length).toBeLessThanOrEqual(maxLength);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid quote id", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/invalid-id",
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("status", "error");
      expect(payload).toHaveProperty("message");
    });

    it("should handle invalid limit parameter", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?limit=invalid",
      });

      expect(response.statusCode).toBe(400);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("status", "error");
    });
  });
});
