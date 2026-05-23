import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

// Arena dimensions
const ARENA_SIZE = 30;
const WALL_HEIGHT = 4;
const WALL_THICKNESS = 0.5;

// Obstacle presets — broken vehicles and barricades
const OBSTACLES = [
  { pos: [6, 0.6, -4], size: [2.5, 1.2, 1.2], color: '#4a3525' },   // wrecked car 1
  { pos: [-8, 0.6, 5], size: [2.5, 1.2, 1.2], color: '#3d3d3d' },   // wrecked car 2
  { pos: [3, 0.4, 8], size: [3, 0.8, 0.4], color: '#555' },          // barricade
  { pos: [-5, 0.4, -7], size: [3, 0.8, 0.4], color: '#555' },        // barricade
  { pos: [10, 0.5, 10], size: [1.5, 1, 1.5], color: '#3a2a1a' },     // debris pile
  { pos: [-10, 0.5, -10], size: [1.5, 1, 1.5], color: '#3a2a1a' },   // debris pile
  { pos: [-3, 0.6, 0], size: [2.5, 1.2, 1.2], color: '#2d3a2d' },    // wrecked car 3
  { pos: [12, 0.4, -8], size: [2, 0.8, 0.5], color: '#444' },        // barricade
];

// Street lights
const STREET_LIGHTS = [
  [7, 0, 0],
  [-7, 0, 0],
  [0, 0, 10],
  [0, 0, -10],
  [12, 0, 12],
  [-12, 0, -12],
];

const Wall = ({ position, size }) => (
  <RigidBody type="fixed" position={position} colliders="cuboid">
    <mesh receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#1a1a2e" transparent opacity={0} />
    </mesh>
  </RigidBody>
);

const StreetLight = ({ position }) => (
  <group position={position}>
    {/* Pole */}
    <mesh castShadow position={[0, 2, 0]}>
      <cylinderGeometry args={[0.08, 0.1, 4, 8]} />
      <meshStandardMaterial color="#333" metalness={0.9} roughness={0.3} />
    </mesh>
    {/* Lamp head */}
    <mesh position={[0, 4.1, 0]}>
      <boxGeometry args={[0.4, 0.15, 0.4]} />
      <meshStandardMaterial color="#555" metalness={0.8} />
    </mesh>
    {/* Light */}
    <pointLight
      position={[0, 3.8, 0]}
      intensity={80}
      distance={16}
      decay={2}
      color="#ffb855"
      castShadow
      shadow-mapSize-width={512}
      shadow-mapSize-height={512}
    />
  </group>
);

export const Arena = () => {
  const half = ARENA_SIZE / 2;

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.25, 0]} colliders="cuboid">
        <mesh receiveShadow>
          <boxGeometry args={[ARENA_SIZE, 0.5, ARENA_SIZE]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </RigidBody>

      {/* Road markings (visual only, no physics) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, ARENA_SIZE - 2]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[3, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, ARENA_SIZE - 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-3, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, ARENA_SIZE - 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Invisible boundary walls */}
      <Wall position={[half, WALL_HEIGHT / 2, 0]} size={[WALL_THICKNESS, WALL_HEIGHT, ARENA_SIZE]} />
      <Wall position={[-half, WALL_HEIGHT / 2, 0]} size={[WALL_THICKNESS, WALL_HEIGHT, ARENA_SIZE]} />
      <Wall position={[0, WALL_HEIGHT / 2, half]} size={[ARENA_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
      <Wall position={[0, WALL_HEIGHT / 2, -half]} size={[ARENA_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />

      {/* Obstacles */}
      {OBSTACLES.map((obs, i) => (
        <RigidBody key={`obs-${i}`} type="fixed" position={obs.pos} colliders="cuboid">
          <mesh castShadow receiveShadow>
            <boxGeometry args={obs.size} />
            <meshStandardMaterial color={obs.color} roughness={0.8} />
          </mesh>
        </RigidBody>
      ))}

      {/* Street Lights */}
      {STREET_LIGHTS.map((pos, i) => (
        <StreetLight key={`light-${i}`} position={pos} />
      ))}

      {/* Ambient ground fog plane (visual atmosphere) */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ARENA_SIZE, ARENA_SIZE]} />
        <meshStandardMaterial
          color="#0a0a15"
          transparent
          opacity={0.3}
          roughness={1}
        />
      </mesh>
    </group>
  );
};
