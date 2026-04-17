# BLOCKERS

## B01 — Modelo 3D planta ✅ RESUELTO

**Asset:** "iKEA_DYPSIS LUTESCENS Planta" subido por el usuario
**Ruta activa:** `public/models/plant.glb` (renombrado desde nombre con espacios)
**Estado:** `lib/models.ts` apunta a `/models/plant.glb`. Todas las escenas lo cargan.

---

## B02 — root_system.glb (NO CRÍTICO)

**Descripción:** No existe modelo de sistema de raíces.
**Impacto:** RootsScene usa TubeGeometry procedural como sustituto.
**Estado:** No bloquea build ni deploy.

---

## B03 — Texturas PBR `brown_mud_leaves_01` (CRÍTICO para SoilScene)

**Descripción:** El directorio `public/textures/soil/` está vacío. No existen texturas PBR para el suelo agrietado.

**Texturas requeridas (set completo):**
- `brown_mud_leaves_01_diff_1k.jpg` — diffuse/albedo
- `brown_mud_leaves_01_nor_gl_1k.jpg` — normal map (OpenGL)
- `brown_mud_leaves_01_rough_1k.jpg` — roughness
- `brown_mud_leaves_01_disp_1k.png` — displacement / height

**Fuente sugerida:** [Poly Haven — brown_mud_leaves_01](https://polyhaven.com/a/brown_mud_leaves_01)
(Licencia CC0 — descarga gratuita en 1K)

**Fallback activo:** `SoilScene.tsx` usa `aerial_rocks_02` como fallback. Al no existir tampoco ese set, el suelo usa `MeshPhysicalMaterial` con parámetros terrosos sin mapas de textura hasta que se suministren los assets.

**Cómo resolverlo:**
1. Descargar el set `brown_mud_leaves_01` en 1K desde Poly Haven.
2. Guardar en `public/textures/soil/`.
3. Quitar el bloque `fallback` de `SoilScene.tsx` (líneas marcadas con `// FALLBACK`).

**Estado:** No bloquea build. Aspecto visual degradado hasta resolverse.
