"use client";

import { Suspense, useRef, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ─── Error boundary — handles missing GLB gracefully ─────────────────────────

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { error: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { error: false };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

// ─── Placeholder shown while model is missing ─────────────────────────────────

function PendingModel() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.8, 0.25, 1.3]} />
        <meshPhysicalMaterial color="#1a1410" roughness={0.7} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.38, -0.35]}>
        <boxGeometry args={[1.2, 0.08, 0.55]} />
        <meshPhysicalMaterial color="#111" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

// ─── Real model (suspends while loading) ─────────────────────────────────────

function SegaModel() {
  const { scene } = useGLTF("/models/sega_master_system.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

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

// ─── Overlay shown when model file is missing ─────────────────────────────────

function MissingOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#6e6b63",
        }}
      >
        Añade el archivo a
      </span>
      <code
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.75rem",
          color: "#d4a84b",
          background: "rgba(255,255,255,0.04)",
          padding: "0.3rem 0.6rem",
          borderRadius: "2px",
        }}
      >
        public/models/sega_master_system.glb
      </code>
    </div>
  );
}

// ─── Main viewer ──────────────────────────────────────────────────────────────

export default function SegaViewer() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
        </Suspense>

        <ModelErrorBoundary fallback={<PendingModel />}>
          <Suspense fallback={<PendingModel />}>
            <SegaModel />
          </Suspense>
        </ModelErrorBoundary>

        <ContactShadows
          position={[0, -1.1, 0]}
          blur={2.5}
          opacity={0.4}
          scale={6}
          far={2}
          resolution={256}
          color="#000000"
        />

        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      {/* DOM overlay — shown only when model is missing */}
      <MissingOverlay />
    </div>
  );
}
