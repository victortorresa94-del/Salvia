# SALVIA — Landing agentic 3D premium

> Este archivo es ley. Cualquier sesión de Claude Code en este repo debe leerlo antes de actuar. Si una instrucción del usuario contradice este CLAUDE.md, tú paras y pides aclaración — no la contradices silenciosamente.

---

## 1. NEGOCIO

**Nombre:** Salvia
**Empresa matriz:** Aether Labs (aetherlabs.es) — agencia de IA en Barcelona.
**Tagline oficial:** *"Sistema de Automatización de Leads y Ventas con IA."*

**Qué es Salvia:**
Un sistema pay-per-performance. El cliente no paga setup ni cuota. Nosotros:

1. Hacemos una fase consultiva para entender cómo vende su empresa, qué perfiles compran, qué objeciones hay.
2. Construimos un sistema de prospección multicanal orquestado por Claude (email en cadencia, DMs de Instagram via instagrapi/Phantombuster, WhatsApp automatizado con Playwright ~30 msgs/día, llamadas manuales).
3. Entregamos leads cualificados listos para que su equipo cierre.
4. Nos llevamos un % sobre las ventas cerradas. Sin ventas, sin factura.

**Diferenciales:**
- Ponemos piel en el juego. No cobramos si no generamos.
- Adaptamos el sistema por sector (no es SaaS genérico).
- Claude orquesta los cuatro canales en un pipeline unificado.

**Target:** PYMEs y mid-market B2B que tienen producto validado pero equipo comercial saturado persiguiendo leads fríos.

---

## 2. METÁFORA Y TONO VISUAL

**Metáfora central:** Salvia es una planta aromática. Tu empresa es la tierra. Nosotros plantamos, cuidamos, cosechamos contigo.

**Referencia visual y técnica OBLIGATORIA de estudio:** cornrevolution.resn.global — experiencia scroll vertical cinematográfica con CGI fotorrealista, profundidad de campo dinámica, partículas, transiciones suaves entre escenas. No vamos a copiarla: vamos a hacer lo mismo con plantas reales de salvia y lenguaje visual propio.

**Tono:** Naturaleza editorial. Cine documental. Oscuridad con luz dramática. Cero SaaS-chic. Cero gradientes morados sobre blanco. Cero emojis. Cero geometrías primitivas como protagonistas.

**Lo que NO es:**
- No es un sitio corporativo con hero + features + pricing.
- No es una landing con "Book a demo" en azul.
- No es un sitio con lottie/íconos de línea.

**Lo que SÍ es:**
- Un scroll de cinco planos cinematográficos.
- Cada plano es una escena 3D con cámara dirigida por scroll.
- La tipografía editorial rompe el 3D con contraste deliberado.

---

## 3. STACK TÉCNICO (no negociable)

- **Framework:** Next.js 14 App Router, TypeScript estricto, pnpm.
- **3D:** `three` (bleeding edge), `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`.
- **Scroll:** `gsap` con `ScrollTrigger` + `lenis`, sincronizados vía `gsap.ticker`.
- **Compresión:** modelos servidos con Draco decoder (carpeta `/public/draco`).
- **Tipografía:** `next/font/google` → Fraunces (display), Inter Tight (body), JetBrains Mono (stats).
- **Estilos:** Tailwind como utility-first, pero CSS-in-JS para shaders y componentes canvas.
- **Deploy:** Vercel.

**Librerías PROHIBIDAS** (no instalar sin pedir permiso):
- Bootstrap, Material UI, shadcn/ui (demasiado genérico para este proyecto).
- Lottie.
- Cualquier animation library que no sea gsap o framer-motion.

---

## 4. REGLAS TÉCNICAS INVIOLABLES

### 4.1 Three.js — qué hacer y qué no

**PROHIBIDO:**
- Usar geometrías primitivas (`SphereGeometry`, `BoxGeometry`, `TorusGeometry`, `PlaneGeometry` grande) como elementos principales de una escena. Solo como helpers o colliders invisibles.
- Usar `MeshStandardMaterial` sin al menos 3 mapas PBR cargados. Plano no vale.
- Iluminar solo con `ambientLight + directionalLight`. Eso produce el "look de videojuego barato de 2015".
- Inventar modelos proceduralmente con código. Si falta un GLB, **paras y lo pides.**

**OBLIGATORIO:**
- **Iluminación IBL:** cada escena carga un `<Environment files="/hdri/xxx.hdr" />` de drei.
- **Post-processing:** todas las escenas pasan por un `EffectComposer` con al menos:
  - `Bloom` (luminanceThreshold 0.8, intensity 0.6, mipmap)
  - `DepthOfField` (focus distance dinámico según escena, bokeh scale 3-5)
  - `Vignette` (offset 0.5, darkness 0.6)
  - `Noise` (premultiply, opacity 0.08) — grano cinematográfico
- **Materiales:** usar `MeshPhysicalMaterial` con `clearcoat`, `transmission` (para hojas translúcidas), `sheen` (para suavidad orgánica), o shaders custom.
- **Sombras:** `ContactShadows` de drei, blur 2, opacity 0.4.
- **DPR:** `[1, 2]` adaptativo con `<PerformanceMonitor>`.
- **Draco:** `useGLTF.preload('/models/xxx.glb')` con decoderPath `/draco/`.

### 4.2 Scroll — rigor

- Lenis se engancha a `gsap.ticker`, **nunca** se usa `requestAnimationFrame` directo.
- Cada escena es un container con `position: sticky; top: 0; height: 100vh;` envuelto por un parent con `height: 300vh` (mínimo 3x viewport) para permitir scroll intra-escena.
- Pines con `anticipatePin: 1` y `scrub: 1.5` (nunca `scrub: true` — genera jitter).
- Transiciones entre escenas: 20% del scroll inicial/final de cada escena son crossfades con la siguiente.
- El `<Canvas>` es **único y global** en `app/layout.tsx` o en un provider. Cada escena renderiza dentro de él — no se crean Canvases por escena.

### 4.3 Shaders — cuándo y cómo

Escribir GLSL custom cuando:
- Un material estándar no da el look (movimiento orgánico de hojas, partículas dirigidas, displacement con noise).
- El efecto es repetido y se beneficia de GPU.

Patrones obligatorios a dominar:
- **Curl noise** para movimiento de partículas de polen.
- **Simplex/Perlin noise 3D** para displacement de hojas.
- **Fresnel** para bordes iluminados en contraluz.
- **Vertex displacement** en `onBeforeCompile` o `shaderMaterial` de drei.

Todos los shaders viven en `components/shaders/` como archivos `.glsl` importados con `glslify` o como strings en TypeScript.

### 4.4 Performance — métricas de aceptación

- **Lighthouse Performance:** ≥ 85 en móvil, ≥ 95 en desktop.
- **LCP:** ≤ 2.5s.
- **FPS:** ≥ 55 fps sostenido en M1 / Ryzen 5. En móvil low-end (Moto G60) ≥ 30 fps con fallback automático a versión reducida.
- **Bundle:** JS inicial ≤ 400kb gzipped. Three.js se carga en chunk separado lazy.
- **Assets:** HDRI en 1k para móvil, 2k para desktop (detectar con `window.innerWidth`).

### 4.5 Accesibilidad — mínimo legal

- `prefers-reduced-motion`: si está activo, se desactivan las animaciones de cámara y se muestra la web en versión 2D (frames estáticos).
- Contraste de texto sobre 3D: overlay oscuro `rgba(10,13,10,0.4)` donde haga falta, texto siempre ≥ WCAG AA.
- Todo el contenido informativo debe estar en HTML (no solo en canvas). El canvas es decoración.
- Alt text en cualquier imagen estática.

---

## 5. ESTRUCTURA NARRATIVA DE LA LANDING

Cinco escenas en scroll vertical continuo. Cada una es un capítulo.

### ESCENA 1 — HERO / "La semilla"

**Titular (H1):** *No vendemos software. Sembramos ventas.*
**Subtítulo:** *Salvia es un sistema vivo que cultiva leads cualificados para tu empresa. Sin setup. Sin cuota. Cobramos solo cuando cierras.*

**Visual:**
- Fondo negro profundo (#0a0d0a).
- Una semilla en primer plano (GLB `seed.glb`) flotando, rotando lentamente.
- Haz de luz cenital dramático (spotLight + volumetric mejorado con fog denso).
- Partículas de polen dorado flotando alrededor, 500+ instancias con curl noise.
- Al hacer scroll: la cámara hace dolly-in hacia la semilla, que se abre y revela un brote verde (segundo GLB `sprout.glb`) crossfadeado con morph target.

**CTA:** "Agendar consultoría" + scroll indicator animado.

---

### ESCENA 2 — PROBLEMA / "Tierra estéril"

**Titular (H2):** *Tu equipo comercial se agota persiguiendo leads fríos.*
**Body:** *El 70% del tiempo de un SDR se va en prospectar, no en cerrar. Y 9 de cada 10 leads fríos nunca convierten. Tu pipeline se llena de humo mientras las cuotas de venta siguen subiendo.*

**Visual:**
- Cámara desciende del cielo al suelo agrietado (material PBR `brown_mud_leaves` con displacement fuerte).
- El brote del hero intenta crecer pero se marchita — animación con morph target o shader de wilting.
- Tres stats numéricos con count-up animado al entrar en viewport:
  - 70% tiempo perdido prospectando
  - 1 de 10 leads fríos que convierten
  - 11 meses promedio para recuperar CAC

**Paleta secundaria:** marrones terrosos, ocres, luz baja mortecina (HDRI `dikhololo_night` atenuado).

---

### ESCENA 3 — SISTEMA / "Raíces"

**Titular (H2):** *Salvia es un sistema vivo. Claude orquesta cada canal.*
**Body:** *Email en cadencias personalizadas. DMs de Instagram automatizados. WhatsApp al ritmo humano que pasa los filtros. Llamadas con contexto pre-cargado. Todo conectado. Todo medido. Todo vivo.*

**Visual:**
- Cámara baja bajo tierra. Fondo pasa a marrón oscuro translúcido.
- Red de raíces (`root_system.glb`) se extiende en el espacio como una red neuronal.
- Cada raíz representa un canal: etiquetas HTML flotando ancladas a nodos 3D.
  - Email → raíz 1
  - Instagram DM → raíz 2
  - WhatsApp → raíz 3
  - Llamada → raíz 4
- Nodos luminosos pulsan (emissive animado con shader) cuando "convierten" — efecto tipo sinapsis.
- En el centro: logo de Claude como nodo maestro que coordina todo.

**Interacción:** al hacer hover sobre cada raíz desde el texto, se ilumina el nodo 3D correspondiente (via refs compartidas canvas-DOM).

---

### ESCENA 4 — CRECIMIENTO / "Planta adulta"

**Titular (H2):** *Nosotros plantamos. Tú cosechas.*
**Body:** *Te entregamos leads cualificados listos para cerrar. Tu equipo se dedica a vender, no a buscar. Y nosotros solo facturamos sobre lo que cierras.*

**Visual:**
- Vuelta a superficie. Luz dorada cálida (HDRI `autumn_field`).
- Planta de salvia adulta (`sage_adult.glb`) ocupa plano completo.
- Flores moradas (color `--accent-bloom`) se abren en secuencia con shader de displacement + scale animada.
- Tres cards HTML overlay con el modelo pay-per-performance:
  1. **Fase 0 — Consultoría**: entendemos tu negocio. Gratis.
  2. **Fase 1 — Sistema**: lo construimos y operamos. Cero factura.
  3. **Fase 2 — Cosecha**: cobramos un % sobre ventas cerradas.

**Detalle técnico:** las flores abriéndose usan un `shaderMaterial` con uniforms `uBloom` (0 → 1) dirigido por scroll.

---

### ESCENA 5 — COSECHA / CTA final

**Titular (H2):** *¿Hay terreno fértil en tu negocio?*
**Body:** *Agenda una consultoría gratuita de 30 minutos. Te decimos si Salvia encaja — o no.*

**Visual:**
- Plano cenital. La cámara sube hasta ver la planta desde arriba formando un patrón geométrico.
- Formulario minimalista: nombre, email, empresa, sector.
- Botón CTA con efecto magnético (cursor atrae el botón hacia sí en un radio de 80px).
- Al enviar: animación de siembra — confirmación en texto.

**Footer minimalista:** logo Aether Labs, "Salvia es un producto de Aether Labs · Barcelona · 2026", links legales.

---

## 6. PALETA Y TIPOGRAFÍA

### Paleta CSS variables (en `app/globals.css`)

```css
:root {
  --bg-deep: #0a0d0a;
  --bg-soil: #1a1410;
  --bg-underground: #0e0a08;
  --bg-golden: #2a2012;

  --accent-sage: #87a878;
  --accent-sage-deep: #4d6b41;
  --accent-bloom: #b580c7;
  --accent-gold: #d4a84b;
  --accent-copper: #b86a3c;

  --text: #f4f1ea;
  --text-muted: #9a968c;
  --text-faded: #6e6b63;

  --stroke: rgba(244,241,234,0.08);
}
```

### Tipografía

- **Display** (titulares): Fraunces, weight 300–500, opsz 144.
- **Body** (párrafos): Inter Tight, weight 400–500, tracking -0.01em.
- **Mono** (stats, números): JetBrains Mono, weight 400, uppercase en stats.

---

## 7. ESTRUCTURA DE ARCHIVOS ESPERADA

```
app/
  layout.tsx
  page.tsx
  globals.css
components/
  canvas/
    GlobalCanvas.tsx
    SceneManager.tsx
    PostProcessing.tsx
    CameraRig.tsx
  scenes/
    SeedScene.tsx
    SoilScene.tsx
    RootsScene.tsx
    BloomScene.tsx
    HarvestScene.tsx
  shaders/
    curlNoise.glsl
    wiltingMaterial.tsx
    bloomingMaterial.tsx
    fresnelNode.tsx
    polenParticles.tsx
  ui/
    LoadingScreen.tsx
    Navigation.tsx
    SceneText.tsx
    MagneticButton.tsx
    SplitText.tsx
    CountUp.tsx
    Form.tsx
  scroll/
    SmoothScroll.tsx
    useScrollProgress.ts
    useScrollScene.ts
lib/
  gsap.ts
  lenis.ts
  models.ts
  hdri.ts
hooks/
  useFramePreloader.ts
  useReducedMotion.ts
  useDeviceTier.ts
public/
  hdri/*.hdr
  textures/**
  models/*.glb
  draco/*
  frames/**
scripts/
  audit-glb.ts
```

---

## 8. WORKFLOW AGENTIC

### 8.1 Fases obligatorias (no saltarse)

**FASE 0 — Auditoría.** Antes de escribir cualquier línea de código:
1. `ls -la public/models/ public/hdri/ public/textures/`.
2. Script Node con `@gltf-transform/core` que imprima por GLB: geometrías, materiales, animaciones, bbox, vertex count.
3. Escribir `ASSETS_AUDIT.md`.
4. Si falta un asset crítico — **PARAR y reportar al usuario**. No inventar.

**FASE 1 — Fundaciones.** Stack, fonts, Lenis, GSAP, GlobalCanvas con HDRI + PostProcessing, un modelo de prueba cargado con Draco.

**FASE 2 — Escenas (paralelo).** Un agente por escena.

**FASE 3 — Shaders.** shader-specialist escribe curlNoise, wilting, blooming, fresnel.

**FASE 4 — Orquestación.** Timeline maestro GSAP en `app/page.tsx`.

**FASE 5 — UI overlay.** Loading screen, nav, texto animado, formulario.

**FASE 6 — Performance pass.** Lighthouse, FPS, DPR adaptativo, degradación móvil.

**FASE 7 — A11y y fallback.** reduced-motion, versión 2D, contraste, SEO.

### 8.2 Convenciones de commit

- `feat(canvas): global canvas with HDRI + postfx`
- `feat(scenes/seed): hero scene with pollen particles`
- `feat(shaders): blooming material with simplex displacement`
- `perf: adaptive DPR and device tier detection`
- `a11y: reduced-motion fallback to static frames`

---

## 9. PROHIBICIONES EXPLÍCITAS

1. Crear un `<Sphere />`, `<Box />` o `<Torus />` que sea protagonista de una escena.
2. Usar `<MeshStandardMaterial color="..." />` sin mapas PBR.
3. Instanciar un `ambientLight intensity={1}` como única luz.
4. Montar un segundo `<Canvas>` además del global.
5. Escribir copy en inglés. Todo en español.
6. Usar emojis decorativos en la UI.
7. Usar gradiente morado sobre blanco.
8. Animar con `setInterval` o `requestAnimationFrame` fuera del ticker de gsap.
9. Inventar un modelo 3D con geometría procedural cuando falta un GLB.
10. Commitear sin correr `pnpm build` + `pnpm lint` localmente.

---

## 10. REGLA DE ORO

Mejor parar y pedir un asset que inventar una geometría primitiva fea. El objetivo no es "una landing que funciona". El objetivo es una experiencia que haga a un cliente pensar *joder, quién los ha hecho*.
