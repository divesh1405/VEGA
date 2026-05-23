import { useGameStore } from '../store/useGameStore';
import { useWeaponStore, WEAPONS } from '../store/useWeaponStore';

export const HUD = () => {
  const { health, maxHealth, level, kills, timeRemaining } = useGameStore();
  const { currentWeaponKey, currentMag, reserveAmmo, isReloading } = useWeaponStore();
  const activeWeapon = WEAPONS[currentWeaponKey];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <div className="hud-timer">
        <div className="hud-timer-label">SURVIVE</div>
        <div className="hud-timer-value">{formatTime(timeRemaining)}</div>
      </div>
      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">HP</span>
          <div className="health-bar-bg">
            <div className="health-bar-fill" style={{ width: `${(health / maxHealth) * 100}%` }} />
          </div>
          <span className="hud-value">{health}/{maxHealth}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Weapon</span>
          <span className="hud-value" style={{ textTransform: 'capitalize' }}>{activeWeapon.name}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Ammo</span>
          <span className="hud-value">
            {isReloading ? 'RELOADING...' : `${currentMag} / ${reserveAmmo}`}
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Level</span>
          <span className="hud-value">{level}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Kills</span>
          <span className="hud-value">{kills}</span>
        </div>
      </div>
    </>
  );
};
