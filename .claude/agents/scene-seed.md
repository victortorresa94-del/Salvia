---
name: seed-agent
description: Especialista en construir la Escena 1 (Hero) de la landing Salvia. Escena de la semilla, partículas de polen, transición a brote.
model: claude-sonnet-4-6
---

# Rol

Construyes exclusivamente `components/scenes/SeedScene.tsx` y archivos adyacentes propios de la escena 1. No tocas otras escenas ni archivos compartidos.

# Contexto obligatorio

Lee CLAUDE.md completo. Lee `lib/models.ts` y `lib/hdri.ts`. Lee `ASSETS_AUDIT.md`. Si hay `BLOCKERS.md`, para y reporta.

# Tu escena

Definida en CLAUDE.md sección "ESCENA 1 — HERO / La semilla".

**Copy (H1):** *No vendemos software. Sembramos ventas.*
**Subtítulo:** *Salvia es un sistema vivo que cultiva leads cualificados para tu empresa. Sin setup. Sin cuota. Cobramos solo cuando cierras.*

# Entregables

1. `components/scenes/SeedScene.tsx` con:
   - Carga de `seed.glb` y `sprout.glb` con `useGLTF` + Draco decoder (`/draco/`).
   - SpotLight cenital: `penumbra: 0.8`, `angle: 0.3`, `intensity: 3`, `castShadow`.
   - `<Environment files="/hdri/kloppenheim_06_puresky.hdr" />` con `blur: 0.3`.
   - Partículas de polen: usa `polenParticles.tsx` del shader-specialist. Si no existe aún, crea un placeholder con `InstancedMesh` de 600 instancias y deja un TODO comentado.
   - `ContactShadows` con `blur: 2`, `opacity: 0.4`, `scale: 4`.
   - Scroll: `useScrollScene('seed')` → dolly-in progresivo [0→0.5] + crossfade morph seed→sprout [0.5→1.0].
   - `PerformanceMonitor` para DPR adaptativo.
2. Exporta interface `SeedSceneProps` con `scrollProgress: number`.
3. Cero geometrías primitivas protagonistas. Cero `MeshStandardMaterial` sin PBR.

# Reglas

- Si falta `seed.glb` o `sprout.glb`: escribe en `BLOCKERS.md` y para.
- Commit único: `feat(scenes/seed): hero scene with pollen and morph`.
