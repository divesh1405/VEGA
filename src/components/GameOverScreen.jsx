import { useGameStore } from '../store/useGameStore';
import { useWeaponStore } from '../store/useWeaponStore';

export const GameOverScreen = () => {
  const { level, totalKills, reset: resetGame } = useGameStore();
  const resetWeapons = useWeaponStore((s) => s.reset);

  const handleRestart = () => {
    resetGame();
    resetWeapons();
  };

  return (
    <div className="game-over-screen">
      <h1 className="game-over-title">YOU DIED</h1>
      <div className="game-over-stats">
        <div className="game-over-stat">
          Level Reached: <strong>{level}</strong>
        </div>
        <div className="game-over-stat">
          Total Kills: <strong>{totalKills}</strong>
        </div>
      </div>
      <button className="btn-restart" onClick={handleRestart}>
        TRY AGAIN
      </button>
    </div>
  );
};
