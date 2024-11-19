import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { QuoteDTO } from "@quote-generator/shared";
import { quoteService } from "../services/quoteService";

const MAX_HISTORY_SIZE = 100;

export const fetchRandomQuote = createAsyncThunk(
  "quote/fetchRandom",
  async (_, { getState }) => {
    const state = getState() as { quote: QuoteState };
    let newQuote: QuoteDTO;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      newQuote = await quoteService.getRandomQuote();
      attempts++;
      // Vérifie si la citation est déjà dans l'historique
      const isDuplicate = state.quote.history.some(
        (quote) => quote._id === newQuote._id
      );

      if (!isDuplicate || attempts >= maxAttempts) {
        return newQuote;
      }
    } while (attempts < maxAttempts);

    return newQuote;
  }
);

export const toggleFavorite = createAsyncThunk(
  "quote/toggleFavorite",
  async (quoteId: string, { getState }) => {
    const state = getState() as { quote: QuoteState };
    const isFavorite = state.quote.favorites.includes(quoteId);
    
    try {
      await quoteService.toggleFavorite(quoteId, !isFavorite);
      return { quoteId, isFavorite: !isFavorite };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }
);

interface QuoteState {
  current: QuoteDTO | null;
  history: QuoteDTO[];
  favorites: string[];
  loading: boolean;
  error: string | null;
}

const initialState: QuoteState = {
  current: null,
  history: [],
  favorites: [],
  loading: false,
  error: null,
};

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.history = [];
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        // Ajoute la nouvelle citation à l'historique
        state.history.push(action.payload);
        // Garde uniquement les 100 dernières citations

        if (state.history.length > MAX_HISTORY_SIZE) {
          state.history = state.history.slice(-MAX_HISTORY_SIZE);
        }

        state.error = null;
      })
      .addCase(fetchRandomQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch quote";
      })
      // Nouveaux cas pour la gestion des favoris
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { quoteId, isFavorite } = action.payload;
        state.loading = false;
        if (isFavorite) {
          if (!state.favorites.includes(quoteId)) {
            state.favorites.push(quoteId);
          }
        } else {
          state.favorites = state.favorites.filter((id) => id !== quoteId);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to toggle favorite";
      });
  },
});

export const { clearHistory, setFavorites } = quoteSlice.actions;
export default quoteSlice.reducer;
