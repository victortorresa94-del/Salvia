/* glsl */
export const particlesFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft disc using gl_PointCoord
    vec2 pc = gl_PointCoord - vec2(0.5);
    float dist = length(pc);
    if (dist > 0.5) discard;

    // Soft edge falloff
    float alpha = smoothstep(0.5, 0.05, dist);

    // Bright core glow
    float glow = smoothstep(0.5, 0.0, dist) * 0.7;

    vec3 color = vColor + vColor * glow;
    gl_FragColor = vec4(color, alpha * vAlpha);
  }
`;
