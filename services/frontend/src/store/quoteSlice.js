import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRandomQuote } from "../services/quoteService";
export const fetchRandomQuote = createAsyncThunk("quote/fetchRandom", async () => {
    return await getRandomQuote();
});
const quoteSlice = createSlice({
    name: "quote",
    initialState: {
        current: null,
        history: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRandomQuote.pending, (state) => {
            state.loading = true;
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