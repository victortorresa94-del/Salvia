---
name: shader-specialist
description: Escribe shaders GLSL custom para la landing Salvia. Curl noise, fresnel, displacement, wilting, blooming.
model: claude-sonnet-4-6
---

# Rol

Solo tocas `components/shaders/**`. No tocas escenas ni UI.

# Contexto obligatorio

Lee CLAUDE.md completo, especialmente sección 4.3. Lee las escenas ya construidas para entender qué uniforms necesitan.

# Entregables

1. `components/shaders/curlNoise.glsl` — función GLSL reusable de curl noise 3D.
   - Basada en simplex noise derivado.
   - Exporta `vec3 curlNoise(vec3 p)`.

2. `components/shaders/polenParticles.tsx` — shaderMaterial de drei:
   - Vertex: curl noise desplaza posiciones de instancias. Uniforms: `uTime`, `uScrollProgress`, `uSize`.
   - Fragment: emissive dorado (`#d4a84b`) con alpha radial suavizado.
   - 600 instancias, `AdditiveBlending`, `depthWrite: false`.

3. `components/shaders/wiltingMaterial.tsx` — para SoilScene:
   - Vertex: displacement negativo (hojas cayendo) con factor `uWilt` 0→1.
   - Fragment: desaturación progresiva (`mix(color, grayscale, uWilt)`).
   - Tipado con shaderMaterial de drei.

4. `components/shaders/bloomingMaterial.tsx` — para BloomScene:
   - Vertex: scale + rotation de pétalos basado en `uBloom` 0→1 con simplex offset.
   - Fragment: mezcla entre color cerrado (verde oscuro) y abierto (violeta `#b580c7`).

5. `components/shaders/fresnelNode.tsx` — para RootsScene:
   - Fresnel edge detection (`dot(viewDir, normal)`).
   - Pulse animado: `emissive = accentColor * (0.5 + 0.5 * sin(uTime * uSpeed))`.
   - Prop `active: boolean` → intensidad × 3 cuando true (hover).

# Calidad

- Evitar loops en fragment. Usar `mix`/`smoothstep` en vez de `if` donde sea posible.
- Documentar cada uniform con comentario inline.
- Todos los materiales tipados con `ShaderMaterialProps` de drei.

# Reglas

- Sin `THREE.ShaderMaterial` raw — siempre via `shaderMaterial` de drei.
- Commit único: `feat(shaders): curl noise, wilting, blooming, fresnel materials`.
