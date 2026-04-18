'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function fixMaterials(scene: THREE.Object3D) {
  scene.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return
    const mesh = child as THREE.Mesh
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    mats.forEach((mat) => {
      if (!mat) return
      const m = mat as THREE.MeshStandardMaterial
      if (!m.isMeshStandardMaterial) return
      if (m.map)         { m.map.colorSpace         = THREE.SRGBColorSpace; m.map.needsUpdate         = true }
      if (m.emissiveMap) { m.emissiveMap.colorSpace   = THREE.SRGBColorSpace; m.emissiveMap.needsUpdate = true }
      m.metalness = 0
      m.envMapIntensity = 0.3
      m.needsUpdate = true
    })
  })
}

function Avocado() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/avocado.glb')
  const ready = useRef(false)

  useEffect(() => {
    if (ready.current) return
    ready.current = true
    const box    = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size   = box.getSize(new THREE.Vector3())
    const scale  = 3.2 / Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(scale)
    scene.position.sub(center.multiplyScalar(scale))
    fixMaterials(scene)
  }, [scene])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.35
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.12
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function GoldDust() {
  const ref   = useRef<THREE.Points>(null)
  const count = 120
  const pos   = useRef((() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i*3]   = (Math.random()-0.5)*7
      a[i*3+1] = (Math.random()-0.5)*6
      a[i*3+2] = (Math.random()-0.5)*4
    }
    return a
  })())

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos.current, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffe066" size={0.022} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function AvocadoScene() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0.2, 5.5)
  }, [camera])

  return (
    <>
      <spotLight position={[3, 7, 5]} angle={0.45} penumbra={0.7} intensity={7} color="#fff8e8" castShadow />
      <pointLight position={[-4, 2, -3]} intensity={2.5} color="#aaffcc" distance={14} decay={2} />
      <pointLight position={[3, -2, 3]}  intensity={1.8} color="#ffcc55" distance={12} decay={2} />
      <ambientLight intensity={0.6} color="#fffbe8" />
      <Avocado />
      <GoldDust />
      <ContactShadows position={[0, -2.0, 0]} opacity={0.18} scale={6} blur={3} far={4} color="#001008" />
    </>
  )
}

export default function AvocadoBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && textRef.current) {
          textRef.current.style.opacity    = '1'
          textRef.current.style.transform  = 'translateY(0)'
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#030a06',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 70% at 65% 50%, rgba(80,140,60,0.08) 0%, transparent 70%)',
      }} />

      {/* Layout */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 1200, margin: '0 auto',
        padding: 'clamp(60px,10vh,120px) clamp(24px,6vw,80px)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: '48px',
        alignItems: 'center',
      }}>
        {/* Text — left */}
        <div
          ref={textRef}
          style={{
            opacity: 0,
            transform: 'translateY(40px)',
            transition: 'opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <p style={{
            fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'rgba(168,255,87,0.8)', marginBottom: 20,
            fontFamily: 'DM Sans,sans-serif', fontWeight: 500,
          }}>
            Salvia · Pipeline Inteligente
          </p>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(38px,5vw,72px)',
            lineHeight: 0.93,
            letterSpacing: '-0.032em',
            color: '#f5f0ea',
            whiteSpace: 'pre-line',
            margin: '0 0 28px 0',
          }}>
            {'Madura tu\npipeline de ventas.'}
          </h2>

          <p style={{
            fontSize: 'clamp(14px,1.3vw,17px)',
            color: 'rgba(240,235,228,0.55)',
            lineHeight: 1.7,
            maxWidth: 380,
            fontFamily: 'DM Sans,sans-serif',
            marginBottom: 40,
          }}>
            Nutrimos cada oportunidad con el mensaje correcto, en el canal correcto, en el momento justo. Tu pipeline avanza solo.
          </p>

          <a
            href="#how-it-works"
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: '#a8ff57',
              fontWeight: 600,
              fontSize: 15,
              padding: '14px 32px',
              borderRadius: 999,
              border: '1.5px solid rgba(168,255,87,0.4)',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              fontFamily: 'DM Sans,sans-serif',
              transition: 'background 0.25s, border-color 0.25s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background   = 'rgba(168,255,87,0.08)'
              el.style.borderColor  = 'rgba(168,255,87,0.8)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background   = 'transparent'
              el.style.borderColor  = 'rgba(168,255,87,0.4)'
            }}
          >
            Ver cómo funciona →
          </a>
        </div>

        {/* Canvas — right */}
        <div style={{ height: 'clamp(340px,55vh,640px)', position: 'relative' }}>
          <Canvas
            camera={{ position: [0, 0.2, 5.5], fov: 44 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ReinhardToneMapping,
              toneMappingExposure: 1.5,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <AvocadoScene />
          </Canvas>
        </div>
      </div>

      {/* Bottom edge fade to next section */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%',
        background: 'linear-gradient(to top, rgba(6,16,10,0.85), transparent)',
        pointerEvents: 'none', zIndex: 3,
      }} />

      <style>{`
        @media (max-width: 640px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

useGLTF.preload('/models/avocado.glb')
