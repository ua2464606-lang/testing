/**
 * Steam / smoke shader.
 *
 * A soft, upward-drifting volumetric-looking plume built from layered value
 * noise. Rendered on camera-facing planes with additive blending. The plume
 * fades in/out with `uOpacity` so scenes can dissolve it via the timeline.
 */

export const steamVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const steamFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3  uColor;
  uniform float uSpeed;

  // hash / value noise
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    // drift upward over time, wobble horizontally
    float t = uTime * uSpeed;
    vec2 q = uv * vec2(2.0, 3.0);
    q.y -= t;
    q.x += sin(uv.y * 6.2831 + t) * 0.15;

    float n = fbm(q * 1.6);
    n += fbm(q * 3.3 + 10.0) * 0.4;

    // vertical falloff — dense at base, wispy at top
    float base = smoothstep(0.0, 0.25, uv.y);
    float top = 1.0 - smoothstep(0.55, 1.0, uv.y);
    // horizontal barrel falloff
    float sides = smoothstep(0.0, 0.35, uv.x) * (1.0 - smoothstep(0.65, 1.0, uv.x));

    float density = n * base * top * sides;
    density = pow(clamp(density, 0.0, 1.0), 1.6);

    gl_FragColor = vec4(uColor, density * uOpacity);
  }
`;
