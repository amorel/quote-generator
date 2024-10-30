import { Quote } from "../types/quote";

export const getRandomQuote = async (): Promise<Quote> => {
  const quote = {
    _id: "1",
    content:
      "In the depth of winter, I finally learned that there was within me an invincible summer.",
    author: "Albert Camus",
    tags: ["Famous Quotes", "Inspirational"],
  };
  return quote;
};
