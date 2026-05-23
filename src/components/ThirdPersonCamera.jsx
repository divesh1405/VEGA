import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

// Over-the-shoulder offset (slightly right and above player)
const OFFSET = new THREE.Vector3(1.5, 3, 5);
const LOOK_AHEAD = new THREE.Vector3(0, 1.5, 0);
const LERP_SPEED = 8;

export const ThirdPersonCamera = () => {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 5, 10));

  useFrame((_, delta) => {
    const { playerPosition, mouseYaw, mousePitch } = useGameStore.getState();
    const [px, py, pz] = playerPosition;
    const playerPos = new THREE.Vector3(px, py, pz);

    // Compute desired camera position:
    // rotate offset around player by yaw, then apply pitch
    const rotatedOffset = OFFSET.clone();
    rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), mouseYaw);

    // Apply pitch by tilting the offset vertically
    const pitchAxis = new THREE.Vector3(-rotatedOffset.z, 0, rotatedOffset.x).normalize();
    rotatedOffset.applyAxisAngle(pitchAxis, mousePitch * 0.3);

    const desiredPos = playerPos.clone().add(rotatedOffset);

    // Smoothly interpolate camera position
    currentPos.current.lerp(desiredPos, 1 - Math.exp(-LERP_SPEED * delta));
    camera.position.copy(currentPos.current);

    // Look at point slightly above player
    const lookTarget = playerPos.clone().add(LOOK_AHEAD);
    camera.lookAt(lookTarget);
  });

  return null;
};
