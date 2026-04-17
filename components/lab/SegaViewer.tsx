"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/models/sega_master_system.glb");

function SegaModel() {
  const { scene } = useGLTF("/models/sega_master_system.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Auto-rotate suave
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  // Centre + scale the model to fit the viewer
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2.2 / maxDim;

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={scale}
        position={[-centre.x * scale, -centre.y * scale, -centre.z * scale]}
      />
    </group>
  );
}

function ModelNotFound() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.6, 1.4]} />
      <meshPhysicalMaterial color="#1a1410" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

export default function SegaViewer() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#0e0a08" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 3]} intensity={2} color="#f5e8c8" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#87a878" />

      <Suspense fallback={null}>
        <Environment preset="warehouse" background={false} />
        <SegaModel />
        <ContactShadows
          position={[0, -1.1, 0]}
          blur={2.5}
          opacity={0.5}
          scale={6}
          far={2}
          resolution={512}
          color="#000000"
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={false}
      />
    </Canvas>
  );
}
