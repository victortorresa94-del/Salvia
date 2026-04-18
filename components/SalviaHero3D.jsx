"use client";

/**
 * SALVIA Hero 3D — v2
 *
 * Cambios respecto a v1:
 * - Núcleo icosaédrico (no hoja): estructura, no orgánico
 * - Rotación interna constante, sin Float/wobble
 * - Órbitas keplerianas: velocidad inversamente proporcional al radio
 * - Conectores dinámicos: se actualizan cada frame
 * - Iluminación puntual específica (no Environment preset)
 * - Nodos siempre orientados al usuario (sin rotation.z = angle)
 * - Partículas ambientales mínimas
 * - Sin ContactShadows, sin roundedRectGeometry custom
 *
 * deps: three @react-three/fiber @react-three/drei
 */

import React, { useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

// ─── Types ────────────────────────────────────────────────────────────────────

const NODE_SPECS = [
  {
    key: "clinics",
    label: "Clinics",
    subtitle: "Citas · filtros · reactivación",
    icon: "clinics",
    angle: Math.PI * 0.08,
    radius: 3.1,
    color: "#7CFF7A",
    accentRgb: "124,255,122",
  },
  {
    key: "realestate",
    label: "Real Estate",
    subtitle: "WhatsApp · cualificación",
    icon: "realestate",
    angle: Math.PI * 0.58,
    radius: 2.85,
    color: "#C3FF66",
    accentRgb: "195,255,102",
  },
  {
    key: "education",
    label: "Education",
    subtitle: "Nurturing · cierres",
    icon: "education",
    angle: Math.PI * 1.12,
    radius: 3.05,
    color: "#5CFFB8",
    accentRgb: "92,255,184",
  },
  {
    key: "services",
    label: "Field Services",
    subtitle: "Urgencias · agenda",
    icon: "services",
    angle: Math.PI * 1.68,
    radius: 2.9,
    color: "#A5FF7A",
    accentRgb: "165,255,122",
  },
];

// Keplerian: angular velocity ∝ 1/r^1.5  (simplified)
const BASE_SPEED = 0.22;
function orbitalSpeed(radius) {
  return BASE_SPEED / Math.pow(radius / 3.0, 1.5);
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconGlyph({ type, color }) {
  const s = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "clinics")
    return (
      <svg {...s}>
        <path d="M12 21s7-4.4 7-11a4 4 0 0 0-7-2.4A4 4 0 0 0 5 10c0 6.6 7 11 7 11Z" />
        <path d="M12 9v5M9.5 11.5h5" />
      </svg>
    );
  if (type === "realestate")
    return (
      <svg {...s}>
        <path d="M3 10.5 12 3l9 7.5M5 10v10h14V10M10 20v-6h4v6" />
      </svg>
    );
  if (type === "education")
    return (
      <svg {...s}>
        <path d="M12 3 2.5 8l9.5 5 9.5-5L12 3ZM6 11v6c2 1.6 4 2.4 6 2.4s4-.8 6-2.4v-6" />
      </svg>
    );
  return (
    <svg {...s}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  );
}

// ─── Core ─────────────────────────────────────────────────────────────────────

function SalviaCore() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const glowRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.09;
      outerRef.current.rotation.x = t * 0.055;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.14;
      innerRef.current.rotation.z = t * 0.07;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.06 + Math.sin(t * 0.8) * 0.015;
    }
  });

  return (
    <group>
      {/* Outer wireframe icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial
          color="#EAFFEA"
          metalness={0.55}
          roughness={0.15}
          emissive="#52FF69"
          emissiveIntensity={0.12}
          wireframe
        />
      </mesh>

      {/* Inner solid icosahedron — semi-transparent */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.72, 0]} />
        <meshStandardMaterial
          color="#0D1A0E"
          metalness={0.3}
          roughness={0.6}
          emissive="#3AE050"
          emissiveIntensity={0.18}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Soft glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial
          color="#7CFF7A"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* SALVIA label */}
      <Html center distanceFactor={8.5} position={[0, 0, 1.2]}>
        <div
          style={{
            pointerEvents: "none",
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(12,20,12,0.72)",
            border: "1px solid rgba(124,255,122,0.22)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
            color: "#7CFF7A",
            letterSpacing: 3,
            fontWeight: 500,
            fontSize: 11,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          SALVIA
        </div>
      </Html>
    </group>
  );
}

// ─── Dynamic connectors ───────────────────────────────────────────────────────

function DynamicConnectors({ nodeRefs, specs }) {
  const lineRefs = useRef([]);

  useFrame(() => {
    nodeRefs.current.forEach((group, i) => {
      if (!group || !lineRefs.current[i]) return;
      const line = lineRefs.current[i];
      const worldPos = new THREE.Vector3();
      group.getWorldPosition(worldPos);

      const positions = new Float32Array([0, 0, 0, worldPos.x, worldPos.y, worldPos.z]);
      line.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      line.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group>
      {specs.map((spec, i) => {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(6), 3)
        );
        return (
          <line
            key={spec.key}
            ref={(el) => (lineRefs.current[i] = el)}
            geometry={geom}
          >
            <lineBasicMaterial
              color={spec.color}
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </line>
        );
      })}
    </group>
  );
}

// ─── Industry node ────────────────────────────────────────────────────────────

function IndustryNode({ spec, nodeRef }) {
  const [hovered, setHovered] = useState(false);
  const speed = orbitalSpeed(spec.radius);
  const phaseRef = useRef(spec.angle);

  useFrame((_, delta) => {
    phaseRef.current += speed * delta;
    const a = phaseRef.current;
    const r = spec.radius;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * 0.42; // elliptical
    const z = Math.sin(a * 0.7) * 0.5;

    if (nodeRef.current) {
      nodeRef.current.position.set(x, y, z);

      const targetScale = hovered ? 1.07 : 1.0;
      nodeRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group ref={nodeRef}>
      {/* Chip geometry */}
      <mesh
        castShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial
          color={spec.color}
          emissive={spec.color}
          emissiveIntensity={hovered ? 0.9 : 0.4}
          metalness={0.1}
          roughness={0.6}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Node card — HTML overlay */}
      <Html
        center
        distanceFactor={9}
        position={[0, 0, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          style={{
            pointerEvents: "auto",
            width: 136,
            padding: "10px 12px",
            borderRadius: 12,
            background: hovered
              ? `rgba(${spec.accentRgb},0.1)`
              : "rgba(10,14,10,0.78)",
            border: `1px solid rgba(${spec.accentRgb},${hovered ? 0.4 : 0.18})`,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            fontFamily: "'DM Mono', 'Fira Mono', monospace",
            color: "white",
            textAlign: "left",
            transition: "background 0.25s, border-color 0.25s",
            cursor: "default",
            userSelect: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `rgba(${spec.accentRgb},0.12)`,
                border: `1px solid rgba(${spec.accentRgb},0.25)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconGlyph type={spec.icon} color={spec.color} />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1,
                color: "#F0FFF0",
                letterSpacing: 0.3,
              }}
            >
              {spec.label}
            </span>
          </div>
          <div
            style={{
              fontSize: 10,
              color: `rgba(${spec.accentRgb},0.75)`,
              lineHeight: 1.4,
              letterSpacing: 0.2,
            }}
          >
            {spec.subtitle}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ─── Ambient particles ────────────────────────────────────────────────────────

function AmbientParticles({ count = 120 }) {
  const ref = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.018;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.012) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7CFF7A"
        size={0.022}
        transparent
        opacity={0.45}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene() {
  // Refs for each node, so connectors can read world positions
  const nodeRefs = useRef(NODE_SPECS.map(() => React.createRef()));

  return (
    <>
      {/* Lighting: specific, not a preset */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 4]} intensity={2.2} color="#52FF69" distance={9} decay={2} />
      <pointLight position={[5, 3, 2]} intensity={0.9} color="#FFFFFF" distance={12} decay={2} />
      <pointLight position={[-5, -2, -2]} intensity={0.55} color="#1A3020" distance={10} decay={2} />

      <AmbientParticles count={140} />

      <SalviaCore />

      <DynamicConnectors nodeRefs={nodeRefs} specs={NODE_SPECS} />

      {NODE_SPECS.map((spec, i) => (
        <IndustryNode
          key={spec.key}
          spec={spec}
          nodeRef={nodeRefs.current[i]}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.55}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.95}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function SalviaHero3D({ height = 440, className = "" }) {
  return (
    <div
      className={className}
      style={{
        height,
        width: "100%",
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        background: [
          "radial-gradient(ellipse 900px 500px at 40% 50%, rgba(52,255,105,0.07) 0%, transparent 65%)",
          "radial-gradient(ellipse 600px 400px at 70% 20%, rgba(124,255,122,0.04) 0%, transparent 60%)",
          "linear-gradient(170deg, #080C09 0%, #050807 100%)",
        ].join(", "),
        border: "1px solid rgba(124,255,122,0.1)",
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            "linear-gradient(rgba(124,255,122,0.04) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(124,255,122,0.04) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "52px 52px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(5,8,7,0.75) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Canvas
        camera={{ position: [0, 0.5, 7.8], fov: 40 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "relative", zIndex: 2 }}
      >
        <Scene />
      </Canvas>

      {/* Interaction hint */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 18,
          zIndex: 10,
          fontFamily: "'DM Mono', 'Fira Mono', monospace",
          fontSize: 11,
          color: "rgba(124,255,122,0.55)",
          padding: "6px 11px",
          borderRadius: 999,
          background: "rgba(5,10,6,0.65)",
          border: "1px solid rgba(124,255,122,0.12)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          pointerEvents: "none",
          letterSpacing: 0.5,
        }}
      >
        drag · hover
      </div>

      {/* Brand mark — top left */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 20,
          zIndex: 10,
          fontFamily: "'DM Mono', 'Fira Mono', monospace",
          fontSize: 10,
          color: "rgba(124,255,122,0.4)",
          letterSpacing: 3,
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        Sistema de leads B2B
      </div>
    </div>
  );
}
