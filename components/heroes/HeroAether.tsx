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
    const targetZ = 2.8 + zoom.current;
    camera.position.x += (mouse.current.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * 0.4 + 0.4 - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0.1, 0);
  });
  return null;
}

// ─── Floor mesh detector ──────────────────────────────────────────────────────
// Hides meshes that look like ground planes: flat geometry or floor-named nodes.

function isFloorMesh(mesh: THREE.Mesh): boolean {
  const name = mesh.name.toLowerCase();
  if (/floor|ground|plane|soil|shadow|surface|base_plane|terrain/.test(name)) return true;
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());
  const horizontal = Math.max(size.x, size.z);
  // Very flat: height < 5% of horizontal span AND wider than model unit
  return size.y < horizontal * 0.05 && horizontal > 0.8;
}

// ─── Model with material edits ────────────────────────────────────────────────

function AetherModel({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF("/models/sega_master_system.glb");
  const groupRef = useRef<THREE.Group>(null);

  const editedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Normalise scale and centre
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const s = 4.5 / Math.max(size.x, size.y, size.z);
    clone.scale.setScalar(s);
    clone.position.set(-centre.x * s, -centre.y * s, -centre.z * s);

    clone.traverse((c) => {
      if (!(c instanceof THREE.Mesh)) return;

      // Remove floor/ground planes
      if (isFloorMesh(c)) {
        c.visible = false;
        return;
      }

      const orig = c.material as THREE.MeshStandardMaterial;

      // Premium material override — keeps original textures, upgrades PBR params
      c.material = new THREE.MeshPhysicalMaterial({
        map:          orig.map          ?? null,
        normalMap:    orig.normalMap    ?? null,
        roughnessMap: orig.roughnessMap ?? null,
        metalnessMap: orig.metalnessMap ?? null,
        aoMap:        orig.aoMap        ?? null,
        color:        orig.color        ?? new THREE.Color(0xffffff),
        roughness:    orig.map ? 0.2 : 0.25,   // shinier than stock
        metalness:    0.6,                      // more metallic
        clearcoat:    0.7,                      // glossy coat
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.6,
        side: orig.side,
      });

      c.castShadow   = true;
      c.receiveShadow = false;
    });

    return clone;
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (mouse.current.x * 0.4 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-mouse.current.y * 0.12 - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <primitive object={editedScene} />
    </group>
  );
}

// ─── Fallback (model missing) ─────────────────────────────────────────────────

function AetherFallback() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.8, 0.22, 1.3]} />
        <meshPhysicalMaterial color="#0a0d14" roughness={0.2} metalness={0.7} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, 0.32, -0.28]}>
        <boxGeometry args={[1.2, 0.06, 0.5]} />
        <meshPhysicalMaterial color="#060810" roughness={0.15} metalness={0.8} clearcoat={1} />
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

      {/* Cool-steel lighting — contrasts with Hero B's warm gold palette */}
      <ambientLight intensity={0.12} color="#b8ccf0" />
      <directionalLight position={[-4, 6, 2]} intensity={4.5} color="#e8f0ff" />
      <pointLight position={[3, 1, 3]}   intensity={3}   color="#87a878" distance={8} decay={2} />
      <pointLight position={[-2, -1, 2]} intensity={1.2} color="#b580c7" distance={5} decay={2} />
      {/* Rim from behind — gives depth to the glossy coat */}
      <pointLight position={[0, 3, -3]}  intensity={2}   color="#4d6b41" distance={7} decay={2} />

      <Suspense fallback={null}>
        <Environment preset="city" background={false} />
      </Suspense>

      <Catch fallback={<AetherFallback />}>
        <Suspense fallback={<AetherFallback />}>
          <AetherModel mouse={mouse} />
        </Suspense>
      </Catch>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function HeroAether() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0.3, 2.8], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene scrollTarget={containerRef} />
      </Canvas>
    </div>
  );
}
