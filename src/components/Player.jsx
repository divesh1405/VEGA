import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

const WALK_SPEED = 6;
const SPRINT_SPEED = 10;

export const Player = () => {
  const rb = useRef();
  const meshRef = useRef();
  const [, getKeys] = useKeyboardControls();

  useFrame(() => {
    if (!rb.current) return;

    const { forward, backward, left, right, sprint } = getKeys();
    const yaw = useGameStore.getState().mouseYaw;
    const velocity = rb.current.linvel();

    // Build movement vector relative to camera yaw
    const inputDir = new THREE.Vector3(0, 0, 0);
    if (forward) inputDir.z -= 1;
    if (backward) inputDir.z += 1;
    if (left) inputDir.x -= 1;
    if (right) inputDir.x += 1;
    inputDir.normalize();

    // Rotate input direction by yaw
    const speed = sprint ? SPRINT_SPEED : WALK_SPEED;
    const moveDir = new THREE.Vector3(
      inputDir.x * Math.cos(yaw) - inputDir.z * Math.sin(yaw),
      0,
      inputDir.x * Math.sin(yaw) + inputDir.z * Math.cos(yaw)
    );
    moveDir.multiplyScalar(speed);

    // Apply movement (preserve Y velocity for gravity)
    rb.current.setLinvel({ x: moveDir.x, y: velocity.y, z: moveDir.z }, true);

    // Rotate mesh to face yaw direction
    if (meshRef.current) {
      meshRef.current.rotation.y = yaw;
    }

    // Write position to store for camera to follow
    const pos = rb.current.translation();
    useGameStore.getState().setPlayerPosition([pos.x, pos.y, pos.z]);
  });

  return (
    <RigidBody
      ref={rb}
      colliders={false}
      mass={1}
      enabledRotations={[false, false, false]}
      position={[0, 2, 0]}
      linearDamping={0.5}
    >
      <CapsuleCollider args={[0.5, 0.35]} position={[0, 0.85, 0]} />
      <group ref={meshRef}>
        {/* Body - dark capsule placeholder */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
          <meshStandardMaterial color="#3a3a4a" roughness={0.6} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#5a5a6a" roughness={0.5} />
        </mesh>
        {/* Gun arm indicator — points forward so you can see aim direction */}
        <mesh castShadow position={[0.3, 0.5, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
          <meshStandardMaterial color="#222" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </RigidBody>
  );
};
