import { configureStore } from "@reduxjs/toolkit";
import quoteReducer from "./quoteSlice";
import { historyPersistenceService } from "../services/historyPersistenceService";

const preloadedState = {
  quote: {
    current: null,
    history: historyPersistenceService.loadHistory(),
    favorites: historyPersistenceService.loadFavorites(),
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

store.subscribe(() => {
  const state = store.getState();
  historyPersistenceService.saveHistory(state.quote.history);
  historyPersistenceService.saveFavorites(Array.from(state.quote.favorites));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
