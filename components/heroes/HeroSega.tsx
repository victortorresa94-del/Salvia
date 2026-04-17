"use client";

import { useRef, useEffect, useMemo, Suspense, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/models/sega_master_system.glb");

// ─── Error boundary ───────────────────────────────────────────────────────────

class Catch extends Component<{ children: ReactNode; fallback: ReactNode }, { err: boolean }> {
  constructor(p: { children: ReactNode; fallback: ReactNode }) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

// ─── Mouse tracker ────────────────────────────────────────────────────────────

function useMouse() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return ref;
}

// ─── Scroll zoom ──────────────────────────────────────────────────────────────

function useScrollZoom(target: React.RefObject<HTMLDivElement>) {
  const zoomRef = useRef(0);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const h = (e: WheelEvent) => {
      zoomRef.current = Math.max(-1.5, Math.min(1.5, zoomRef.current + e.deltaY * 0.001));
    };
    el.addEventListener("wheel", h, { passive: true });
    return () => el.removeEventListener("wheel", h);
  }, [target]);
  return zoomRef;
}

// ─── Camera ───────────────────────────────────────────────────────────────────

function Camera({
  mouse,
  zoom,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  zoom: React.MutableRefObject<number>;
}) {
  const { camera } = useThree();
  useFrame(() => {
    const targetZ = 2.5 + zoom.current;
    camera.position.x += (mouse.current.x * 1.0 - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * 0.5 + 0.3 - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Sega model ───────────────────────────────────────────────────────────────

function SegaModel({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF("/models/sega_master_system.glb");
  const groupRef = useRef<THREE.Group>(null);

  const scaledScene = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const s = 4.5 / Math.max(size.x, size.y, size.z);
    clone.scale.setScalar(s);
    clone.position.set(-centre.x * s, -centre.y * s, -centre.z * s);
    clone.traverse((c) => { if (c instanceof THREE.Mesh) { c.castShadow = true; c.receiveShadow = true; } });
    return clone;
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (mouse.current.x * 0.4 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-mouse.current.y * 0.12 - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scaledScene} />
    </group>
  );
}

// ─── Fallback when GLB missing ────────────────────────────────────────────────

function SegaFallback() {
  const ref = useRef<THREE.Group>(null);
  return (
    <group ref={ref}>
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[1.8, 0.22, 1.3]} />
        <meshPhysicalMaterial color="#1a1410" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.35, -0.3]}>
        <boxGeometry args={[1.2, 0.07, 0.5]} />
        <meshPhysicalMaterial color="#111" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ scrollTarget }: { scrollTarget: React.RefObject<HTMLDivElement> }) {
  const mouse = useMouse();
  const zoom = useScrollZoom(scrollTarget);

  return (
    <>
      <Camera mouse={mouse} zoom={zoom} />
      <ambientLight intensity={0.3} color="#d4a84b" />
      <directionalLight position={[3, 5, 3]} intensity={3} color="#fff8e8" castShadow shadow-mapSize={[1024,1024]} />
      <pointLight position={[-3, 1, 2]} intensity={2} color="#d4a84b" distance={8} decay={2} />
      <pointLight position={[0, -1, 2]} intensity={0.6} color="#b86a3c" distance={4} decay={2} />

      <Suspense fallback={null}>
        <Environment preset="warehouse" background={false} />
      </Suspense>

      <Catch fallback={<SegaFallback />}>
        <Suspense fallback={<SegaFallback />}>
          <SegaModel mouse={mouse} />
        </Suspense>
      </Catch>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function HeroSega() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0.15, 2.5], fov: 52 }} gl={{ antialias: true, alpha: true }} style={{ width: "100%", height: "100%" }}>
        <Scene scrollTarget={containerRef} />
      </Canvas>
    </div>
  );
}
