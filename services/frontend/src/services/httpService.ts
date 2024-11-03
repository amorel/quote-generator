import { tokenService } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface RequestData {
  [key: string]: unknown;
}

interface RequestConfig extends RequestInit {
  data?: RequestData;
}

type CustomHeadersInit = HeadersInit & {
  Authorization?: string;
  "Content-Type"?: string;
};

class HttpService {
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const token = tokenService.getToken();

    // Créer les headers de base à partir des headers existants
    const headers: CustomHeadersInit = {
      ...(config.headers as CustomHeadersInit),
    };

    // Ajouter Content-Type seulement s'il n'est pas déjà défini
    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // Ajouter le token d'autorisation s'il existe
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      ...config,
      headers,
    };

    if (config.data) {
      requestConfig.body = JSON.stringify(config.data);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, requestConfig);

      if (!response.ok) {
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent("auth:required"));
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        }

        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || response.statusText || "Une erreur est survenue"
        );
      }

      if (response.headers.get("content-type")?.includes("application/json")) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Une erreur réseau est survenue");
    }
  }

  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    data?: RequestData,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      data,
    });
  }

  async put<T>(
    endpoint: string,
    data?: RequestData,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      data,
    });
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }
}

export const httpService = new HttpService();
