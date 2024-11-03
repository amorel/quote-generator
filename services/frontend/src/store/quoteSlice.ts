import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { QuoteDTO } from "@quote-generator/shared";
import { quoteService } from "../services/quoteService";

export const fetchRandomQuote = createAsyncThunk(
  "quote/fetchRandom",
  async () => {
    return await quoteService.getRandomQuote();
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.history.push(action.payload);
        state.error = null;
      })
      .addCase(fetchRandomQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch quote";
      });
  },
});

export default quoteSlice.reducer;
