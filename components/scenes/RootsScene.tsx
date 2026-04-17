"use client";

/**
 * RootsScene — ESCENA 3: SISTEMA / "Raíces"
 *
 * Active scroll range: [0.35, 0.65]
 * localProgress 0→1 maps to [0.4, 0.6]
 *
 * Behaviours:
 * - Procedural root network: 12 TubeGeometry branches via CatmullRomCurve3
 *   (root_system.glb not available — BLOCKERS.md B02)
 * - 4 FresnelNode channel nodes at branch tips: Email, Instagram DM,
 *   WhatsApp, Llamada
 * - Central master node (Claude orchestrator) at origin
 * - HTML labels via drei <Html occlude> anchored near each node
 * - Hover over HTML label → activates matching FresnelNode (shared state)
 * - Environment IBL: HDRI.underground (dikhololo_night.hdr)
 * - Fog: #0e0a08, near=3, far=12
 * - Camera descends below ground per CameraRig keyframe at progress=0.4
 */

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Environment } from "@react-three/drei";
import * as THREE from "three";

import { HDRI } from "@/lib/hdri";
import { FresnelNode } from "@/components/shaders/fresnelNode";
import { useScrollContext } from "@/components/scroll/ScrollContext";

// ─── Constants ────────────────────────────────────────────────────────────────

// Channel node config — positions chosen so they radiate from origin [0,0,0]
// at depths matching the underground camera view (y ≈ -1 to -2).
const NODE_POSITIONS: [number, number, number][] = [
  [-1.5, -0.5, 0.2],    // Email
  [1.5, -0.3, 0.5],     // Instagram DM
  [-1.2, -1.1, -0.6],   // WhatsApp
  [1.2, -1.3, -0.4],    // Llamada
];

const NODE_LABELS = ["Email", "Instagram DM", "WhatsApp", "Llamada"];

// Colors match palette: sage green, gold, sage green, bloom purple
const NODE_COLORS = ["#87a878", "#d4a84b", "#87a878", "#b580c7"];

// Pulse speeds — slight variation keeps the sinapsis feel organic
const NODE_SPEEDS = [2.0, 1.6, 2.4, 1.8];

// Label copy — channel descriptions shown below the main label
const NODE_DESCRIPTIONS = [
  "cadencias personalizadas",
  "DMs automatizados",
  "ritmo humano filtrado",
  "contexto pre-cargado",
];

// ─── Procedural root branches ─────────────────────────────────────────────────

/**
 * Generates a CatmullRomCurve3 starting near the origin and ending at `tip`.
 * Intermediate control points are jittered for organic branching feel.
 */
function buildRootCurve(
  tip: [number, number, number],
  seed: number
): THREE.CatmullRomCurve3 {
  // Seeded pseudo-random — deterministic between renders
  const rnd = (offset: number) =>
    (Math.sin(seed * 127.1 + offset * 311.7) * 0.5 + 0.5) * 2 - 1;

  const tipVec = new THREE.Vector3(...tip);

  // Four control points: origin → mid1 (25%) → mid2 (60%) → tip
  const p0 = new THREE.Vector3(0, 0, 0);
  const p1 = tipVec
    .clone()
    .multiplyScalar(0.25)
    .add(new THREE.Vector3(rnd(1) * 0.3, rnd(2) * 0.2, rnd(3) * 0.25));
  const p2 = tipVec
    .clone()
    .multiplyScalar(0.6)
    .add(new THREE.Vector3(rnd(4) * 0.25, rnd(5) * 0.15, rnd(6) * 0.2));
  const p3 = tipVec.clone();

  return new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
}

/**
 * Generates secondary branch tips — smaller offshoots from a midpoint
 * of the main branch to fill out the neural-root network.
 */
function buildSecondaryTip(
  parentTip: [number, number, number],
  seed: number
): [number, number, number] {
  const rnd = (offset: number) =>
    (Math.sin(seed * 91.3 + offset * 257.4) * 0.5 + 0.5) * 2 - 1;
  return [
    parentTip[0] * 0.5 + rnd(1) * 0.6,
    parentTip[1] * 0.5 + rnd(2) * 0.4,
    parentTip[2] * 0.5 + rnd(3) * 0.5,
  ];
}

// ─── Root geometry cache ───────────────────────────────────────────────────────

interface RootBranch {
  curve: THREE.CatmullRomCurve3;
  tubeSegments: number;
  radius: number;
  radiusSegments: number;
}

function useRootBranches(): RootBranch[] {
  return useMemo(() => {
    const branches: RootBranch[] = [];

    // 4 main branches — one per channel, going to each NODE_POSITION
    NODE_POSITIONS.forEach((tip, i) => {
      branches.push({
        curve: buildRootCurve(tip, i * 13 + 7),
        tubeSegments: 20,
        radius: 0.022,
        radiusSegments: 6,
      });
    });

    // 8 secondary branches — 2 per main branch, smaller radius
    NODE_POSITIONS.forEach((tip, i) => {
      for (let s = 0; s < 2; s++) {
        const secondaryTip = buildSecondaryTip(tip, i * 7 + s * 19 + 3);
        branches.push({
          curve: buildRootCurve(secondaryTip, i * 31 + s * 17 + 5),
          tubeSegments: 14,
          radius: 0.012,
          radiusSegments: 5,
        });
      }
    });

    return branches;
  }, []);
}

// ─── Root mesh material ────────────────────────────────────────────────────────

/**
 * MeshPhysicalMaterial for root tubes. No external maps (procedural geometry),
 * but uses clearcoat + specularIntensity to avoid the flat "cheap" look.
 * Deep earthy brown matching --bg-soil palette.
 */
function useRootMaterial(): THREE.MeshPhysicalMaterial {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#3d2210"),
        roughness: 0.9,
        metalness: 0.05,
        clearcoat: 0.1,
        clearcoatRoughness: 0.8,
        // Subtle subsurface-like warmth via sheen
        sheen: 0.15,
        sheenColor: new THREE.Color("#6b3a1f"),
        sheenRoughness: 0.7,
      }),
    []
  );
}

// ─── Inner scene ──────────────────────────────────────────────────────────────

function RootsSceneInner() {
  const { progressRef } = useScrollContext();
  const groupRef = useRef<THREE.Group>(null);

  // Which channel node is currently hovered (index 0-3, or -1 for none)
  const [activeNode, setActiveNode] = useState<number>(-1);

  // Procedural branches
  const branches = useRootBranches();
  const rootMaterial = useRootMaterial();

  // Pre-compute tube geometries — stable across renders
  const tubeGeometries = useMemo(
    () =>
      branches.map(
        (b) =>
          new THREE.TubeGeometry(
            b.curve,
            b.tubeSegments,
            b.radius,
            b.radiusSegments,
            false
          )
      ),
    [branches]
  );

  // Per-frame: visibility gating + subtle idle sway
  useFrame(({ clock }) => {
    const raw = progressRef.current;

    // Scene visible in [0.35, 0.65] with small fade buffers
    const visible = raw >= 0.35 && raw <= 0.65;

    if (groupRef.current) {
      groupRef.current.visible = visible;
    }

    if (!visible || !groupRef.current) return;

    // Subtle global rotation — feels like roots breathing underground
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.03 - 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Fog — underground atmosphere */}
      <fog attach="fog" color="#0e0a08" near={3} far={12} />

      {/* Environment IBL — dikhololo_night for underground feel */}
      <Environment preset={HDRI.underground.preset} environmentIntensity={0.3} />

      {/* Very dim ambient — avoids pure black, per scene spec */}
      <ambientLight intensity={0.05} color="#2a1a0e" />

      {/* Warm deep fill from below — simulates bioluminescent root glow */}
      <pointLight
        position={[0, -2, 0]}
        intensity={1.2}
        color="#4d2e12"
        distance={8}
        decay={2}
      />

      {/* Cool accent from the side — contrasts the warm roots */}
      <pointLight
        position={[-2, -0.5, 1]}
        intensity={0.8}
        color="#1a3320"
        distance={6}
        decay={2}
      />

      {/* ── Root tube network ─────────────────────────────────────────────── */}
      {tubeGeometries.map((geometry, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={rootMaterial}
          castShadow
          receiveShadow
        />
      ))}

      {/* ── Central master node — Claude orchestrator ─────────────────────── */}
      <FresnelNode
        position={[0, 0, 0]}
        radius={0.18}
        color="#f4f1ea"
        speed={1.2}
        active={activeNode === -1 ? false : true}
      />

      {/* Central label — always visible */}
      <Html
        position={[0, 0.32, 0]}
        center
        distanceFactor={10}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            color: "#9a968c",
            fontSize: "9px",
            fontFamily: "var(--font-jetbrains-mono, monospace)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          Claude
        </div>
      </Html>

      {/* ── Channel nodes + HTML labels ───────────────────────────────────── */}
      {NODE_POSITIONS.map((pos, i) => (
        <group key={i}>
          {/* Fresnel glow node */}
          <FresnelNode
            position={pos}
            radius={0.12}
            color={NODE_COLORS[i]}
            speed={NODE_SPEEDS[i]}
            active={activeNode === i}
          />

          {/* Floating HTML label */}
          <Html
            position={[pos[0], pos[1] + 0.25, pos[2]]}
            center
            occlude
            distanceFactor={10}
            style={{ pointerEvents: "auto" }}
          >
            <div
              onPointerEnter={() => setActiveNode(i)}
              onPointerLeave={() => setActiveNode(-1)}
              style={{
                cursor: "default",
                padding: "6px 10px",
                textAlign: "center",
                userSelect: "none",
                transition: "opacity 0.2s ease",
                opacity: activeNode === i ? 1 : 0.72,
              }}
            >
              {/* Channel name */}
              <div
                style={{
                  color: activeNode === i ? NODE_COLORS[i] : "#f4f1ea",
                  fontSize: "11px",
                  fontFamily: "var(--font-inter-tight, sans-serif)",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  transition: "color 0.25s ease",
                }}
              >
                {NODE_LABELS[i]}
              </div>

              {/* Channel description */}
              <div
                style={{
                  color: "#6e6b63",
                  fontSize: "8px",
                  fontFamily: "var(--font-inter-tight, sans-serif)",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                  marginTop: "2px",
                }}
              >
                {NODE_DESCRIPTIONS[i]}
              </div>
            </div>
          </Html>
        </group>
      ))}

      {/* Thin connector lines from origin to each node tip */}
      {NODE_POSITIONS.map((pos, i) => (
        <LineConnector key={`line-${i}`} from={[0, 0, 0]} to={pos} active={activeNode === i} color={NODE_COLORS[i]} />
      ))}
    </group>
  );
}

// ─── Thin emissive line from master node to each channel node ─────────────────

interface LineConnectorProps {
  from: [number, number, number];
  to: [number, number, number];
  active: boolean;
  color: string;
}

function LineConnector({ from, to, active, color }: LineConnectorProps) {
  // Build a THREE.Line object and expose it as a <primitive> to avoid
  // JSX <line> colliding with the SVG element type definition.
  const lineObj = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    return new THREE.Line(geo, mat);
    // from/to are static per channel — recreating is unnecessary
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ clock }) => {
    const mat = lineObj.material as THREE.LineBasicMaterial;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.8);
    if (active) {
      mat.color.set(color);
      mat.opacity = 0.55 + pulse * 0.3;
    } else {
      mat.color.set("#3d2210");
      mat.opacity = 0.12 + pulse * 0.08;
    }
  });

  return <primitive object={lineObj} />;
}

// ─── Public export ─────────────────────────────────────────────────────────────

/**
 * RootsScene — ESCENA 3: "Raíces".
 * Renders inside the global R3F Canvas — never mounts its own Canvas.
 */
export function RootsScene() {
  return <RootsSceneInner />;
}

export default RootsScene;
