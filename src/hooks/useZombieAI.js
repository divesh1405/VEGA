import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export const useZombieAI = (rb, meshRef, speed, damage, onAttackPlayer) => {
  const lastAttackTime = { current: 0 };

  useFrame((state, delta) => {
    if (!rb.current) return;

    const { playerPosition, gameState } = useGameStore.getState();
    if (gameState !== 'PLAYING') {
      rb.current.setLinvel({ x: 0, y: rb.current.linvel().y, z: 0 }, true);
      return;
    }

    const zombiePos = rb.current.translation();
    const playerPos = new THREE.Vector3(...playerPosition);
    
    // Direction vector on X/Z plane
    const dir = new THREE.Vector3().subVectors(playerPos, zombiePos);
    dir.y = 0; // Keep horizontal movement
    
    const distance = dir.length();
    
    if (distance > 0.1) {
      dir.normalize();
      
      // Face the player
      const angle = Math.atan2(dir.x, dir.z);
      if (meshRef.current) {
        meshRef.current.rotation.y = angle;
      }
      
      // Move toward player
      const velocity = rb.current.linvel();
      rb.current.setLinvel(
        {
          x: dir.x * speed,
          y: velocity.y,
          z: dir.z * speed,
        },
        true
      );
    }

    // Melee attack if within range (e.g. 1.2 units)
    if (distance < 1.2) {
      const now = state.clock.getElapsedTime();
      if (now - lastAttackTime.current > 1.0) { // attack every 1 second
        lastAttackTime.current = now;
        onAttackPlayer(damage);
      }
    }
  });
};
