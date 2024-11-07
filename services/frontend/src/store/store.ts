import { configureStore } from "@reduxjs/toolkit";
import quoteReducer from "./quoteSlice";
import { historyPersistenceService } from "../services/historyPersistenceService";

const preloadedState = {
  quote: {
    current: null,
    history: historyPersistenceService.loadHistory(),
    loading: false,
    error: null,
  },
};

export const store = configureStore({
  reducer: {
    quote: quoteReducer,
  },
  preloadedState,
});

// Sauvegarde l'historique à chaque changement d'état
store.subscribe(() => {
  const state = store.getState();
  historyPersistenceService.saveHistory(state.quote.history);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;