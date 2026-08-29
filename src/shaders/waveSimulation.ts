/**
 * Advanced 2D Wave Equation Simulation Shaders
 * Supports 6 distinct physical ripple propagation modes:
 * 0: CLASSIC HYDRODYNAMIC (Smooth natural water wave PDE)
 * 1: HARMONIC ECHO RINGS  (Concentric multi-ring Bessel acoustic shockwave)
 * 2: VISCOUS MERCURY      (Heavy surface tension, deep displacement, liquid metal)
 * 3: CAPILLARY SHIMMER    (High-frequency microscopic capillary wave ripples)
 * 4: QUANTUM VORTEX       (Rotational angular momentum & fluid swirl wake)
 * 5: ZEN RAIN DROPS       (Procedural ambient raindrops + fluid wake)
 */

export const simulationVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const simulationFragmentShader = /* glsl */ `
  uniform sampler2D uCurrentTexture;
  uniform sampler2D uPreviousTexture;
  uniform vec2 uTexelSize;
  uniform float uDamping;
  uniform float uWaveSpeed;
  uniform int uRippleMode;       // 0: Classic, 1: Harmonic Echo, 2: Viscous Mercury, 3: Capillary, 4: Vortex, 5: Zen Rain

  // Mouse Splat Uniforms
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform vec2 uVelocityVec;
  uniform float uSplatRadius;
  uniform float uSplatStrength;
  uniform float uIsInteracting;
  uniform float uTime;

  varying vec2 vUv;

  // Pseudo-random hash for procedural rain drops
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Distance from point p to segment [a, b]
  float distToSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float lenSq = dot(ba, ba);
    if (lenSq < 0.000001) {
      return length(pa);
    }
    float h = clamp(dot(pa, ba) / lenSq, 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    vec2 uv = vUv;
    vec2 dx = vec2(uTexelSize.x, 0.0);
    vec2 dy = vec2(0.0, uTexelSize.y);

    // Sample neighbors from current time step (t)
    float currentH = texture2D(uCurrentTexture, uv).r;
    float left     = texture2D(uCurrentTexture, uv - dx).r;
    float right    = texture2D(uCurrentTexture, uv + dx).r;
    float down     = texture2D(uCurrentTexture, uv - dy).r;
    float up       = texture2D(uCurrentTexture, uv + dy).r;

    // Diagonal samples for higher-order isotropic wave propagation
    float d1 = texture2D(uCurrentTexture, uv - dx - dy).r;
    float d2 = texture2D(uCurrentTexture, uv + dx - dy).r;
    float d3 = texture2D(uCurrentTexture, uv - dx + dy).r;
    float d4 = texture2D(uCurrentTexture, uv + dx + dy).r;

    // Sample previous time step (t - 1)
    float prevH    = texture2D(uPreviousTexture, uv).r;

    // High-order 9-point Laplacian stencil for silky circular waves without grid artifacts
    float laplacian = (left + right + down + up) * 0.20 + (d1 + d2 + d3 + d4) * 0.05 - currentH;
    
    // Physical parameters adapted by ripple mode
    float effectiveWaveSpeed = uWaveSpeed;
    float effectiveDamping = uDamping;

    if (uRippleMode == 1) {
      // Harmonic Echo: crisp acoustic speed
      effectiveWaveSpeed = 0.992;
      effectiveDamping = min(uDamping + 0.004, 0.994);
    } else if (uRippleMode == 2) {
      // Viscous Mercury: heavy damping, slower propagation
      effectiveWaveSpeed = 0.93;
      effectiveDamping = uDamping * 0.985;
    } else if (uRippleMode == 3) {
      // Capillary Shimmer: rapid micro-dispersion
      effectiveWaveSpeed = 1.02;
      effectiveDamping = min(uDamping + 0.002, 0.992);
    } else if (uRippleMode == 4) {
      // Vortex Swirl: buoyant fluid inertia
      effectiveWaveSpeed = 0.97;
    }

    // Wave equation step
    float newH = (currentH * 2.0 - prevH + laplacian * effectiveWaveSpeed) * effectiveDamping;

    // -------------------------------------------------------------
    // INTERACTIVE RIPPLE INJECTION MODES
    // -------------------------------------------------------------
    if (uIsInteracting > 0.01) {
      float d = distToSegment(uv, uPrevMouse, uMouse);
      vec2 delta = uv - uMouse;
      float angle = atan(delta.y, delta.x);

      if (uRippleMode == 0) {
        // 0: Classic Hydrodynamic (Smooth Cosine Bell)
        if (d < uSplatRadius) {
          float factor = 0.5 * (1.0 + cos(3.14159265 * (d / uSplatRadius)));
          newH += factor * uSplatStrength * uIsInteracting;
        }
      } else if (uRippleMode == 1) {
        // 1: Harmonic Echo Rings (Concentric Bessel Shockwave series)
        float echoRadius = uSplatRadius * 1.8;
        if (d < echoRadius) {
          float normD = d / echoRadius;
          float rings = cos(normD * 25.132) * exp(-normD * 3.5);
          newH += rings * uSplatStrength * 1.4 * uIsInteracting;
        }
      } else if (uRippleMode == 2) {
        // 2: Viscous Mercury (Deep heavy Gaussian with surface tension crown)
        float mercuryRadius = uSplatRadius * 1.35;
        if (d < mercuryRadius) {
          float normD = d / mercuryRadius;
          // Crater profile: deep dip in center with sharp surrounding splash rim
          float profile = (1.0 - 2.5 * normD * normD) * exp(-normD * normD * 3.0);
          newH += profile * uSplatStrength * 1.7 * uIsInteracting;
        }
      } else if (uRippleMode == 3) {
        // 3: Capillary Shimmer (High-frequency microscopic capillary ripples)
        float capRadius = uSplatRadius * 1.5;
        if (d < capRadius) {
          float normD = d / capRadius;
          float shimmer = sin(normD * 42.0 - uTime * 6.0) * (1.0 - normD);
          newH += shimmer * uSplatStrength * 0.9 * uIsInteracting;
        }
      } else if (uRippleMode == 4) {
        // 4: Quantum Vortex (Angular momentum spiral curl)
        float vortexRadius = uSplatRadius * 1.6;
        if (d < vortexRadius) {
          float normD = d / vortexRadius;
          float spiral = sin(angle * 3.0 - normD * 18.0 + uTime * 4.0) * exp(-normD * 2.8);
          float centerCore = exp(-normD * normD * 8.0) * 1.2;
          newH += (spiral * 0.7 + centerCore * 0.6) * uSplatStrength * 1.3 * uIsInteracting;
        }
      } else {
        // 5: Zen Rain (Smooth stroke + procedural ambient drops)
        if (d < uSplatRadius) {
          float factor = 0.5 * (1.0 + cos(3.14159265 * (d / uSplatRadius)));
          newH += factor * uSplatStrength * uIsInteracting;
        }
      }
    }

    // -------------------------------------------------------------
    // CONTINUOUS AMBIENT MODES
    // -------------------------------------------------------------
    if (uRippleMode == 5) {
      // Zen Continuous Procedural Rain Drops
      // Check 3 randomized droplet sites per time interval
      for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float dropTime = floor(uTime * 4.0 + fi * 1.333);
        vec2 dropPos = vec2(
          hash(vec2(dropTime, fi * 31.17)),
          hash(vec2(fi * 17.83, dropTime))
        );
        dropPos = 0.15 + dropPos * 0.70; // Keep within central 70%
        float dropAge = fract(uTime * 4.0 + fi * 1.333);
        
        if (dropAge < 0.12) {
          float dDrop = length(uv - dropPos);
          float rDrop = 0.028;
          if (dDrop < rDrop) {
            float dropShape = cos(dDrop / rDrop * 3.14159 * 0.5);
            newH += dropShape * 0.008 * (1.0 - dropAge / 0.12);
          }
        }
      }
    } else {
      // Subtle center harmonic breathing pulse
      float centerDist = length(uv - vec2(0.5, 0.5));
      float ambientWave = sin(centerDist * 40.0 - uTime * 2.0) * exp(-centerDist * 6.5) * 0.0005;
      newH += ambientWave;
    }

    gl_FragColor = vec4(newH, 0.0, 0.0, 1.0);
  }
`;
