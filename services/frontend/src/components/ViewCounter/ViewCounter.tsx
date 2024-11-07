import styles from './ViewCounter.module.css';
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { clearHistory } from "../../store/quoteSlice";

export const ViewCounter = () => {
  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state.quote);

  return (
    <div className={styles.viewCounter}>
      Citations vues: {history.length}
      <button 
        onClick={() => dispatch(clearHistory())}
        className={styles.resetButton}
        title="Réinitialiser le compteur"
      >
        ↺
      </button>
    </div>
  );
};