import { authService } from "../services/authService";

describe("Authentication Integration", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should handle complete login flow", async () => {
    const mockCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    const mockResponse = {
      token: "test-jwt-token",
      user: {
        id: "1",
        email: "test@example.com",
        role: "user",
      },
    };

    // Mock fetch pour la requête de login
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers({
          "content-type": "application/json",
        }),
      })
    );

    // Test le flux de login
    const response = await authService.login(mockCredentials);

    // Vérifier que le token a été stocké
    expect(localStorage.getItem("auth_token")).toBe(mockResponse.token);

    // Vérifier que la réponse est correcte
    expect(response).toEqual(mockResponse);

    // Vérifier que fetch a été appelé avec les bons paramètres
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(mockCredentials),
      })
    );
  });
});
