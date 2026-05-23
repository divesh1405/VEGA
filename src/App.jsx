import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from './Scene';
import { Player } from './components/Player';
import { ThirdPersonCamera } from './components/ThirdPersonCamera';
import { Arena } from './components/Arena';
import { ZombieSpawner } from './components/ZombieSpawner';
import { Bullet } from './components/Bullet';
import { useMouseLook } from './hooks/useMouseLook';
import { useShooting } from './hooks/useShooting';
import { useGameStore } from './store/useGameStore';
import { useWeaponStore, WEAPONS } from './store/useWeaponStore';
import { Suspense, useCallback, useEffect } from 'react';
import './App.css';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'reload', keys: ['KeyR'] },
];

/** Inner component that lives inside KeyboardControls context */
const GameCanvas = () => {
  useMouseLook();
  useShooting();
  const bullets = useWeaponStore((s) => s.bullets);

  return (
    <Scene>
      <Suspense fallback={null}>
        <Player />
        <Arena />
        <ZombieSpawner />
        <ThirdPersonCamera />
        {bullets.map((b) => (
          <Bullet key={b.id} {...b} />
        ))}
      </Suspense>
    </Scene>
  );
};

function App() {
  const { gameState, health, maxHealth, level, kills, reset: resetGame, setGameState } = useGameStore();
  const { currentWeaponKey, currentMag, reserveAmmo, isReloading, reset: resetWeapons } = useWeaponStore();

  const activeWeapon = WEAPONS[currentWeaponKey];

  useEffect(() => {
    // Start game state immediately for testing
    setGameState('PLAYING');
  }, [setGameState]);

  const handleCanvasClick = useCallback((e) => {
    // Request pointer lock on canvas click
    e.target.requestPointerLock?.();
  }, []);

  return (
    <KeyboardControls map={keyboardMap}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {/* HUD */}
        <div className="hud">
          <div className="hud-item">
            <span className="hud-label">HP</span>
            <div className="health-bar-bg">
              <div
                className="health-bar-fill"
                style={{ width: `${(health / maxHealth) * 100}%` }}
              />
            </div>
            <span className="hud-value">{health}/{maxHealth}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">Weapon</span>
            <span className="hud-value" style={{ textTransform: 'capitalize' }}>
              {activeWeapon.name}
            </span>
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

        {/* Crosshair */}
        <div className="crosshair">+</div>

        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          onClick={handleCanvasClick}
          gl={{ antialias: true }}
          camera={{ fov: 60, near: 0.1, far: 100 }}
        >
          <GameCanvas />
        </Canvas>
      </div>
    </KeyboardControls>
  );
}

export default App;

