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
      {/* Compteur en haut à droite */}
      <div className={styles.statsCorner}>
        Citations vues: {history.length}
        <button 
          onClick={() => dispatch(clearHistory())}
          className={styles.resetButton}
          title="Réinitialiser le compteur"
        >
          ↺
        </button>
      </div>

      <blockquote className={styles.quote}>
        <p>{current.content}</p>
        <footer>— {current.author}</footer>
      </blockquote>

      <button onClick={() => dispatch(fetchRandomQuote())}>
        Citation suivante
      </button>
    </div>
  );
};