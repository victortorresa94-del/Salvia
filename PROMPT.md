Hola. Proyecto: **Salvia** — landing 3D premium. Tu guía de trabajo es `CLAUDE.md` en la raíz. Lo lees ENTERO antes de hacer absolutamente nada.

## Pre-requisitos

- `CLAUDE.md` existe en raíz.
- Asset bootstrap ya ejecutado (`./setup-assets.sh`).
- Carpetas `.claude/agents/` con los 7 agentes: scene-seed, scene-soil, scene-roots, scene-bloom, scene-harvest, shader-specialist, perf-auditor.

Si algo de lo anterior falta, paras y me lo dices.

## Flujo de trabajo

Sigues las Fases 0→7 de `CLAUDE.md` sección 8.1 en orden estricto.

**Ahora ejecutas Fase 0.** Auditoría de assets:

1. `ls -la public/` recursivo.
2. Para cada `.glb` en `public/models/`: instala `@gltf-transform/core` si no está, y escribe un script `scripts/audit-glb.ts` que imprima por modelo:
   - Nombre, tamaño en MB.
   - Vertex count total.
   - Lista de materiales con sus mapas PBR (baseColor, metallic, roughness, normal, emissive).
   - Animaciones presentes.
   - Bounding box.
3. Para cada HDRI: tamaño, resolución detectada.
4. Escribe `ASSETS_AUDIT.md` con todo.
5. Valida contra la lista esperada de CLAUDE.md:
   - Modelos requeridos: `seed.glb`, `sprout.glb`, `sage_adult.glb`, `root_system.glb`, `leaf.glb`.
   - HDRIs requeridos: `kloppenheim_06_puresky.hdr`, `rural_landscape.hdr`, `dikhololo_night.hdr`, `autumn_field.hdr`.
   - Texturas requeridas: al menos un set leaf, un set soil, un set bark.
6. Si falta algo:
   - Escribe `BLOCKERS.md` con la lista exacta y links sugeridos.
   - **PARAS.** No pasas a Fase 1.

Cuando termines la auditoría, muestra:
- El contenido de `ASSETS_AUDIT.md`.
- Si hay, `BLOCKERS.md`.
- Tu recomendación: seguir a Fase 1 o esperar a que el usuario complete assets.

No toques nada más. Empieza.
