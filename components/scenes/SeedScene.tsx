"use client";

/**
 * SeedScene — ESCENA 1: HERO / "La semilla"
 *
 * Active scroll range: [0.0, 0.22]
 * localProgress 0→1 maps to [0.0, 0.20]
 *
 * Behaviours:
 * - Plant model loaded via useGLTF (Draco) from MODELS.plant
 * - SpotLight cenital: position [0,6,2], intensity 50, angle 0.3, penumbra 0.8
 * - Environment IBL: HDRI.hero (kloppenheim_06_puresky.hdr)
 * - ContactShadows: blur 2, opacity 0.4, scale 4
 * - PolenParticles (600 instances, curl noise, gold additive) — offset to right
 * - Scroll emergence: plant starts at y=-3.5 (scroll=0) and rises to y=-0.8
 *   as scroll goes 0→0.12 (smoothstep easing)
 * - Scale: starts at 0.4, grows to 1.0 as scroll goes 0→0.15
 * - Mouse tracking: updates mouseRef for PolenParticles interaction
 * - Group visibility fades out when scroll exits range [0.0, 0.22]
 * - MeshPhysicalMaterial override: clearcoat 0.3, roughness 0.4
 * - PerformanceMonitor for adaptive DPR (owned by GlobalCanvas)
 */

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { MODELS } from "@/lib/models";
import { PolenParticles } from "@/components/shaders/polenParticles";
import { useScrollContext } from "@/components/scroll/ScrollContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SeedSceneProps {
  /** Global scroll progress [0, 1] — passed by SceneManager if needed. */
  scrollProgress?: number;
}

// ─── Draco preload ────────────────────────────────────────────────────────────

useGLTF.preload(MODELS.plant, "/draco/");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Inverse-lerp: returns 0→1 as `value` moves from `min` to `max`. */
function inverseLerp(min: number, max: number, value: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/** Smoothstep easing for a value already in [0, 1]. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// ─── Inner scene (rendered inside R3F context) ────────────────────────────────

function SeedSceneInner() {
  const { progressRef } = useScrollContext();

  // ── Model ──────────────────────────────────────────────────────────────────
  const gltf = useGLTF(MODELS.plant, "/draco/") as GLTF & {
    scene: THREE.Group;
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };

  // ── Refs ───────────────────────────────────────────────────────────────────
  const groupRef       = useRef<THREE.Group>(null);
  const plantRef       = useRef<THREE.Group>(null);
  const spotRef        = useRef<THREE.SpotLight>(null);
  const spotTargetRef  = useRef<THREE.Object3D>(null);

  /**
   * Mouse NDC coords updated by DOM mousemove listener.
   * Passed to PolenParticles for the push interaction.
   */
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      // Convert to NDC [-1, 1]
      mouseRef.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ── PBR material override ──────────────────────────────────────────────────
  // Applied once after load; respects existing textures on the model.
  const plantScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const existing = child.material as
        | THREE.MeshStandardMaterial
        | THREE.MeshPhysicalMaterial;

      // Preserve existing maps; upgrade to MeshPhysicalMaterial for clearcoat.
      const upgraded = new THREE.MeshPhysicalMaterial({
        map:              existing.map            ?? null,
        normalMap:        existing.normalMap      ?? null,
        roughnessMap:     existing.roughnessMap   ?? null,
        metalnessMap:     existing.metalnessMap   ?? null,
        aoMap:            existing.aoMap          ?? null,
        emissiveMap:      existing.emissiveMap    ?? null,
        emissive:         existing.emissive       ?? new THREE.Color(0x000000),
        emissiveIntensity: existing.emissiveIntensity ?? 0,
        color:            existing.color          ?? new THREE.Color(0xffffff),
        roughness:        0.4,
        metalness:        (existing as THREE.MeshStandardMaterial).metalness ?? 0,
        clearcoat:        0.3,
        clearcoatRoughness: 0.25,
        // Translucency for leaf-like meshes (no-op if no thickness map)
        transmission:     0.0,
        side:             existing.side,
      });

      child.material     = upgraded;
      child.castShadow   = true;
      child.receiveShadow = true;
    });

    return clone;
  }, [gltf.scene]);

  // ── Spotlight target must be added to scene ────────────────────────────────
  useEffect(() => {
    if (spotRef.current && spotTargetRef.current) {
      spotRef.current.target = spotTargetRef.current;
    }
  }, []);

  // ── Per-frame animation ────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const raw = progressRef.current;

    // Scene visibility: active in [0.0, 0.22]
    const visible = raw <= 0.22;
    if (groupRef.current) {
      groupRef.current.visible = visible;
    }
    if (!visible) return;

    // Fade-out opacity near upper bound [0.17 → 0.22]
    const opacityFactor =
      raw > 0.17 ? inverseLerp(0.22, 0.17, raw) : 1.0;

    if (plantRef.current) {
      const t = clock.elapsedTime;

      // ── Emergence from below: y = -3.5 → -0.8 as scroll 0 → 0.12 ──────
      const emergeT    = smoothstep(inverseLerp(0.0, 0.12, raw));
      const targetY    = -3.5 + emergeT * (-0.8 - -3.5); // -3.5 → -0.8
      // Add gentle idle bob on top of the emerged position
      const idleBob    = Math.sin(t * 0.4) * 0.04;
      plantRef.current.position.y = targetY + idleBob;

      // ── Scale: 0.4 → 1.0 as scroll 0 → 0.15 ────────────────────────────
      const scaleT  = smoothstep(inverseLerp(0.0, 0.15, raw));
      const scale   = 0.4 + scaleT * (1.0 - 0.4);
      plantRef.current.scale.setScalar(scale);

      // Slow idle rotation
      plantRef.current.rotation.y = t * 0.08;
    }

    // Fade meshes with opacityFactor if approaching scene boundary
    if (opacityFactor < 1.0 && plantRef.current) {
      plantRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshPhysicalMaterial;
          if (!mat.transparent) mat.transparent = true;
          mat.opacity = opacityFactor;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Cenital SpotLight ─────────────────────────────────────────────── */}
      <spotLight
        ref={spotRef}
        position={[0, 6, 2]}
        intensity={50}
        angle={0.3}
        penumbra={0.8}
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
      {/*
       * plantRef starts at y=-3.5 (below camera) and rises to y=-0.8 as
       * scroll goes 0→0.12. Scale grows from 0.4→1.0 as scroll goes 0→0.15.
       * Initial position/scale set to scroll=0 state; useFrame drives animation.
       */}
      <group ref={plantRef} position={[0, -3.5, 0]} scale={0.4}>
        <primitive object={plantScene} />
      </group>

      {/* ── Pollen particles ──────────────────────────────────────────────── */}
      {/*
       * Offset to the right side of the scene [2.2, 0.3, -0.5].
       * mouseRef drives the push interaction uniform uMouse.
       */}
      <PolenParticles
        count={600}
        radius={1.5}
        scrollProgress={progressRef.current}
        offset={[2.2, 0.3, -0.5]}
        mouseRef={mouseRef}
        mouseStrength={1.0}
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
export function SeedScene({
  scrollProgress: _scrollProgressProp,
}: SeedSceneProps = {}) {
  return <SeedSceneInner />;
}

export default SeedScene;
