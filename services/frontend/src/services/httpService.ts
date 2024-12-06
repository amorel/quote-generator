import { AuthError, AppError, handleError } from "../utils/errorHandler";
import { tokenService } from "./tokenService";

declare global {
  interface Window {
    APP_CONFIG: {
      API_URL: string;
    };
  }
}

const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:3000';
console.log("window.APP_CONFIG?.API_URL:", window.APP_CONFIG?.API_URL);
console.log("API_URL:", API_URL);

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
    try {
      const token = tokenService.getToken();
      const headers: CustomHeadersInit = {
        ...(config.headers as CustomHeadersInit),
      };

      if (config.data) {
        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const requestConfig: RequestInit = {
        ...config,
        headers,
        credentials: "same-origin",
      };

      if (config.data) {
        requestConfig.body = JSON.stringify(config.data);
      }

      console.log("Sending request to:", `${API_URL}${endpoint}`);

      const response = await fetch(`${API_URL}${endpoint}`, requestConfig);

      console.log("Response:", response);

      if (!response.ok) {
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent("auth:required"));
          throw new AuthError();
        }

        const errorData = await response.json().catch(() => null);
        throw new AppError(
          errorData?.message ||
            response.statusText ||
            "Une erreur est survenue",
          `HTTP_${response.status}`
        );
      }

      if (response.headers.get("content-type")?.includes("application/json")) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      return handleError(error, `HTTP Request ${endpoint}`);
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
