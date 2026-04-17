"use client";

/**
 * HarvestScene — ESCENA 5: COSECHA / CTA final
 *
 * Active scroll range: [0.75, 1.0]
 * localProgress 0→1 maps to [0.80, 1.0]
 *
 * Comportamientos:
 * - Planta adulta en vista cenital (cámara controlada por CameraRig en el
 *   padre: en el rango [0.8, 1.0] sube hasta top-down).
 * - Environment IBL: HDRI.harvest (autumn_field.hdr), intensity 1.0
 * - ContactShadows: blur 2, opacity 0.4
 * - La escena es visible cuando scroll ∈ [0.75, 1.0]
 * - Fade-in suave al entrar (primeros 5% del rango)
 * - La rotación del grupo para en top-down para apreciar el patrón geométrico
 * - Text overlay y formulario viven en el DOM — este componente solo
 *   aporta el asset 3D dentro del Canvas global.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { MODELS } from "@/lib/models";
import { useScrollContext } from "@/components/scroll/ScrollContext";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Global scroll range during which this scene is active. */
const SCENE_START = 0.75;
const SCENE_END = 1.0;

/** Local progress range that drives the camera zoom-out to top-down. */
const LOCAL_START = 0.8;
const LOCAL_END = 1.0;

// ─── Draco preload ────────────────────────────────────────────────────────────

useGLTF.preload(MODELS.plant, "/draco/");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Inverse-lerp: returns 0→1 as `value` moves from `min` to `max`. */
function inverseLerp(min: number, max: number, value: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/** Smoothstep ease: maps t ∈ [0, 1] to a smooth S-curve. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// ─── Inner scene (rendered inside R3F context) ────────────────────────────────

function HarvestSceneInner() {
  const { progressRef } = useScrollContext();

  // ── Model ──────────────────────────────────────────────────────────────────
  const gltf = useGLTF(MODELS.plant, "/draco/") as GLTF & {
    scene: THREE.Group;
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };

  // ── Refs ───────────────────────────────────────────────────────────────────
  const groupRef = useRef<THREE.Group>(null);
  const plantRef = useRef<THREE.Group>(null);

  // ── PBR material override ──────────────────────────────────────────────────
  // MeshPhysicalMaterial con clearcoat y sheen para el look orgánico cálido
  // de la escena de cosecha (luz dorada de autumn_field).
  const plantScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const existing = child.material as
        | THREE.MeshStandardMaterial
        | THREE.MeshPhysicalMaterial;

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
        roughness: 0.55,
        metalness: (existing as THREE.MeshStandardMaterial).metalness ?? 0,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
        // Sheen para suavidad orgánica de hojas
        sheen: 0.6,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color(0x87a878), // --accent-sage
        side: existing.side,
        transparent: true,
        opacity: 1.0,
      });

      child.material = upgraded;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    return clone;
  }, [gltf.scene]);

  // ── Per-frame animation ────────────────────────────────────────────────────
  useFrame(() => {
    const raw = progressRef.current;

    // Visibilidad: activa en [0.75, 1.0]
    const inRange = raw >= SCENE_START && raw <= SCENE_END;
    if (groupRef.current) {
      groupRef.current.visible = inRange;
    }
    if (!inRange) return;

    // localProgress 0→1 en el rango [0.80, 1.0] (usado por CameraRig para
    // el zoom-out cenital). Aquí lo usamos para animar la planta.
    const localProgress = inverseLerp(LOCAL_START, LOCAL_END, raw);
    const eased = smoothstep(localProgress);

    // Fade-in suave al entrar en la escena [0.75 → 0.80]
    const fadeIn = inverseLerp(SCENE_START, LOCAL_START, raw);
    const opacity = Math.min(1.0, fadeIn * 2);

    if (plantRef.current) {
      // Rotación lenta en Y — en top-down se aprecia el patrón geométrico
      // Al aumentar localProgress, la velocidad de giro se reduce (más
      // estático cuanto más cenital).
      const baseRotSpeed = 0.06 * (1 - eased * 0.7);
      plantRef.current.rotation.y += baseRotSpeed * 0.016; // aprox. delta fijo

      // Ligero ajuste de escala: la planta se ve un poco más grande en
      // top-down (ilusión de cercanía)
      const scale = 1.0 + eased * 0.12;
      plantRef.current.scale.setScalar(scale);

      // Aplicar opacity en el fade-in
      if (opacity < 1.0) {
        plantRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshPhysicalMaterial;
            mat.opacity = opacity;
          }
        });
      } else {
        // Restaurar opacidad plena si ya está completamente visible
        plantRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshPhysicalMaterial;
            if (mat.opacity < 1.0) mat.opacity = 1.0;
          }
        });
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Luz cenital cálida dorada que realza el patrón top-down ─────── */}
      <directionalLight
        position={[2, 8, 3]}
        intensity={3.5}
        color="#d4a84b"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* ── Relleno suave desde abajo (luz rebotada del suelo) ───────────── */}
      <pointLight
        position={[0, -1, 0]}
        intensity={1.2}
        color="#4d6b41"
        distance={5}
        decay={2}
      />

      {/* ── Planta adulta ────────────────────────────────────────────────── */}
      {/*
       * Posicionada centrada. La cámara sube en CameraRig desde [0,5,1.5]
       * hasta [0,7,0.5] en el rango [0.8, 1.0], dando la vista top-down.
       */}
      <group ref={plantRef} position={[0, -0.8, 0]}>
        <primitive object={plantScene} />
      </group>

      {/* ── Contact shadows ───────────────────────────────────────────────── */}
      <ContactShadows
        position={[0, -1.5, 0]}
        blur={2}
        opacity={0.4}
        scale={5}
        far={3}
        resolution={512}
        color="#1a1410"
      />
    </group>
  );
}

// ─── Public export ─────────────────────────────────────────────────────────────

/**
 * HarvestScene — escena de cosecha / CTA final.
 * Debe renderizarse dentro del Canvas R3F global (nunca monta su propio Canvas).
 * El overlay DOM con texto y formulario se monta en paralelo en la capa HTML.
 */
export function HarvestScene() {
  return <HarvestSceneInner />;
}

export default HarvestScene;
