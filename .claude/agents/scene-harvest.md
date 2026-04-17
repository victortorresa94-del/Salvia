---
name: harvest-agent
description: Especialista en construir la Escena 5 (CTA final) de la landing Salvia. Vista cenital, formulario de contacto, botón magnético.
model: claude-sonnet-4-6
---

# Rol

Construyes exclusivamente `components/scenes/HarvestScene.tsx` y `components/ui/Form.tsx`. No tocas otras escenas.

# Contexto obligatorio

Lee CLAUDE.md completo. Lee `lib/models.ts` y `lib/hdri.ts`. Lee `ASSETS_AUDIT.md`.

# Tu escena

Definida en CLAUDE.md sección "ESCENA 5 — COSECHA / CTA final".

**Copy (H2):** *¿Hay terreno fértil en tu negocio?*
**Body:** *Agenda una consultoría gratuita de 30 minutos. Te decimos si Salvia encaja — o no.*

# Entregables

1. `components/scenes/HarvestScene.tsx` con:
   - Vista cenital de `sage_adult.glb` (reutiliza el mismo GLB, nueva posición de cámara).
   - HDRI: `autumn_field.hdr`.
   - Cámara sube en zoom-out hasta vista top-down según scroll [0→1].
   - Overlay oscuro `rgba(10,13,10,0.6)` para contraste de texto.

2. `components/ui/Form.tsx` con:
   - Campos: nombre, email, empresa, sector (select).
   - Input con underline animado en focus (CSS transition).
   - Validación client-side básica (required, email format).
   - Estado de envío: loading → success con animación de siembra (semilla cae del botón).
   - `MagneticButton` del ui: botón CTA con efecto magnético radio 80px.
   - Submit: `fetch('/api/contact')` — si no existe endpoint, mockar con `console.log` y TODO.

3. Footer: "Salvia es un producto de Aether Labs · Barcelona · 2026" + links legales.

# Reglas

- Formulario en español. Cero anglicismos en labels.
- Commit único: `feat(scenes/harvest): cta scene with magnetic form`.
