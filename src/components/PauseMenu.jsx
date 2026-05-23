import { useGameStore } from '../store/useGameStore';
import { useWeaponStore } from '../store/useWeaponStore';

export const PauseMenu = () => {
  const { reset: resetGame, setGameState } = useGameStore();
  const resetWeapons = useWeaponStore((s) => s.reset);

  const handleResume = () => {
    setGameState('PLAYING');
    document.querySelector('canvas')?.requestPointerLock?.();
  };

  const handleRestart = () => {
    resetGame();
    resetWeapons();
    document.querySelector('canvas')?.requestPointerLock?.();
  };

  const handleMainMenu = () => {
    setGameState('MENU');
  };

  return (
    <div className="pause-menu">
      <div className="pause-menu-content">
        <h1 className="pause-menu-title">GAME PAUSED</h1>
        <div className="pause-menu-buttons">
          <button className="btn-pause-option" onClick={handleResume}>
            RESUME PLAY
          </button>
          <button className="btn-pause-option" onClick={handleRestart}>
            RESTART GAME
          </button>
          <button className="btn-pause-option btn-pause-quit" onClick={handleMainMenu}>
            QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};
