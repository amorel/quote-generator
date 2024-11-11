import { QuoteDTO } from "@quote-generator/shared";

const HISTORY_KEY = "quote_history";
const FAVORITES_KEY = "quote_favorites";

export const historyPersistenceService = {
  saveHistory(history: QuoteDTO[]) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  loadHistory(): QuoteDTO[] {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  },

  clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  },

  saveFavorites(favorites: string[]) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  },

  loadFavorites(): string[] {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  },
};
