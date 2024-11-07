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

interface QuoteState {
  current: QuoteDTO | null;
  history: QuoteDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: QuoteState = {
  current: null,
  history: [],
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
      });
  },
});

export const { clearHistory } = quoteSlice.actions;
export default quoteSlice.reducer;