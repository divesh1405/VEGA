import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';
import { useSwordCombat } from '../hooks/useSwordCombat';
import { PlayerModel } from './PlayerModel';
import * as THREE from 'three';

const WALK_SPEED = 6;
const SPRINT_SPEED = 10;

export const Player = () => {
  const rb = useRef(), meshRef = useRef();
  const [, getKeys] = useKeyboardControls();
  useSwordCombat();

  useFrame(() => {
    if (!rb.current) return;
    const gameState = useGameStore.getState().gameState;
    if (gameState !== 'PLAYING') {
      const velocity = rb.current.linvel();
      rb.current.setLinvel({ x: 0, y: velocity.y, z: 0 }, true);
      return;
    }
    const { forward, backward, left, right, sprint } = getKeys();
    const yaw = useGameStore.getState().mouseYaw;
    const velocity = rb.current.linvel();

    const inputDir = new THREE.Vector3(0, 0, 0);
    if (forward) inputDir.z -= 1;
    if (backward) inputDir.z += 1;
    if (left) inputDir.x -= 1;
    if (right) inputDir.x += 1;
    inputDir.normalize();

    const speed = sprint ? SPRINT_SPEED : WALK_SPEED;
    const moveDir = new THREE.Vector3(
      inputDir.x * Math.cos(yaw) - inputDir.z * Math.sin(yaw),
      0,
      inputDir.x * Math.sin(yaw) + inputDir.z * Math.cos(yaw)
    );
    moveDir.multiplyScalar(speed);

    rb.current.setLinvel({ x: moveDir.x, y: velocity.y, z: moveDir.z }, true);
    if (meshRef.current) meshRef.current.rotation.y = yaw;

    const pos = rb.current.translation();
    useGameStore.getState().setPlayerPosition([pos.x, pos.y, pos.z]);
  });

  return (
    <RigidBody ref={rb} colliders={false} mass={1} enabledRotations={[false, false, false]} position={[0, 2, 0]} linearDamping={0.5} userData={{ type: 'player' }}>
      <CapsuleCollider args={[0.5, 0.35]} position={[0, 0.85, 0]} />
      <group ref={meshRef}>
        <PlayerModel />
      </group>
    </RigidBody>
  );
};
