/**
 * Atmosphere backdrop shader.
 *
 * A large sphere rendered from the inside. Produces a graded, breathing
 * darkness with a soft volumetric glow whose colour and height shift per
 * scene (cold blue vault → warm amber restaurant), driven by `uWarmth`.
 */

export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vWorldPos;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uWarmth;   // 0 = cold vault, 1 = warm restaurant
  uniform float uGlow;     // intensity of the horizon glow

  vec3 coldTop    = vec3(0.01, 0.02, 0.04);
  vec3 coldBottom = vec3(0.03, 0.08, 0.14);
  vec3 warmTop    = vec3(0.03, 0.015, 0.01);
  vec3 warmBottom = vec3(0.18, 0.09, 0.03);

  void main() {
    // vertical gradient in UV space of the sphere
    float h = clamp(vUv.y, 0.0, 1.0);

    vec3 top = mix(coldTop, warmTop, uWarmth);
    vec3 bottom = mix(coldBottom, warmBottom, uWarmth);
    vec3 col = mix(bottom, top, smoothstep(0.15, 0.85, h));

    // soft horizon glow band that gently pulses
    float band = exp(-pow((h - 0.34) * 6.0, 2.0));
    float pulse = 0.85 + 0.15 * sin(uTime * 0.4);
    vec3 glowCol = mix(vec3(0.10, 0.22, 0.35), vec3(0.55, 0.28, 0.08), uWarmth);
    col += glowCol * band * uGlow * pulse;

    // subtle vignetting toward the poles
    col *= 0.6 + 0.4 * smoothstep(0.0, 0.5, 1.0 - abs(h - 0.5) * 2.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;
