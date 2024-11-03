import { authService } from "../services/authService";
import { tokenService } from "../services/tokenService";

jest.mock("../services/tokenService");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle successful login", async () => {
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

    // Configuration du mock fetch pour ce test spécifique
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers({
          "content-type": "application/json",
        }),
      })
    );

    const response = await authService.login(mockCredentials);

    expect(tokenService.setToken).toHaveBeenCalledWith(mockResponse.token);
    expect(response).toEqual(mockResponse);
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
