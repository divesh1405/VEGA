import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { AmmoPickup } from './AmmoPickup';

export const PickupSpawner = () => {
  const { gameState, level } = useGameStore();
  const [pickups, setPickups] = useState([]);
  const spawnedCount = useRef(0);
  const lastSpawnTime = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPickups([]);
      spawnedCount.current = 0;
      lastSpawnTime.current = 0;
    }, 0);
    return () => clearTimeout(timer);
  }, [level, gameState]);

  useFrame((state) => {
    if (gameState !== 'PLAYING') return;

    const now = state.clock.getElapsedTime();
    if (pickups.length < 3 && now - lastSpawnTime.current > 12) {
      lastSpawnTime.current = now;
      spawnedCount.current += 1;

      const x = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 26;

      const newPickup = {
        id: `ammo-${level}-${spawnedCount.current}`,
        position: [x, 0.25, z],
      };
      setPickups((prev) => [...prev, newPickup]);
    }
  });

  const handleCollected = (id) => {
    setPickups((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      {pickups.map((p) => (
        <AmmoPickup key={p.id} id={p.id} position={p.position} onCollected={handleCollected} />
      ))}
    </>
  );
};
