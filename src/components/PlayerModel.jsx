import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { useWeaponStore } from '../store/useWeaponStore';
import * as THREE from 'three';

export const PlayerModel = () => {
  const slash = useRef(), sword = useRef(), muzzleFlash = useRef();
  const lastFireTime = useWeaponStore((s) => s.lastFireTime);

  useFrame(() => {
    // Melee swing visual animation
    const lastSwing = useGameStore.getState().lastMeleeSwingTime || 0;
    const dt = (performance.now() / 1000) - lastSwing;
    if (dt < 0.25) {
      const p = dt / 0.25;
      if (slash.current) {
        slash.current.visible = true;
        slash.current.rotation.z = -Math.PI / 3 + p * (Math.PI * 2 / 3);
        slash.current.scale.setScalar(0.8 + p * 0.8);
        slash.current.material.opacity = 1 - p;
      }
      if (sword.current) sword.current.rotation.y = -Math.PI / 4 - p * (Math.PI / 2);
    } else {
      if (slash.current) slash.current.visible = false;
      if (sword.current) sword.current.rotation.y = -Math.PI / 4;
    }

    // Muzzle flash visual duration
    const shotAge = (performance.now() / 1000) - lastFireTime;
    if (muzzleFlash.current) {
      muzzleFlash.current.visible = shotAge < 0.05;
    }
  });

  return (
    <group>
      <mesh castShadow position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color="#3a3a4a" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#5a5a6a" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0.3, 0.5, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
      <group ref={muzzleFlash} visible={false}>
        <pointLight position={[0.3, 0.5, -0.75]} intensity={10} distance={5} color="#ffbb44" decay={2} />
        <mesh position={[0.3, 0.5, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.02, 0.1, 8]} />
          <meshBasicMaterial color="#ffffcc" toneMapped={false} />
        </mesh>
      </group>
      <group ref={sword} position={[-0.3, 0.5, -0.2]}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <boxGeometry args={[0.05, 0.9, 0.02]} />
          <meshStandardMaterial color="#88aaff" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      <mesh ref={slash} position={[0, 0.5, -1.0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.8, 1.2, 32, 1, 0, Math.PI]} />
        <meshBasicMaterial color="#ffff55" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
