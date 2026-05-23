import { Environment, ContactShadows } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { Suspense } from 'react';

export const Scene = ({ children }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#5577bb" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.8}
        color="#d0c0ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Atmosphere */}
      <fog attach="fog" args={['#0a0a15', 18, 55]} />
      <color attach="background" args={['#0a0a15']} />

      <Suspense fallback={null}>
        <Physics gravity={[0, -15, 0]}>
          {children}
        </Physics>
      </Suspense>

      <ContactShadows
        opacity={0.4}
        scale={30}
        blur={1.5}
        far={15}
        resolution={256}
        color="#000000"
      />
    </>
  );
};
