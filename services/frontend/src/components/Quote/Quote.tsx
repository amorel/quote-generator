import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchRandomQuote, toggleFavorite } from "../../store/quoteSlice";
import styles from "./Quote.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAuth } from "../../contexts/AuthContext";
import { FavoriteButton } from "./FavoriteButton";

export const Quote = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current, loading, error, history, favorites } = useAppSelector(
    (state) => state.quote
  );

  const handleToggleFavorite = async (quoteId: string) => {
    try {
      await dispatch(toggleFavorite(quoteId)).unwrap();
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("Session expirée")) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && !current) {
      dispatch(fetchRandomQuote());
    }
  }, [dispatch, isAuthenticated, current]);

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter pour voir les citations</div>;
  }

  if (error) return <div>Error: {error}</div>;
  if (!current) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.statsCorner}>Citations vues: {history.length}</div>

      <div className={styles.quoteWrapper}>
        <blockquote className={styles.quote}>
          <p>{current.content}</p>
          <footer>— {current.author}</footer>
        </blockquote>
        <FavoriteButton
          isFavorite={favorites.includes(current._id)}
          onClick={() => handleToggleFavorite(current._id)}
          disabled={loading}
        />
      </div>

      <button onClick={() => dispatch(fetchRandomQuote())} disabled={loading}>
        {loading ? "Chargement..." : "Citation suivante"}
      </button>
    </div>
  );
};
