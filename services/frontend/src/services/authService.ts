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
};
