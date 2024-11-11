import {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  User,
} from "@quote-generator/shared";
import { tokenService } from "./tokenService";
import { httpService } from "./httpService";

export const authService = {
  async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    try {
      const data = await httpService.post<LoginResponse>(
        "/auth/register",
        credentials
      );
      tokenService.setToken(data.token);
      return data;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("L'inscription a échoué");
    }
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const data = await httpService.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      tokenService.setToken(data.token);
      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error("La connexion a échoué");
    }
  },

  async validateToken(): Promise<{ valid: boolean; user: User | null }> {
    try {
      return await httpService.post("/auth/validate");
    } catch {
      return { valid: false, user: null };
    }
  },

  logout() {
    tokenService.removeToken();
  },

  isAuthenticated(): boolean {
    return tokenService.hasToken();
  },

  isTokenValid(): boolean {
    const token = tokenService.getToken();
    if (!token) return false;

    try {
      // Décode le token (qui est au format JWT)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const { exp } = JSON.parse(jsonPayload);

      // Vérifie si le token est expiré
      return exp * 1000 > Date.now();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  },
};
