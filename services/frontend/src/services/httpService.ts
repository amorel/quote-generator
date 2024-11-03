import { tokenService } from "./tokenService";

const API_URL = process.env.VITE_API_URL || "http://localhost:3000";

// Interface pour les données de requête
interface RequestData {
  [key: string]: unknown;
}

// Extension de l'interface RequestInit de fetch
interface RequestConfig extends RequestInit {
  data?: RequestData;
}

// Interface pour les headers personnalisés
type CustomHeaders = Record<string, string> & {
    "Content-Type"?: string;
    Authorization?: string;
  };

class HttpService {
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const token = tokenService.getToken();
    const headers: CustomHeaders = {
      "Content-Type": "application/json",
      ...(config.headers as CustomHeaders),
    };

    // Ajouter le token d'authentification si disponible
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      ...config,
      headers,
    };

    // Si des données sont fournies, les convertir en JSON
    if (config.data) {
      requestConfig.body = JSON.stringify(config.data);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, requestConfig);

      // Gérer les réponses non-OK (status >= 400)
      if (!response.ok) {
        // Si non autorisé, déclencher la déconnexion
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent("auth:required"));
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        }

        // Tenter de récupérer le message d'erreur du serveur
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || response.statusText || "Une erreur est survenue"
        );
      }

      // Pour les endpoints qui ne renvoient pas de JSON
      if (response.headers.get("content-type")?.includes("application/json")) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      // Rethrow avec un message plus descriptif si nécessaire
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
