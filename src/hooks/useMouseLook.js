import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';

/**
 * Custom hook for pointer-lock mouse look.
 * Writes yaw/pitch to the game store so Player and Camera can read them.
 */
export const useMouseLook = () => {
  const setMouseRotation = useGameStore((s) => s.setMouseRotation);

  const handleMouseMove = useCallback(
    (e) => {
      if (document.pointerLockElement) {
        const sensitivity = 0.002;
        useGameStore.setState((state) => {
          const newYaw = state.mouseYaw - e.movementX * sensitivity;
          const newPitch = Math.max(
            -Math.PI / 3,
            Math.min(Math.PI / 6, state.mousePitch - e.movementY * sensitivity)
          );
          return { mouseYaw: newYaw, mousePitch: newPitch };
        });
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);
};
