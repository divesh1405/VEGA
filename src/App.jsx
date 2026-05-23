import { Canvas, useFrame } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Scene } from './Scene';
import { Player } from './components/Player';
import { ThirdPersonCamera } from './components/ThirdPersonCamera';
import { Arena } from './components/Arena';
import { ZombieSpawner } from './components/ZombieSpawner';
import { Bullet } from './components/Bullet';
import { HUD } from './components/HUD';
import { GameOverScreen } from './components/GameOverScreen';
import { LevelCompleteScreen } from './components/LevelCompleteScreen';
import { PickupSpawner } from './components/PickupSpawner';
import { MainMenu } from './components/MainMenu';
import { PauseMenu } from './components/PauseMenu';
import { useMouseLook } from './hooks/useMouseLook';
import { useShooting } from './hooks/useShooting';
import { useGameStore } from './store/useGameStore';
import { useWeaponStore } from './store/useWeaponStore';
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
  const tickTimer = useGameStore((s) => s.tickTimer);

  useFrame((state, delta) => {
    tickTimer(delta);
  });

  return (
    <Scene>
      <Suspense fallback={null}>
        <Player />
        <Arena />
        <ZombieSpawner />
        <PickupSpawner />
        <ThirdPersonCamera />
        {bullets.map((b) => (
          <Bullet key={b.id} {...b} />
        ))}
      </Suspense>
    </Scene>
  );
};

function App() {
  const { gameState, lastDamageTime, setGameState } = useGameStore();

  useEffect(() => {
    const handlePointerLockChange = () => {
      if (document.pointerLockElement === null && useGameStore.getState().gameState === 'PLAYING') {
        setGameState('PAUSED');
      }
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [setGameState]);

  const handleCanvasClick = useCallback((e) => {
    if (gameState !== 'PLAYING') return;
    // Request pointer lock on canvas click
    e.target.requestPointerLock?.();
  }, [gameState]);

  return (
    <KeyboardControls map={keyboardMap}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {/* HUD - only show when playing */}
        {gameState === 'PLAYING' && <HUD />}

        {/* Crosshair */}
        {gameState === 'PLAYING' && <div className="crosshair">+</div>}

        {/* Damage Flash key'd trigger */}
        {lastDamageTime > 0 && gameState === 'PLAYING' && (
          <div key={lastDamageTime} className="damage-flash" />
        )}

        {/* Level Complete / Game Over Screen Overlays */}
        {gameState === 'MENU' && <MainMenu />}
        {gameState === 'PAUSED' && <PauseMenu />}
        {gameState === 'LEVEL_COMPLETE' && <LevelCompleteScreen />}
        {gameState === 'GAMEOVER' && <GameOverScreen />}

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

