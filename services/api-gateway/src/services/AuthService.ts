export class AuthService {
  private readonly authServiceUrl: string;

  constructor() {
    this.authServiceUrl =
      process.env.AUTH_SERVICE_URL || "http://localhost:3001";
  }

  async validateToken(token: string): Promise<any> {
    try {
      const response = await fetch(`${this.authServiceUrl}/auth/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  }
}
