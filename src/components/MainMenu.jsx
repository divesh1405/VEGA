import { useGameStore } from '../store/useGameStore';
import { useWeaponStore } from '../store/useWeaponStore';

export const MainMenu = () => {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.reset);
  const resetWeapons = useWeaponStore((s) => s.reset);

  const handleStart = () => {
    resetGame();
    resetWeapons();
    setGameState('PLAYING');
  };

  return (
    <div className="main-menu">
      <div className="main-menu-content">
        <h1 className="main-menu-title">DEAD BLOCK</h1>
        <p className="main-menu-tagline">3D timed-survival zombie arcade shooter</p>

        <div className="controls-panel">
          <div className="controls-title">CONTROLS BOARD</div>
          <div className="controls-grid">
            <div><span>W A S D</span> Move</div>
            <div><span>Shift</span> Sprint</div>
            <div><span>Left Click</span> Shoot</div>
            <div><span>Right Click / Q</span> Sword Slash</div>
            <div><span>R</span> Reload Weapon</div>
            <div><span>ESC / Tab</span> Pause Game</div>
          </div>
        </div>

        <button className="btn-start-game" onClick={handleStart}>
          START SURVIVAL
        </button>
      </div>
    </div>
  );
};
