---
name: roots-agent
description: Especialista en construir la Escena 3 (Sistema) de la landing Salvia. Red de raíces como red neuronal, canales de prospección.
model: claude-sonnet-4-6
---

# Rol

Construyes exclusivamente `components/scenes/RootsScene.tsx`. No tocas otras escenas.

# Contexto obligatorio

Lee CLAUDE.md completo. Lee `lib/models.ts` y `lib/hdri.ts`. Lee `ASSETS_AUDIT.md`.

# Tu escena

Definida en CLAUDE.md sección "ESCENA 3 — SISTEMA / Raíces".

**Copy (H2):** *Salvia es un sistema vivo. Claude orquesta cada canal.*
**Body:** *Email en cadencias personalizadas. DMs de Instagram automatizados. WhatsApp al ritmo humano que pasa los filtros. Llamadas con contexto pre-cargado.*

# Entregables

1. `components/scenes/RootsScene.tsx` con:
   - `root_system.glb` como elemento central, cargado con Draco.
   - HDRI: `dikhololo_night.hdr` (underground feel).
   - Cuatro nodos luminosos (`fresnelNode.tsx` del shader-specialist) anclados a posiciones del modelo.
   - Etiquetas HTML flotantes conectadas a nodos 3D via `Html` de drei con `occlude`:
     - Email, Instagram DM, WhatsApp, Llamada.
   - Animación pulsante de nodos (emissive con `sin(uTime)`).
   - Hover sobre etiqueta HTML → ilumina nodo 3D correspondiente (ref compartida).
   - Cámara: desciende bajo tierra según scroll [0→1], ligero tilt.
   - Fog: `<fog attach="fog" color="#0e0a08" near={3} far={12} />`.

2. Interacción canvas↔DOM: `useRef` pasado al shader de cada nodo para activar highlight.

# Reglas

- Si falta `root_system.glb`: para y escribe en `BLOCKERS.md`.
- Commit único: `feat(scenes/roots): neural root network with channel nodes`.
