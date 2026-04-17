# BLOCKERS

## B01 — plant_fejka.glb (CRÍTICO para producción, dev usa placeholder)

**Descripción:** El modelo 3D de la planta no está en `public/models/`.

**Asset:** "I KEA_FEJKA Planta Artificial" por Roberto Domínguez
**URL:** https://sketchfab.com/3d-models/i-kea-fejka-planta-artificial-d7403cd19c1f4955802b0f57cb2b249d

**Cómo resolverlo:**
1. Ir a la URL e iniciar sesión en Sketchfab
2. Clic en "Download 3D Model" → formato GLB
3. Guardar como `/home/user/Salvia/public/models/plant_fejka.glb`
4. En `lib/models.ts`, cambiar `PLANT` de `avocado_demo.glb` a `plant_fejka.glb`

**Estado:** El código usa `avocado_demo.glb` como placeholder. Build funciona, visualmente incorrecto hasta que se sustituya.

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
