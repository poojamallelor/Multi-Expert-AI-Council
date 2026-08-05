import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Icosahedron, Stars } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.05;
      ref.current.rotation.x += dt * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#7dd3fc" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Core({ active }: { active: boolean }) {
  const inner = useRef<THREE.Mesh>(null!);
  const outer = useRef<THREE.Mesh>(null!);
  const wire = useRef<THREE.Mesh>(null!);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (inner.current) {
      inner.current.rotation.y += dt * 0.3;
      inner.current.rotation.x += dt * 0.15;
      const s = active ? 1.15 + Math.sin(t * 4) * 0.04 : 1 + Math.sin(t * 1.5) * 0.03;
      inner.current.scale.setScalar(s);
    }
    if (outer.current) {
      outer.current.rotation.y -= dt * 0.1;
      outer.current.rotation.z += dt * 0.05;
    }
    if (wire.current) {
      wire.current.rotation.y += dt * 0.2;
      wire.current.rotation.x -= dt * 0.1;
    }
  });

  return (
    <group>
      {/* Inner glowing core */}
      <Sphere ref={inner} args={[0.8, 64, 64]}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0ea5e9"
          emissiveIntensity={active ? 2.2 : 1.4}
          roughness={0.2}
          metalness={0.6}
        />
      </Sphere>
      {/* Wireframe icosahedron */}
      <Icosahedron ref={wire} args={[1.3, 1]}>
        <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.5} />
      </Icosahedron>
      {/* Outer translucent sphere */}
      <Sphere ref={outer} args={[1.7, 32, 32]}>
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.15} />
      </Sphere>
    </group>
  );
}

function Scene({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.position.y = Math.sin(t * 0.5) * 0.1;
      group.current.rotation.y = Math.sin(t * 0.2) * 0.15;
    }
  });
  return (
    <group ref={group}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#22d3ee" />
      <pointLight position={[-5, -3, -5]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#ec4899" />
      <Core active={active} />
      <ParticleField />
      <Stars radius={50} depth={30} count={1500} factor={2} fade speed={0.5} />
    </group>
  );
}

export function NeuralOrb({ active = false }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene active={active} />
      </Suspense>
    </Canvas>
  );
}
