import { Quote } from "../types/quote";
export declare const useQuotes: () => {
    quote: Quote | null;
    history: Quote[];
    fetchNewQuote: () => Promise<void>;
};
