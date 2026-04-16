/* glsl */
export const particlesVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform int uFormIdx;
  uniform float uMorphBlend;

  attribute vec3 aPosition0;
  attribute vec3 aPosition1;
  attribute vec3 aPosition2;
  attribute vec3 aPosition3;
  attribute vec3 aPosition4;
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;

  varying vec3 vColor;
  varying float vAlpha;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 57.0 + i.z * 113.0;
    return mix(
      mix(mix(hash(n),hash(n+1.0),f.x),mix(hash(n+57.0),hash(n+58.0),f.x),f.y),
      mix(mix(hash(n+113.0),hash(n+114.0),f.x),mix(hash(n+170.0),hash(n+171.0),f.x),f.y),
      f.z
    );
  }

  void main() {
    // Select formation pair from attributes using if-else (GLSL 1.0 compatible)
    vec3 posA, posB;
    if (uFormIdx == 0) { posA = aPosition0; posB = aPosition1; }
    else if (uFormIdx == 1) { posA = aPosition1; posB = aPosition2; }
    else if (uFormIdx == 2) { posA = aPosition2; posB = aPosition3; }
    else if (uFormIdx == 3) { posA = aPosition3; posB = aPosition4; }
    else                    { posA = aPosition4; posB = aPosition4; }

    // Smooth eased lerp between formations
    float blend = uMorphBlend * uMorphBlend * (3.0 - 2.0 * uMorphBlend);
    vec3 pos = mix(posA, posB, blend);

    // Organic time-based drift (reduced during morph for clean transitions)
    float noiseT = uTime * aSpeed * 0.12 + aPhase;
    float drift = 1.0 - sin(blend * 3.14159) * 0.6;
    pos.x += (noise(vec3(pos.y * 0.3, pos.z * 0.2, noiseT)) - 0.5) * 0.4 * drift;
    pos.y += (noise(vec3(pos.z * 0.3, pos.x * 0.2, noiseT + 1.7)) - 0.5) * 0.4 * drift;
    pos.z += (noise(vec3(pos.x * 0.3, pos.y * 0.2, noiseT + 3.4)) - 0.5) * 0.25 * drift;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    // Depth-attenuated size with subtle pulse
    float pulse = 1.0 + sin(uTime * aSpeed * 1.5 + aPhase * 6.28) * 0.15;
    float ptSize = aSize * uPixelRatio * pulse * (250.0 / -mvPos.z);
    gl_PointSize = clamp(ptSize, 1.0, 10.0);
    gl_Position = projectionMatrix * mvPos;

    // Color: sage green → gold → warm white, driven by scroll progress
    vec3 green = vec3(0.29, 0.49, 0.35);
    vec3 gold  = vec3(0.79, 0.66, 0.30);
    vec3 white = vec3(0.94, 0.93, 0.91);

    vec3 color;
    if (uProgress < 0.4) {
      color = mix(green, gold, uProgress / 0.4);
    } else if (uProgress < 0.85) {
      color = mix(gold, white, (uProgress - 0.4) / 0.45);
    } else {
      color = mix(white, green, (uProgress - 0.85) / 0.15);
    }

    vColor = color;
    vAlpha = 0.4 + 0.45 * noise(vec3(pos.xy * 0.5, uTime * 0.1 + aPhase));
  }
`;
