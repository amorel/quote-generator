const TOKEN_KEY = "auth_token";

export const tokenService = {
  // Stocker le token
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Supprimer le token
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Vérifier si un token existe
  hasToken(): boolean {
    return !!this.getToken();
  },
};
