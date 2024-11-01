import { useEffect } from "react";
import { fetchRandomQuote } from "../../store/quoteSlice";
import styles from "./Quote.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";

export const Quote = () => {
  const dispatch = useAppDispatch();
  const { current, loading, error } = useAppSelector((state) => state.quote);

  useEffect(() => {
    dispatch(fetchRandomQuote());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!current) return null;

  return (
    <div className={styles.container}>
      <blockquote className={styles.quote}>
        <p>{current.content}</p>
        <footer>— {current.author}</footer>
      </blockquote>
      <button onClick={() => dispatch(fetchRandomQuote())}>Next Quote</button>
    </div>
  );
};
