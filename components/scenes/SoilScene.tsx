"use client";

/**
 * SoilScene — ESCENA 2: PROBLEMA / "Tierra estéril"
 *
 * Active scroll range: [0.2, 0.42]
 * localProgress 0→1 maps to [0.2, 0.4]
 *
 * Behaviours:
 * - Plant model (MODELS.plant) with wilting shader (WiltingMaterial).
 *   uWilt goes 0→1 as localProgress advances.
 * - PBR floor with MeshPhysicalMaterial. Ideally loaded from
 *   public/textures/soil/brown_mud_leaves_01_*.jpg — see BLOCKERS.md B03.
 *   Falls back to procedural params when textures are absent.
 * - Environment IBL: HDRI.underground (dikhololo_night.hdr), intensity 0.4.
 * - Dim atmosphere: ambientLight 0.15 + warm directional 0.3.
 * - ContactShadows: blur 2, opacity 0.4.
 * - Scene visible when global scroll in [0.15, 0.45].
 *
 * NOTE: renders inside the global R3F Canvas. Never mounts its own <Canvas>.
 */

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { MODELS } from "@/lib/models";
import { HDRI } from "@/lib/hdri";
import { WiltingMaterial } from "@/components/shaders/wiltingMaterial";
import { useScrollContext } from "@/components/scroll/ScrollContext";

// ─── Draco preload ─────────────────────────────────────────────────────────────

useGLTF.preload(MODELS.plant, "/draco/");

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Global scroll range where this scene drives the wilting animation. */
const SCENE_START = 0.2;
const SCENE_END = 0.4;

/** Visibility window is slightly wider than the animation window. */
const VISIBLE_START = 0.15;
const VISIBLE_END = 0.45;

/**
 * Path prefix for PBR soil textures (brown_mud_leaves_01).
 * See BLOCKERS.md B03 — textures absent until downloaded from Poly Haven.
 */
const SOIL_TEX_BASE = "/textures/soil/brown_mud_leaves_01";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function inverseLerp(min: number, max: number, value: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// ─── Error boundary — graceful texture fallback ────────────────────────────────

/**
 * Wraps SoilFloor in a React error boundary so that a missing texture
 * throws at the boundary rather than crashing the whole canvas tree.
 * When textures are absent (see BLOCKERS.md B03) a plain earthy plane is shown.
 */
class SoilFloorErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // FALLBACK — plain floor when textures cannot be loaded (BLOCKERS B03)
      return (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.2, 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10, 1, 1]} />
          <meshPhysicalMaterial
            color="#3d2b1a"
            roughness={0.95}
            metalness={0}
            clearcoat={0.05}
            clearcoatRoughness={0.9}
          />
        </mesh>
      );
    }
    return this.props.children;
  }
}

// ─── Floor component ───────────────────────────────────────────────────────────

/**
 * Cracked soil floor with PBR textures.
 *
 * Suspended by the parent Suspense boundary via useTexture. If the texture
 * files are missing (stub / 404) the SoilFloorErrorBoundary above catches the
 * error and renders a plain fallback floor.
 */
function SoilFloor() {
  const textures = useTexture({
    map: `${SOIL_TEX_BASE}_diff_1k.jpg`,
    normalMap: `${SOIL_TEX_BASE}_nor_gl_1k.jpg`,
    roughnessMap: `${SOIL_TEX_BASE}_rough_1k.jpg`,
    displacementMap: `${SOIL_TEX_BASE}_disp_1k.png`,
  });

  const { map, normalMap, roughnessMap, displacementMap } = textures;

  // Apply tiling so the texture tile repeats across the large plane.
  const tilingFactor = 3;
  [map, normalMap, roughnessMap, displacementMap].forEach((tex) => {
    if (!tex) return;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(tilingFactor, tilingFactor);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      {/*
       * 128×128 segments give displacement enough geometry to deform smoothly
       * without excessive vertex count.
       */}
      <planeGeometry args={[10, 10, 128, 128]} />
      <meshPhysicalMaterial
        map={map}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(1.2, 1.2)}
        roughnessMap={roughnessMap}
        roughness={1.0}
        metalness={0}
        displacementMap={displacementMap}
        displacementScale={0.3}
        displacementBias={-0.15}
        clearcoat={0.05}
        clearcoatRoughness={0.9}
        envMapIntensity={0.3}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

// ─── Wilting plant component ───────────────────────────────────────────────────

interface WiltingPlantProps {
  progressRef: React.MutableRefObject<number>;
}

function WiltingPlant({ progressRef }: WiltingPlantProps) {
  const gltf = useGLTF(MODELS.plant, "/draco/") as GLTF & {
    scene: THREE.Group;
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };

  const groupRef = useRef<THREE.Group>(null);

  /**
   * Clone the GLTF scene and replace each mesh's material with WiltingMaterial.
   * Original diffuse textures are forwarded so the shader can blend between
   * procedural green and the actual diffuse when a map is present.
   */
  const wiltScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const existing = child.material as
        | THREE.MeshStandardMaterial
        | THREE.MeshPhysicalMaterial
        | null;

      const diffuseTex = existing?.map ?? null;

      const mat = new WiltingMaterial() as THREE.ShaderMaterial & {
        uniforms: {
          uWilt: { value: number };
          uMap: { value: THREE.Texture | null };
          uHasMap: { value: number };
        };
      };
      mat.uniforms.uWilt.value = 0;
      mat.uniforms.uMap.value = diffuseTex;
      mat.uniforms.uHasMap.value = diffuseTex ? 1.0 : 0.0;
      mat.side = existing?.side ?? THREE.FrontSide;

      child.material = mat;
      child.castShadow = true;
    });

    return clone;
  }, [gltf.scene]);

  // ── Per-frame: push uWilt into every plant mesh ────────────────────────────
  useFrame(() => {
    const raw = progressRef.current;
    const localProgress = inverseLerp(SCENE_START, SCENE_END, raw);

    if (!groupRef.current) return;

    groupRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mat = child.material as THREE.ShaderMaterial & {
        uniforms?: { uWilt?: { value: number } };
      };
      if (mat.uniforms?.uWilt !== undefined) {
        mat.uniforms.uWilt.value = localProgress;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      <primitive object={wiltScene} />
    </group>
  );
}

// ─── Inner scene (runs inside R3F context) ────────────────────────────────────

function SoilSceneInner() {
  const { progressRef } = useScrollContext();
  const groupRef = useRef<THREE.Group>(null);

  // Flip visibility in the R3F loop — avoids React state churn every frame.
  useFrame(() => {
    const raw = progressRef.current;
    if (groupRef.current) {
      groupRef.current.visible = raw >= VISIBLE_START && raw <= VISIBLE_END;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── IBL environment: dikhololo_night.hdr, attenuated for dim mood ─── */}
      <Environment
        preset={HDRI.underground.preset}
        environmentIntensity={0.4}
        background={false}
      />

      {/* ── Dim ambient: barely enough to preserve shadow detail ──────────── */}
      <ambientLight intensity={0.15} />

      {/* ── Warm directional: dying light from upper-right ────────────────── */}
      <directionalLight
        position={[2, 3, 1]}
        intensity={0.3}
        color="#7a6855"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.001}
      />

      {/* ── Cold fill from below: prevents total blackout on underside ──────── */}
      <pointLight
        position={[-1.5, -0.5, 2]}
        intensity={0.4}
        color="#2a1e14"
        distance={5}
        decay={2}
      />

      {/* ── PBR cracked soil floor ─────────────────────────────────────────── */}
      {/*
       * SoilFloorErrorBoundary catches texture loading failures and renders
       * a plain fallback floor (see BLOCKERS.md B03).
       * React.Suspense is required by useTexture; null fallback means the floor
       * is simply absent until textures are resolved (sub-100ms on local serve).
       */}
      <SoilFloorErrorBoundary>
        <React.Suspense fallback={null}>
          <SoilFloor />
        </React.Suspense>
      </SoilFloorErrorBoundary>

      {/* ── Plant with wilting shader (uWilt driven by scroll) ─────────────── */}
      <WiltingPlant progressRef={progressRef} />

      {/* ── Contact shadows cast on the soil floor ────────────────────────── */}
      <ContactShadows
        position={[0, -1.18, 0]}
        blur={2}
        opacity={0.4}
        scale={6}
        far={2}
        resolution={512}
        color="#1a0d08"
      />
    </group>
  );
}

// ─── Public export ─────────────────────────────────────────────────────────────

/**
 * SoilScene — "Tierra estéril" (Escena 2 del scroll).
 *
 * Renders inside the global R3F Canvas. Stats HTML overlay (70%, 1/10, 11m)
 * is owned by the DOM section wrapper (ProblemScene in app/page.tsx);
 * this component is exclusively the 3D canvas layer.
 */
export function SoilScene() {
  return <SoilSceneInner />;
}

export default SoilScene;
