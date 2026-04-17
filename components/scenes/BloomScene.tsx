"use client";

/**
 * BloomScene — ESCENA 4: CRECIMIENTO / "Planta adulta"
 *
 * Active scroll range: [0.55, 0.85]
 * localProgress 0→1 maps to [0.60, 0.80]
 *
 * Behaviours:
 * - Plant model loaded via useGLTF (Draco) from MODELS.plant
 * - BloomingMaterial shader applied via traverse to all meshes
 * - uBloom uniform = localProgress (0 = closed bud, 1 = fully open flowers)
 * - uTime uniform = clock.elapsedTime (breathing motion)
 * - Warm directional light: position [3,4,2], intensity 1.5, color #f0c060
 * - Environment IBL: HDRI.harvest (autumn_field.hdr), environmentIntensity 1.2
 * - ContactShadows: blur 3, opacity 0.5
 * - Scene fades in at 0.55 and fades out at 0.83
 * - Plant scale: 1.2 (adult plant — larger than seed scene)
 * - MeshPhysicalMaterial props (transmission 0.2, clearcoat 0.5) injected into
 *   BloomingMaterial via onBeforeCompile is not applicable here — instead the
 *   same transmission effect is replicated in the fragment shader via the
 *   Fresnel rim that BloomingMaterial already provides.
 *
 * Note on sage_adult.glb:
 *   The final model (sage_adult.glb) is documented as BLOCKER B01 in BLOCKERS.md.
 *   This scene uses MODELS.plant (avocado_demo.glb) as the sanctioned
 *   development placeholder per lib/models.ts. Swap MODELS.plant to
 *   MODELS.plantFinal once the GLB is downloaded.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { MODELS } from "@/lib/models";
import { HDRI } from "@/lib/hdri";
import { BloomingMaterial } from "@/components/shaders/bloomingMaterial";
import { useScrollContext } from "@/components/scroll/ScrollContext";

// ─── Draco preload ────────────────────────────────────────────────────────────

useGLTF.preload(MODELS.plant, true, undefined, (loader) => {
  (loader as unknown as { setDecoderPath: (p: string) => void }).setDecoderPath(
    "/draco/"
  );
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Inverse-lerp: returns 0→1 as `value` moves from `min` to `max`, clamped. */
function inverseLerp(min: number, max: number, value: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// ─── Inner scene (rendered inside R3F context) ────────────────────────────────

function BloomSceneInner() {
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

  /**
   * Collect all ShaderMaterial instances created by BloomingMaterial so
   * we can update their uniforms each frame without re-traversing the scene.
   */
  const bloomMaterialsRef = useRef<THREE.ShaderMaterial[]>([]);

  // ── Apply BloomingMaterial to every mesh in the cloned scene ───────────────
  const plantScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const materials: THREE.ShaderMaterial[] = [];

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const existing = child.material as
        | THREE.MeshStandardMaterial
        | THREE.MeshPhysicalMaterial;

      // Build a BloomingMaterial instance and carry over the existing
      // diffuse texture so the model retains its original colour map.
      const mat = new (BloomingMaterial as unknown as new (
        params?: object
      ) => THREE.ShaderMaterial)({
        uBloom: 0,
        uTime: 0,
        uMap: existing.map ?? null,
        uHasMap: existing.map ? 1.0 : 0.0,
      });

      // Ensure double-sided rendering for thin leaf geometry
      mat.side = THREE.DoubleSide;

      child.material = mat;
      child.castShadow = true;
      child.receiveShadow = true;

      materials.push(mat);
    });

    // Store refs for per-frame uniform updates
    bloomMaterialsRef.current = materials;

    return clone;
  }, [gltf.scene]);

  // ── Per-frame animation ────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const raw = progressRef.current;

    // Scene visibility: active in [0.55, 0.85]
    const visible = raw >= 0.55 && raw <= 0.85;
    if (groupRef.current) {
      groupRef.current.visible = visible;
    }

    if (!visible) return;

    // localProgress: 0→1 as global scroll moves from 0.60 → 0.80
    const localProgress = inverseLerp(0.6, 0.8, raw);

    // Fade in at entry edge [0.55, 0.60] and fade out at exit edge [0.80, 0.85]
    const fadeIn = inverseLerp(0.55, 0.60, raw);
    const fadeOut = raw > 0.8 ? inverseLerp(0.85, 0.80, raw) : 1.0;
    const opacity = Math.min(fadeIn, fadeOut);

    const elapsed = clock.elapsedTime;

    // ── Update all blooming material uniforms ──────────────────────────────
    for (const mat of bloomMaterialsRef.current) {
      mat.uniforms.uBloom.value = localProgress;
      mat.uniforms.uTime.value = elapsed;

      // Apply scene-edge opacity via alphaTest approach:
      // We use transparent + opacity for the fade, and restore when full.
      if (opacity < 1.0) {
        mat.transparent = true;
        mat.opacity = opacity;
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
      }
    }

    // ── Plant: gentle idle sway ────────────────────────────────────────────
    if (plantRef.current) {
      // Subtle organic sway — slower than seed scene, it's a sturdy adult plant
      plantRef.current.rotation.y = elapsed * 0.05;
      // Very gentle vertical bob
      plantRef.current.position.y =
        Math.sin(elapsed * 0.35) * 0.025 - 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Environment IBL — warm autumn golden light ───────────────────── */}
      <Environment
        files={HDRI.harvest}
        blur={0.2}
        environmentIntensity={1.2}
      />

      {/* ── Warm directional key light ────────────────────────────────────── */}
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.5}
        color="#f0c060"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* ── Soft fill — avoids pure-black undersides on leaves ────────────── */}
      <pointLight
        position={[-2, 1, 3]}
        intensity={0.6}
        color="#d4a84b"
        distance={8}
        decay={2}
      />

      {/* Subtle cool backlight for petal rim separation */}
      <pointLight
        position={[0, 2, -4]}
        intensity={0.4}
        color="#b580c7"
        distance={6}
        decay={2}
      />

      {/* ── Plant model — adult sage with BloomingMaterial ───────────────── */}
      {/*
       * scale={1.2}: adult plant is 20% larger than the hero seed scene.
       * position y=-0.5 keeps the base near the contact shadow plane.
       */}
      <group ref={plantRef} position={[0, -0.5, 0]} scale={1.2}>
        <primitive object={plantScene} />
      </group>

      {/* ── Contact shadows — softer and more spread for ground presence ──── */}
      <ContactShadows
        position={[0, -1.5, 0]}
        blur={3}
        opacity={0.5}
        scale={5}
        far={3}
        resolution={512}
        color="#1a0e06"
      />
    </group>
  );
}

// ─── Public export ─────────────────────────────────────────────────────────────

export interface BloomSceneProps {
  /** Global scroll progress [0, 1] — passed by SceneManager if needed. */
  scrollProgress?: number;
}

/**
 * BloomScene — growth scene "Planta adulta".
 * Must be rendered inside the global R3F Canvas (never mounts its own Canvas).
 * HTML overlay cards (Fase 0/1/2) are DOM elements managed by the page section
 * component — they are NOT part of this R3F subtree.
 */
export function BloomScene({ scrollProgress: _scrollProgressProp }: BloomSceneProps = {}) {
  return <BloomSceneInner />;
}

export default BloomScene;
