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
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      throw new Error("Authentication failed");
    }
  }
}
