"use client";

/**
 * SeedScene — ESCENA 1: HERO / "La semilla"
 *
 * Active scroll range: [0.0, 0.22]
 * localProgress 0→1 maps to [0.0, 0.20]
 *
 * Behaviours:
 * - Plant model loaded via useGLTF (Draco) from MODELS.plant
 * - SpotLight cenital: position [0,6,2], intensity 50, angle 0.3, penumbra 0.5
 * - Environment IBL: HDRI.hero (kloppenheim_06_puresky.hdr)
 * - ContactShadows: blur 2, opacity 0.4, scale 4
 * - PolenParticles (600 instances, curl noise, gold emissive)
 * - Scroll: plant gently scales up [1.0 → 1.15] as localProgress goes 0 → 1
 * - Group visibility fades out when scroll exits range [0.0, 0.22]
 * - MeshPhysicalMaterial override: clearcoat 0.3, roughness 0.4
 * - PerformanceMonitor for adaptive DPR (owned by GlobalCanvas, but scene
 *   is compatible with it)
 */

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { MODELS } from "@/lib/models";
import { HDRI } from "@/lib/hdri";
import { PolenParticles } from "@/components/shaders/polenParticles";
import { useScrollContext } from "@/components/scroll/ScrollContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SeedSceneProps {
  /** Global scroll progress [0, 1] — passed by SceneManager if needed. */
  scrollProgress?: number;
}

// ─── Draco preload ────────────────────────────────────────────────────────────

useGLTF.preload(MODELS.plant, true, undefined, (loader) => {
  // Draco decoder lives in /public/draco/
  (loader as unknown as { setDecoderPath: (p: string) => void }).setDecoderPath(
    "/draco/"
  );
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Inverse-lerp: returns 0→1 as `value` moves from `min` to `max`. */
function inverseLerp(min: number, max: number, value: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// ─── Inner scene (rendered inside R3F context) ────────────────────────────────

function SeedSceneInner() {
  const { progressRef } = useScrollContext();

  // ── Model ──────────────────────────────────────────────────────────────────
  const gltf = useGLTF(MODELS.plant) as GLTF & {
    scene: THREE.Group;
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };

  // ── Refs ───────────────────────────────────────────────────────────────────
  const groupRef = useRef<THREE.Group>(null);
  const plantRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const spotTargetRef = useRef<THREE.Object3D>(null);

  // ── PBR material override ──────────────────────────────────────────────────
  // Applied once after load; respects existing textures on the model.
  const plantScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const existing = child.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;

      // Preserve existing maps; upgrade to MeshPhysicalMaterial for clearcoat.
      const upgraded = new THREE.MeshPhysicalMaterial({
        map: existing.map ?? null,
        normalMap: existing.normalMap ?? null,
        roughnessMap: existing.roughnessMap ?? null,
        metalnessMap: existing.metalnessMap ?? null,
        aoMap: existing.aoMap ?? null,
        emissiveMap: existing.emissiveMap ?? null,
        emissive: existing.emissive ?? new THREE.Color(0x000000),
        emissiveIntensity: existing.emissiveIntensity ?? 0,
        color: existing.color ?? new THREE.Color(0xffffff),
        roughness: 0.4,
        metalness: (existing as THREE.MeshStandardMaterial).metalness ?? 0,
        clearcoat: 0.3,
        clearcoatRoughness: 0.25,
        // Translucency for leaf-like meshes (no-op if no thickness)
        transmission: 0.0,
        side: existing.side,
      });

      child.material = upgraded;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    return clone;
  }, [gltf.scene]);

  // ── Spotlight target must be added to scene ───────────────────────────────
  useEffect(() => {
    if (spotRef.current && spotTargetRef.current) {
      spotRef.current.target = spotTargetRef.current;
    }
  }, []);

  // ── Per-frame animation ────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const raw = progressRef.current;

    // localProgress: 0→1 as global scroll moves from 0→0.20
    const localProgress = inverseLerp(0.0, 0.20, raw);

    // Scene visibility: active in [0.0, 0.22], fade buffer 0.05 on exit
    const visible = raw <= 0.22;
    if (groupRef.current) {
      groupRef.current.visible = visible;
    }

    if (!visible) return;

    // Fade-out opacity near upper bound
    const opacityFactor =
      raw > 0.17 ? inverseLerp(0.22, 0.17, raw) : 1.0;

    // Plant: slow idle rotation + subtle bob
    if (plantRef.current) {
      const t = clock.elapsedTime;
      plantRef.current.rotation.y = t * 0.08;
      plantRef.current.position.y =
        Math.sin(t * 0.4) * 0.04 - 0.5; // float around y=-0.5

      // Scale grows slightly as user scrolls in
      const scale = 1.0 + localProgress * 0.15;
      plantRef.current.scale.setScalar(scale);
    }

    // Fade meshes with opacityFactor if approaching scene boundary
    if (opacityFactor < 1.0 && plantRef.current) {
      plantRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshPhysicalMaterial;
          if (!mat.transparent) {
            mat.transparent = true;
          }
          mat.opacity = opacityFactor;
        }
      });
    }
  });

  // ── Pollen scroll progress (read from ref in PolenParticles' own useFrame) ─
  // We pass a derived local value; PolenParticles reads scrollProgress prop
  // for its uniforms — we supply the raw global value so curl noise fades
  // correctly as scene leaves.
  const scrollProgressForPolen = progressRef.current;

  return (
    <group ref={groupRef}>
      {/* ── Environment IBL ──────────────────────────────────────────────── */}
      <Environment files={HDRI.hero} blur={0.3} />

      {/* ── Cenital SpotLight ─────────────────────────────────────────────── */}
      <spotLight
        ref={spotRef}
        position={[0, 6, 2]}
        intensity={50}
        angle={0.3}
        penumbra={0.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        color="#f5e8c8"
      />
      {/* SpotLight target at origin (plant centre) */}
      <object3D ref={spotTargetRef} position={[0, 0, 0]} />

      {/* Subtle fill from below — avoids pure black underside */}
      <pointLight
        position={[0, -2, 1]}
        intensity={1.5}
        color="#4d6b41"
        distance={6}
        decay={2}
      />

      {/* ── Plant model ───────────────────────────────────────────────────── */}
      <group ref={plantRef} position={[0, -0.5, 0]}>
        <primitive object={plantScene} />
      </group>

      {/* ── Pollen particles (600 instances, curl noise, gold additive) ───── */}
      {/*
       * PolenParticles reads scrollProgress to fade its alpha and curl
       * intensity. We provide the raw global progress so the shader knows
       * how far the scene has been scrolled past.
       */}
      <PolenParticles
        count={600}
        radius={1.5}
        scrollProgress={scrollProgressForPolen}
      />

      {/* ── Contact shadows ───────────────────────────────────────────────── */}
      <ContactShadows
        position={[0, -1.5, 0]}
        blur={2}
        opacity={0.4}
        scale={4}
        far={2.5}
        resolution={512}
        color="#000000"
      />
    </group>
  );
}

// ─── Public export ─────────────────────────────────────────────────────────────

/**
 * SeedScene — hero scene "La semilla".
 * Must be rendered inside the global R3F Canvas (never mounts its own Canvas).
 */
export function SeedScene({ scrollProgress: _scrollProgressProp }: SeedSceneProps = {}) {
  return <SeedSceneInner />;
}

export default SeedScene;
