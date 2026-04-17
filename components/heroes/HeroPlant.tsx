"use client";

import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/models/plant.glb");

// ─── Mouse tracker (world-space tilt) ────────────────────────────────────────

function useMouse() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return ref;
}

// ─── Camera follows mouse smoothly ───────────────────────────────────────────

function CameraFollow({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.4 + 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

// ─── Plant model ──────────────────────────────────────────────────────────────

function PlantModel({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF("/models/plant.glb");
  const groupRef = useRef<THREE.Group>(null);

  const plantScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const existing = child.material as THREE.MeshStandardMaterial;
      child.material = new THREE.MeshPhysicalMaterial({
        map: existing.map ?? null,
        normalMap: existing.normalMap ?? null,
        roughnessMap: existing.roughnessMap ?? null,
        color: existing.color ?? new THREE.Color(0xffffff),
        roughness: 0.45,
        metalness: existing.metalness ?? 0,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        sheen: 0.5,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color("#87a878"),
        side: existing.side,
      });
      child.castShadow = true;
      child.receiveShadow = true;
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    // Subtle tilt following mouse — not rotation, tilt
    groupRef.current.rotation.y += (mouse.current.x * 0.25 - groupRef.current.rotation.y) * 0.06;
    groupRef.current.rotation.x += (mouse.current.y * 0.08 - groupRef.current.rotation.x) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, -0.73, 0]}>
      <primitive object={plantScene} />
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene() {
  const mouse = useMouse();
  return (
    <>
      <CameraFollow mouse={mouse} />
      <ambientLight intensity={0.2} color="#4d6b41" />
      <spotLight position={[0, 5, 2]} intensity={60} angle={0.35} penumbra={0.6} color="#f5e8c8" castShadow shadow-mapSize={[1024,1024]} />
      <pointLight position={[-2, 1, 2]} intensity={1.5} color="#87a878" distance={6} decay={2} />
      <pointLight position={[2, -0.5, 1]} intensity={0.8} color="#b580c7" distance={5} decay={2} />
      <Suspense fallback={null}>
        <Environment preset="dawn" background={false} />
        <PlantModel mouse={mouse} />
        <ContactShadows position={[0, -1.2, 0]} blur={3} opacity={0.5} scale={5} far={2} color="#000a00" />
      </Suspense>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function HeroPlant() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 3.5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      shadows
    >
      <Scene />
    </Canvas>
  );
}
