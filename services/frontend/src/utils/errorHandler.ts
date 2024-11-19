export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly isAuthError: boolean = false
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Session expirée. Veuillez vous reconnecter.") {
    super(message, "AUTH_ERROR", true);
  }
}

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AuthError) return true;

  if (error instanceof Error) {
    return (
      error.message.includes("Session expirée") ||
      error.message.includes("Non autorisé") ||
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    );
  }

  return false;
};

export const handleError = (error: unknown, context?: string): never => {
  // Ne pas logger les erreurs d'authentification
  if (!isAuthError(error)) {
    const contextMessage = context ? `[${context}] ` : "";
    console.error(`${contextMessage}Error:`, error);
  }

  throw error;
};
