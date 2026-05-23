import { useRef, useState } from 'react';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useZombieAI } from '../hooks/useZombieAI';
import { useGameStore } from '../store/useGameStore';

export const Zombie = ({ id, position, speed, damage, maxHealth, onKilled }) => {
  const rb = useRef();
  const meshRef = useRef();
  const [hp, setHp] = useState(maxHealth);
  const takeDamage = useGameStore((s) => s.takeDamage);

  const handleHit = (dmg) => {
    setHp((prev) => {
      const next = prev - dmg;
      if (next <= 0) onKilled(id);
      return next;
    });
  };

  useZombieAI(rb, meshRef, speed, damage, takeDamage);

  return (
    <RigidBody
      ref={rb}
      colliders={false}
      position={position}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
      userData={{ type: 'zombie', onHit: handleHit }}
    >
      <CapsuleCollider args={[0.5, 0.35]} position={[0, 0.85, 0]} />
      <group ref={meshRef}>
        <mesh castShadow position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
          <meshStandardMaterial color="#447744" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#335533" roughness={0.8} />
        </mesh>
        <mesh position={[0.1, 1.15, -0.22]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ff3333" toneMapped={false} />
        </mesh>
        <mesh position={[-0.1, 1.15, -0.22]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ff3333" toneMapped={false} />
        </mesh>
      </group>
    </RigidBody>
  );
};
