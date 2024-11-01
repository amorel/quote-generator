import { LoginCredentials, RegisterCredentials, LoginResponse, User } from "@quote-generator/shared";

const API_URL = "http://localhost:3000"; // URL de l'API Gateway

export const register = async (
  credentials: RegisterCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "L'inscription a échoué");
  }

  const data = await response.json();
  return {
    token: data.token,
    user: data.user as User,
  };
};

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "La connexion a échoué");
  }

  const data = await response.json();
  return {
    token: data.token,
    user: data.user as User,
  };
};
