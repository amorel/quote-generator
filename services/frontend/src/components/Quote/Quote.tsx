import { useEffect } from "react";
import { fetchRandomQuote, clearHistory } from "../../store/quoteSlice";
import styles from "./Quote.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAuth } from "../../contexts/AuthContext";

export const Quote = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { current, loading, error, history } = useAppSelector(
    (state) => state.quote
  );

  useEffect(() => {
    if (isAuthenticated && !current) {
      dispatch(fetchRandomQuote());
    }
  }, [dispatch, isAuthenticated, current]);

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter pour voir les citations</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!current) return null;

  return (
    <div className={styles.container}>
      <blockquote className={styles.quote}>
        <p>{current.content}</p>
        <footer>— {current.author}</footer>
      </blockquote>
      <div className={styles.stats}>
        <p>Citations vues: {history.length}</p>
      </div>
      <button onClick={() => dispatch(fetchRandomQuote())}>
        Citation suivante
      </button>
      {history.length > 0 && (
        <button
          onClick={() => dispatch(clearHistory())}
          className={styles.clearButton}
        >
          Réinitialiser l'historique
        </button>
      )}
    </div>
  );
};
