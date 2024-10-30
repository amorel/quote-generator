export class AuthService {
  private readonly authServiceUrl: string;

  constructor() {
    this.authServiceUrl =
      process.env.AUTH_SERVICE_URL || "http://auth-service:3001";
    console.log("🔧 AuthService initialized with URL:", this.authServiceUrl);
  }

  async validateToken(token: string): Promise<boolean> {
    console.log("🔄 Validating token with auth service...");
    try {
      const response = await fetch(`${this.authServiceUrl}/auth/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Auth service response status:", response.status);

      if (!response.ok) {
        throw new Error(`Invalid token - Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Auth service response data:", data);
      return data.user;
    } catch (error) {
      console.error("💥 Auth service error:", error);
      return false;
    }
  }
}
