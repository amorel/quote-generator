import { useState } from "react";
import { Quote } from "../types/quote";
import { quoteService } from "../services/quoteService";

export const useQuotes = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [history, setHistory] = useState<Quote[]>([]);

  const fetchNewQuote = async () => {
    const newQuote = await quoteService.getRandomQuote();
    setQuote(newQuote);
    setHistory((prev) => [...prev, newQuote]);
  };

  return { quote, history, fetchNewQuote };
};
