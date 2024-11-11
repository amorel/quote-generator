import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const FavoriteButton = ({
  isFavorite,
  onClick,
  disabled,
}: FavoriteButtonProps) => (
  <button
    className={`${styles.favoriteButton} ${isFavorite ? styles.active : ""} ${
      disabled ? styles.disabled : ""
    }`}
    onClick={onClick}
    disabled={disabled}
    title={
      disabled
        ? "Chargement..."
        : isFavorite
        ? "Retirer des favoris"
        : "Ajouter aux favoris"
    }
  >
    {isFavorite ? "★" : "☆"}
  </button>
);
