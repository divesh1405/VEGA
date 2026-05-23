import { useGameStore } from '../store/useGameStore';
import { useWeaponStore, WEAPONS, WEAPON_ORDER } from '../store/useWeaponStore';

export const LevelCompleteScreen = () => {
  const { level, kills, nextLevel } = useGameStore();
  const upgradeWeapon = useWeaponStore((s) => s.upgradeWeapon);

  const nextWeaponKey = WEAPON_ORDER[Math.min(level, WEAPON_ORDER.length - 1)];
  const nextWeaponName = WEAPONS[nextWeaponKey].name;
  const isNewUnlock = level < WEAPON_ORDER.length;

  const handleNextLevel = () => {
    upgradeWeapon(level + 1);
    nextLevel();
  };

  return (
    <div className="level-complete-screen">
      <h1 className="level-complete-title">LEVEL {level} COMPLETE</h1>
      <div className="level-complete-stats">
        <div className="level-complete-stat">
          Zombies Eliminated: <strong>{kills}</strong>
        </div>
        {isNewUnlock ? (
          <div className="weapon-unlock-notice">
            UPGRADED TO: <span>{nextWeaponName.toUpperCase()}</span>
          </div>
        ) : (
          <div className="weapon-unlock-notice">
            MAX WEAPON POWER ACTIVE
          </div>
        )}
      </div>
      <button className="btn-next-level" onClick={handleNextLevel}>
        START LEVEL {level + 1}
      </button>
    </div>
  );
};
