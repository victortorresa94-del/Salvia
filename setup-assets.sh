#!/bin/bash
# ============================================================
# SALVIA - Asset bootstrap script
# Descarga HDRIs, texturas PBR y modelos 3D para la landing.
# PolyHaven: API pública (no requiere login).
# Modelos: desde repos GitHub con assets CC0 / libres.
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

UA="SalviaLanding/1.0 (aetherlabs.es)"

echo -e "${GREEN}==> Creando estructura de carpetas${NC}"
mkdir -p public/hdri
mkdir -p public/textures/leaf
mkdir -p public/textures/soil
mkdir -p public/textures/bark
mkdir -p public/models
mkdir -p public/frames/hero
mkdir -p public/frames/growth
mkdir -p public/frames/roots
mkdir -p public/draco

# ------------------------------------------------------------
# 1. HDRIs (PolyHaven API)
# ------------------------------------------------------------
echo -e "${GREEN}==> Descargando HDRIs de PolyHaven${NC}"

download_hdri() {
  local slug=$1
  local res=$2
  echo -e "${YELLOW}   - ${slug} (${res})${NC}"
  local files_json=$(curl -s -H "User-Agent: $UA" "https://api.polyhaven.com/files/${slug}")
  local url=$(echo "$files_json" | node -e "
    let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
      try { const j=JSON.parse(d); console.log(j.hdri['${res}'].hdr.url); }
      catch(e) { console.error('parse error'); process.exit(1); }
    });
  ")
  if [ -z "$url" ]; then
    echo -e "${RED}   !! No se pudo resolver URL para $slug${NC}"
    return
  fi
  curl -sL -H "User-Agent: $UA" -o "public/hdri/${slug}.hdr" "$url"
}

download_hdri "kloppenheim_06_puresky" "2k"
download_hdri "rural_landscape" "2k"
download_hdri "dikhololo_night" "2k"
download_hdri "autumn_field" "2k"

# ------------------------------------------------------------
# 2. Texturas PBR (PolyHaven)
# ------------------------------------------------------------
echo -e "${GREEN}==> Descargando texturas PBR${NC}"

download_texture() {
  local slug=$1
  local dest=$2
  local res=$3
  echo -e "${YELLOW}   - ${slug} -> ${dest}${NC}"
  local files_json=$(curl -s -H "User-Agent: $UA" "https://api.polyhaven.com/files/${slug}")

  for map in "Diffuse" "nor_gl" "Rough" "Displacement"; do
    local url=$(echo "$files_json" | node -e "
      let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
        try {
          const j=JSON.parse(d);
          const m=j['${map}'];
          if(m && m['${res}'] && m['${res}'].jpg) console.log(m['${res}'].jpg.url);
          else if(m && m['${res}'] && m['${res}'].png) console.log(m['${res}'].png.url);
        } catch(e){}
      });
    ")
    if [ -n "$url" ]; then
      local ext="${url##*.}"
      curl -sL -H "User-Agent: $UA" -o "public/textures/${dest}/${slug}_${map}.${ext}" "$url"
    fi
  done
}

download_texture "aerial_rocks_02" "soil" "2k"
download_texture "brown_mud_leaves_01" "soil" "2k"
download_texture "bark_willow" "bark" "2k"
download_texture "forrest_ground_01" "leaf" "2k"

# ------------------------------------------------------------
# 3. Modelos 3D demo desde Khronos (CC-BY / CC0)
# ------------------------------------------------------------
echo -e "${GREEN}==> Descargando modelos GLB demo (Khronos)${NC}"

download_glb() {
  local url=$1
  local dest=$2
  echo -e "${YELLOW}   - ${dest}${NC}"
  curl -sL -o "public/models/${dest}" "$url"
}

download_glb "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Avocado/glTF-Binary/Avocado.glb" "avocado_demo.glb"
download_glb "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb" "fish_demo.glb"

echo -e "${RED}   !! AVISO: Los GLB anteriores son demos Khronos solo para probar el pipeline.${NC}"
echo -e "${RED}      Los modelos reales de planta/salvia los descargas tú manualmente desde:${NC}"
echo ""
echo -e "${YELLOW}      RECURSOS DE MODELOS DE PLANTA/NATURALEZA (elige 3-4):${NC}"
echo "      https://sketchfab.com/3d-models/corn-plant-5c4f395b4188417ca1757585be185387"
echo "      https://sketchfab.com/tags/plant  (filtrar: Free + Downloadable + glTF)"
echo "      https://polyhaven.com/models/plants"
echo "      https://quaternius.com/packs/ultimatenaturepack.html  (CC0, pack completo gratis)"
echo ""
echo -e "${YELLOW}      Guarda los .glb en public/models/ con estos nombres:${NC}"
echo "        - seed.glb        (semilla cerrada, hero)"
echo "        - sprout.glb      (brote emergiendo)"
echo "        - sage_adult.glb  (planta de salvia adulta)"
echo "        - root_system.glb (red de raíces)"
echo "        - leaf.glb        (hoja individual)"
echo ""

# ------------------------------------------------------------
# 4. Draco decoder
# ------------------------------------------------------------
echo -e "${GREEN}==> Descargando Draco decoder${NC}"
DRACO_BASE="https://raw.githubusercontent.com/google/draco/master/javascript"
curl -sL -o "public/draco/draco_decoder.js"      "$DRACO_BASE/draco_decoder.js"
curl -sL -o "public/draco/draco_decoder.wasm"    "$DRACO_BASE/draco_decoder.wasm"
curl -sL -o "public/draco/draco_wasm_wrapper.js" "$DRACO_BASE/draco_wasm_wrapper.js"

# ------------------------------------------------------------
# 5. FFmpeg check
# ------------------------------------------------------------
echo -e "${GREEN}==> Verificando FFmpeg${NC}"
if ! command -v ffmpeg &> /dev/null; then
  echo -e "${RED}   !! FFmpeg no instalado. Instala con:${NC}"
  echo "      macOS:  brew install ffmpeg"
  echo "      Linux:  sudo apt install ffmpeg"
else
  echo -e "${GREEN}   FFmpeg OK: $(ffmpeg -version | head -1)${NC}"
fi

# ------------------------------------------------------------
# 6. Auditoría final
# ------------------------------------------------------------
echo ""
echo -e "${GREEN}==> AUDITORÍA${NC}"
echo "HDRIs:     $(ls public/hdri/*.hdr 2>/dev/null | wc -l | tr -d ' ')"
echo "Texturas:  $(find public/textures -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "Modelos:   $(ls public/models/*.glb 2>/dev/null | wc -l | tr -d ' ')"
echo "Draco:     $(ls public/draco/* 2>/dev/null | wc -l | tr -d ' ')"
echo ""
echo -e "${GREEN}Setup base completo.${NC}"
echo -e "${YELLOW}PROXIMOS PASOS MANUALES:${NC}"
echo "  1. Descarga 3-4 modelos de planta reales a public/models/"
echo "  2. Renómbralos: seed.glb, sprout.glb, sage_adult.glb, root_system.glb"
echo "  3. Lanza Claude Code con PROMPT.md"
