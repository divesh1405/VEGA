import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useWeaponStore, WEAPONS } from '../store/useWeaponStore';

export const AmmoPickup = ({ id, position, onCollected }) => {
  const meshRef = useRef();
  const { currentWeaponKey, addAmmo } = useWeaponStore();

  useEffect(() => {
    const timer = setTimeout(() => onCollected(id), 15000);
    return () => clearTimeout(timer);
  }, [id, onCollected]);

  const handleIntersection = (event) => {
    const other = event.other.rigidBodyObject;
    if (other && other.userData && other.userData.type === 'player') {
      const activeWeapon = WEAPONS[currentWeaponKey];
      addAmmo(activeWeapon.magSize * 2);
      onCollected(id);
    }
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
    }
  });

  return (
    <RigidBody type="fixed" position={position} sensor onIntersectionEnter={handleIntersection} colliders="cuboid">
      <group ref={meshRef}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.4]} />
          <meshStandardMaterial color="#00ff66" emissive="#005511" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.21]}>
          <boxGeometry args={[0.4, 0.1, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </RigidBody>
  );
};
