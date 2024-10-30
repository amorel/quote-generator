import { Quote } from "../types/quote";

export const getRandomQuote = async (): Promise<Quote> => {
  try {
    const response = await fetch("http://localhost:3000/quotes/random");
    if (!response.ok) {
      throw new Error("Failed to fetch quote");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};
