import { useRef, useCallback, useEffect } from 'react';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useZombieAI } from '../hooks/useZombieAI';
import { useGameStore } from '../store/useGameStore';
import { activeZombies } from '../utils/zombies';

export const Zombie = ({ id, position, speed, damage, maxHealth, onKilled }) => {
  const rb = useRef(), meshRef = useRef();
  const hp = useRef(maxHealth);
  const takeDamage = useGameStore((s) => s.takeDamage);

  const handleHit = useCallback((dmg, kDir) => {
    hp.current -= dmg;
    if (hp.current <= 0) onKilled(id);
    if (kDir && rb.current) {
      rb.current.applyImpulse({ x: kDir.x * 8, y: 4, z: kDir.z * 8 }, true);
    }
  }, [id, onKilled]);

  useEffect(() => {
    activeZombies.set(id, { rb, onHit: handleHit });
    return () => activeZombies.delete(id);
  }, [id, handleHit]);

  useZombieAI(rb, meshRef, speed, damage, takeDamage);

  return (
    <RigidBody ref={rb} colliders={false} position={position} enabledRotations={[false, false, false]} linearDamping={0.5} userData={{ type: 'zombie', onHit: handleHit }}>
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
        <mesh position={[0.1, 1.15, -0.22]}><sphereGeometry args={[0.04, 8, 8]} /><meshBasicMaterial color="#ff3333" toneMapped={false} /></mesh>
        <mesh position={[-0.1, 1.15, -0.22]}><sphereGeometry args={[0.04, 8, 8]} /><meshBasicMaterial color="#ff3333" toneMapped={false} /></mesh>
      </group>
    </RigidBody>
  );
};
