import { QuoteDTO } from "@quote-generator/shared";

const HISTORY_KEY = "quote_history";

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
};
