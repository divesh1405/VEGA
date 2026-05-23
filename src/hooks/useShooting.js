import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useWeaponStore } from '../store/useWeaponStore';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export const useShooting = () => {
  const { camera } = useThree();
  const shoot = useWeaponStore((s) => s.shoot);
  const reload = useWeaponStore((s) => s.reload);
  const isReloading = useWeaponStore((s) => s.isReloading);
  const currentMag = useWeaponStore((s) => s.currentMag);
  const isMouseDown = useRef(false);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!document.pointerLockElement) return;
      if (e.button === 0) {
        isMouseDown.current = true;
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        isMouseDown.current = false;
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === 'KeyR' && !isReloading) {
        reload();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reload, isReloading]);

  useFrame(() => {
    const gameState = useGameStore.getState().gameState;
    if (gameState !== 'PLAYING' && gameState !== 'MENU') return; // Only allow shooting in active states
    if (!document.pointerLockElement) {
      isMouseDown.current = false;
      return;
    }

    if (isMouseDown.current) {
      const { playerPosition } = useGameStore.getState();
      
      // Calculate shooting origin: slightly in front/right of the player (simulating a gun)
      const pPos = new THREE.Vector3(...playerPosition);
      
      // Aim direction is the camera's forward direction
      const aimDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
      
      // Spawn bullet slightly offset from player center
      const spawnPos = pPos.clone().add(new THREE.Vector3(0, 1.2, 0)).add(aimDir.clone().multiplyScalar(0.5));

      const fired = shoot(spawnPos, aimDir);
      
      if (fired && currentMag <= 1) {
        // Auto-reload if empty
        reload();
      }
    }
  });
};
