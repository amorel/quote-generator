import { QuoteDTO } from "@quote-generator/shared";

export const getRandomQuote = async (): Promise<QuoteDTO> => {
  try {
    const response = await fetch("http://localhost:3000/quotes/random");
    if (!response.ok) {
      throw new Error("Failed to fetch quote");
    }
    const quotes = await response.json();
    return quotes[0];
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};
