export interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: any;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  role: string;
}
