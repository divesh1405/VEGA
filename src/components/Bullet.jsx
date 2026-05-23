import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useWeaponStore } from '../store/useWeaponStore';

export const Bullet = ({ id, position, velocity, damage }) => {
  const rb = useRef();
  const removeBullet = useWeaponStore((s) => s.removeBullet);

  // Auto-destroy bullet after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      removeBullet(id);
    }, 2000);
    return () => clearTimeout(timer);
  }, [id, removeBullet]);

  const handleIntersection = (event) => {
    // If we hit a zombie (zombie bodies can have custom userData or name)
    const other = event.other.rigidBodyObject;
    if (other && other.userData && other.userData.type === 'zombie') {
      if (other.userData.onHit) {
        other.userData.onHit(damage);
      }
    }
    // Remove the bullet on hit
    removeBullet(id);
  };

  return (
    <RigidBody
      ref={rb}
      type="dynamic"
      position={position}
      linearVelocity={velocity}
      gravityScale={0}
      sensor
      onIntersectionEnter={handleIntersection}
      colliders="ball"
      ccd
    >
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffff55" toneMapped={false} />
      </mesh>
    </RigidBody>
  );
};
