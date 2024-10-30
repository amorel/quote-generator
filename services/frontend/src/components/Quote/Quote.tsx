import { useEffect } from "react";
import { useQuotes } from "../../hooks/useQuotes";
import styles from "./Quote.module.css";

export const Quote = () => {
  const { quote, fetchNewQuote } = useQuotes();

  useEffect(() => {
    fetchNewQuote();
  }, []);

  if (!quote) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <blockquote className={styles.quote}>
        <p>{quote.content}</p>
        <footer>— {quote.author}</footer>
      </blockquote>
      <button onClick={fetchNewQuote}>Next Quote</button>
    </div>
  );
};
