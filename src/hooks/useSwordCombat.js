import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { activeZombies } from '../utils/zombies';
import * as THREE from 'three';

const MELEE_COOLDOWN = 0.8; // seconds
const MELEE_RANGE = 2.4;    // meters
const MELEE_CONE = 0.5;     // cos(60 degrees) = 0.5 (120 degree total cone)
const MELEE_DAMAGE = 35;

export const useSwordCombat = () => {
  const { camera } = useThree();
  const lastSwingTime = useRef(0);
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    const triggerSwing = () => {
      const { playerPosition, gameState } = useGameStore.getState();
      if (gameState !== 'PLAYING') return;

      const now = performance.now() / 1000;
      if (now - lastSwingTime.current < MELEE_COOLDOWN) return;
      lastSwingTime.current = now;

      // Notify store to play swing visual effect
      useGameStore.setState({ lastMeleeSwingTime: now });

      const playerPos = new THREE.Vector3(...playerPosition);
      
      // Calculate player forward vector from camera direction
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();

      // Check all active zombies
      activeZombies.forEach((zombie, id) => {
        if (!zombie.rb.current) return;
        const zPos = zombie.rb.current.translation();
        const zombiePos = new THREE.Vector3(zPos.x, zPos.y, zPos.z);

        const dist = playerPos.distanceTo(zombiePos);
        if (dist <= MELEE_RANGE) {
          const toZombie = zombiePos.clone().sub(playerPos);
          toZombie.y = 0;
          toZombie.normalize();

          const dot = forward.dot(toZombie);
          if (dot >= MELEE_CONE) {
            // Hit! Apply damage and knockback direction
            zombie.onHit(MELEE_DAMAGE, forward);
          }
        }
      });
    };

    const handleMouseDown = (e) => {
      if (!document.pointerLockElement) return;
      if (e.button === 2) { // Right Click
        e.preventDefault();
        triggerSwing();
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === 'KeyQ') {
        triggerSwing();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [camera]);
};
