import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { Zombie } from './Zombie';

const LEVEL_CONFIGS = {
  1: { count: 10, interval: 4.0, speed: 2.0, hp: 30, damage: 10 },
  2: { count: 15, interval: 3.5, speed: 2.3, hp: 40, damage: 12 },
  3: { count: 22, interval: 3.0, speed: 2.6, hp: 50, damage: 15 },
  4: { count: 30, interval: 2.5, speed: 3.0, hp: 60, damage: 18 },
  5: { count: 40, interval: 2.0, speed: 3.5, hp: 70, damage: 20 },
};

export const ZombieSpawner = () => {
  const { level, addKill, gameState } = useGameStore();
  const [zombies, setZombies] = useState([]);
  const spawnedCount = useRef(0);
  const lastSpawnTime = useRef(0);

  const config = LEVEL_CONFIGS[Math.min(level, 5)];

  // Reset spawner on level change
  useEffect(() => {
    const timer = setTimeout(() => {
      setZombies([]);
      spawnedCount.current = 0;
      lastSpawnTime.current = 0;
    }, 0);
    return () => clearTimeout(timer);
  }, [level, gameState]);

  useFrame((state) => {
    if (gameState !== 'PLAYING') return;

    const now = state.clock.getElapsedTime();
    if (
      zombies.length < config.count &&
      now - lastSpawnTime.current > config.interval
    ) {
      lastSpawnTime.current = now;
      spawnedCount.current += 1;

      // Spawn at random location around the perimeter of the 30x30 arena
      const side = Math.floor(Math.random() * 4);
      let x, z;
      const offset = 14;
      const randVal = (Math.random() - 0.5) * 28;

      if (side === 0) { x = -offset; z = randVal; }
      else if (side === 1) { x = offset; z = randVal; }
      else if (side === 2) { x = randVal; z = -offset; }
      else { x = randVal; z = offset; }

      const newZombie = {
        id: `${level}-${spawnedCount.current}`,
        position: [x, 0.5, z],
        speed: config.speed,
        damage: config.damage,
        hp: config.hp,
      };

      setZombies((prev) => [...prev, newZombie]);
    }
  });

  const handleKilled = (id) => {
    setZombies((prev) => prev.filter((z) => z.id !== id));
    addKill();
  };

  return (
    <>
      {zombies.map((z) => (
        <Zombie
          key={z.id}
          id={z.id}
          position={z.position}
          speed={z.speed}
          damage={z.damage}
          maxHealth={z.hp}
          onKilled={handleKilled}
        />
      ))}
    </>
  );
};
