import { useState } from "react";
import { getRandomQuote } from "../services/quoteService";
export const useQuotes = () => {
    const [quote, setQuote] = useState(null);
    const [history, setHistory] = useState([]);
    const fetchNewQuote = async () => {
        const newQuote = await getRandomQuote();
        setQuote(newQuote);
        setHistory((prev) => [...prev, newQuote]);
    };
    return { quote, history, fetchNewQuote };
};
