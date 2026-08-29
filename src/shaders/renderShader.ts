/**
 * Solaris / Multi-Concept Liquid Surface & Velocity-Driven Iridescence Render Shader
 * 
 * Supports 5 distinct visual worlds:
 * 0: AETHERIS  — Crystalline Platinum & Celestial Photonic Rainbow
 * 1: VELOX     — Brushed Titanium with Directional Doppler Streaking
 * 2: OPALINE   — Honey Gold & Mother-of-Pearl Multi-Order Interference
 * 3: THALASSA  — Abyssal Obsidian & Electric Bioluminescent Wakes
 * 4: KINESIS   — Pure Liquid Mercury & Laser Optical Dispersion (380-750nm)
 */

export const renderVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const renderFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uSimulationTexture;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uVelocityVec;
  uniform float uVelocity;
  uniform float uTime;
  
  // Customization Uniforms
  uniform int uTheme;                  // 0: Aetheris, 1: Velox, 2: Opaline, 3: Thalassa, 4: Kinesis
  uniform float uIridescenceGain;       // Intensity multiplier for spectral rainbow
  uniform float uChromaticAberration;   // Wavelength separation offset
  uniform float uRefractionStrength;    // Normal distortion index
  uniform float uNormalStrength;        // Normal steepness

  varying vec2 vUv;

  // Cosine-based spectral gradient (Airy / Newton Ring Dispersion)
  vec3 spectralPalette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.33, 0.67);
    return a + b * cos(6.2831853 * (c * t + d));
  }

  // Wavelength to RGB approximation for Kinesis laser dispersion
  vec3 wavelengthToRGB(float t) {
    // t in [0.0, 1.0] maps to ~380nm to ~750nm
    float r = clamp(sin((t - 0.25) * 3.14159) * 1.5, 0.0, 1.0);
    float g = clamp(sin((t - 0.55) * 3.14159) * 1.5, 0.0, 1.0);
    float b = clamp(sin((t - 0.85) * 3.14159) * 1.5, 0.0, 1.0);
    return vec3(r, g, b);
  }

  // Thin-film interference multi-order approximation
  vec3 thinFilmColor(float cosTheta, float filmThickness, float velocityPhase) {
    float delta = 2.0 * 1.33 * filmThickness * cosTheta + velocityPhase;
    vec3 lambda = vec3(650.0, 532.0, 450.0); // R, G, B wavelengths in nm
    vec3 phase = 2.0 * 3.14159265 * (delta * 1000.0) / lambda;
    return 0.5 + 0.5 * cos(phase);
  }

  // Simplex-style pseudo noise for organic micro-details
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Soft studio softbox reflection
  float studioSoftbox(vec3 r, vec3 lightDir, vec2 size) {
    float d = dot(r, lightDir);
    if (d < 0.0) return 0.0;
    vec3 proj = r - lightDir * d;
    float dist = length(proj);
    return smoothstep(size.y, size.x, dist) * pow(d, 4.0);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 texel = 1.0 / uResolution;

    // Sample height field with finite difference for surface normal
    float hC = texture2D(uSimulationTexture, uv).r;
    float hL = texture2D(uSimulationTexture, uv - vec2(texel.x, 0.0)).r;
    float hR = texture2D(uSimulationTexture, uv + vec2(texel.x, 0.0)).r;
    float hD = texture2D(uSimulationTexture, uv - vec2(0.0, texel.y)).r;
    float hU = texture2D(uSimulationTexture, uv + vec2(0.0, texel.y)).r;

    // Normal vector from finite differences
    float dx = (hR - hL) * uNormalStrength;
    float dy = (hU - hD) * uNormalStrength;
    
    // Add subtle procedural micro-perturbation for silky liquid texture
    float microNoise = (hash(uv * 400.0 + uTime * 0.05) - 0.5) * 0.008;
    vec3 N = normalize(vec3(-dx, -dy, 1.0 + microNoise));

    // View vector
    vec3 V = normalize(vec3((uv - 0.5) * aspect * 0.2, 1.0));
    vec3 R = reflect(-V, N);

    // Fresnel factor
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - NdotV, 4.0);

    // Dynamic Chromatic Dispersion offset
    float chromaDelta = uChromaticAberration * (1.0 + uVelocity * 3.5);
    vec2 refractOffset = N.xy * uRefractionStrength;
    
    // Sample chromatic aberration channels
    float hChromaR = texture2D(uSimulationTexture, uv + refractOffset * (1.0 + chromaDelta)).r;
    float hChromaG = texture2D(uSimulationTexture, uv + refractOffset).r;
    float hChromaB = texture2D(uSimulationTexture, uv + refractOffset * (1.0 - chromaDelta)).r;

    // Studio Environment Lighting
    vec3 keyLightDir = normalize(vec3(0.4, 0.8, 1.0));
    vec3 fillLightDir = normalize(vec3(-0.5, -0.3, 0.8));
    vec3 rimLightDir = normalize(vec3(0.0, 1.0, 0.2));

    // Blinn-Phong specular highlights
    vec3 H = normalize(keyLightDir + V);
    float specKey = pow(max(dot(N, H), 0.0), 52.0);
    float specFill = pow(max(dot(N, normalize(fillLightDir + V)), 0.0), 28.0);
    float specRim = pow(max(dot(N, normalize(rimLightDir + V)), 0.0), 18.0);

    // Studio softbox reflections
    float box1 = studioSoftbox(R, normalize(vec3(0.3, 0.6, 0.7)), vec2(0.05, 0.45));
    float box2 = studioSoftbox(R, normalize(vec3(-0.4, 0.3, 0.8)), vec2(0.1, 0.6));

    // Caustics & Curvature from Laplacian
    float laplacian = (hL + hR + hD + hU - 4.0 * hC);
    float caustic = clamp(laplacian * 14.0, -0.4, 0.9);

    // -------------------------------------------------------------
    // VELOCITY-INDUCED IRIDESCENCE ENGINE
    // -------------------------------------------------------------
    vec2 normVelDir = length(uVelocityVec) > 0.001 ? normalize(uVelocityVec) : vec2(0.0);
    float dirAlignment = dot(N.xy * 8.0, normVelDir);

    // Phase shift calculated from motion vector and surface slope
    float spectralPhase = dirAlignment * 1.8 
                        + hC * 16.0 
                        + uVelocity * 3.4 
                        + (uv.x * aspect.x + uv.y) * 1.4 
                        + uTime * 0.12;

    // The velocity gate: zero velocity = ZERO color
    float velocityActivation = smoothstep(0.002, 0.18, uVelocity);
    float iridescenceMask = velocityActivation * uIridescenceGain;
    float waveDistortion = length(N.xy) * 14.0;
    iridescenceMask *= clamp(0.35 + waveDistortion, 0.0, 2.2);

    // -------------------------------------------------------------
    // CONCEPT-SPECIFIC COLOR & SPECTRAL MODELS
    // -------------------------------------------------------------
    vec3 baseColor;
    vec3 specColor;
    vec3 shadowColor;
    vec3 activeIridescence;
    vec3 neutralSurface;
    vec3 coloredSurface;

    if (uTheme == 0) {
      // 1. AETHERIS — Crystalline Platinum & Celestial Prisms
      baseColor   = vec3(0.965, 0.968, 0.978);
      specColor   = vec3(1.0, 1.0, 1.0);
      shadowColor = vec3(0.82, 0.84, 0.88);

      vec3 rainbowCosine = spectralPalette(spectralPhase);
      vec3 rainbowFilm = thinFilmColor(NdotV, 0.45 + hC * 0.5, spectralPhase * 0.8);
      activeIridescence = mix(rainbowCosine, rainbowFilm, 0.5);

      float diffuse = 0.5 + 0.5 * dot(N, keyLightDir);
      neutralSurface = mix(shadowColor, baseColor, diffuse);
      neutralSurface += caustic * 0.35;
      neutralSurface += specKey * specColor * 0.70;
      neutralSurface += specFill * 0.25;
      neutralSurface += box1 * 0.25 + box2 * 0.15;
      neutralSurface -= (1.0 - NdotV) * 0.08;

      coloredSurface = neutralSurface * (vec3(0.7) + activeIridescence * 0.65) + activeIridescence * 0.30;
      coloredSurface += specKey * activeIridescence * 0.8;

    } else if (uTheme == 1) {
      // 2. VELOX — Brushed Titanium & Doppler Shockwave Streaks
      baseColor   = vec3(0.065, 0.070, 0.085);
      specColor   = vec3(0.92, 0.95, 1.0);
      shadowColor = vec3(0.015, 0.018, 0.025);

      // Doppler shift emphasizes forward red/infrared vs trailing blue/UV
      float dopplerFactor = fract(spectralPhase * 1.5 + dirAlignment * 2.5);
      vec3 dopplerColor = spectralPalette(dopplerFactor);
      activeIridescence = dopplerColor * 1.4;

      float diffuse = max(dot(N, keyLightDir), 0.0);
      neutralSurface = mix(shadowColor, baseColor, diffuse * 0.8 + 0.2);
      neutralSurface += caustic * vec3(0.18, 0.22, 0.30);
      neutralSurface += specKey * specColor * 1.3;
      neutralSurface += specFill * specColor * 0.45;
      neutralSurface += (box1 + box2) * specColor * 0.5;
      neutralSurface += fresnel * specColor * 0.5;

      coloredSurface = neutralSurface + activeIridescence * (0.9 + specKey * 1.8);

    } else if (uTheme == 2) {
      // 3. OPALINE — 18K Honey Gold & Mother of Pearl Guilloché
      baseColor   = vec3(0.86, 0.70, 0.38);
      specColor   = vec3(1.0, 0.94, 0.78);
      shadowColor = vec3(0.38, 0.26, 0.10);

      // Rich oil-slick / opal play-of-color with emerald and violet undertones
      vec3 opalColor = vec3(
        0.5 + 0.5 * cos(6.283 * (spectralPhase + 0.1)),
        0.5 + 0.5 * cos(6.283 * (spectralPhase * 1.2 + 0.4)),
        0.5 + 0.5 * cos(6.283 * (spectralPhase * 0.9 + 0.8))
      );
      activeIridescence = opalColor * 1.3;

      float diffuse = max(dot(N, keyLightDir), 0.0);
      neutralSurface = mix(shadowColor, baseColor, diffuse * 0.85 + 0.15);
      neutralSurface += caustic * vec3(0.55, 0.40, 0.15);
      neutralSurface += specKey * specColor * 1.2;
      neutralSurface += specFill * specColor * 0.4;
      neutralSurface += (box1 + box2) * specColor * 0.6;
      neutralSurface += fresnel * specColor * 0.4;

      coloredSurface = mix(neutralSurface, activeIridescence * baseColor * 2.4 + specKey * specColor, 0.75);

    } else if (uTheme == 3) {
      // 4. THALASSA — Abyssal Obsidian & Electric Bioluminescent Wakes
      baseColor   = vec3(0.02, 0.03, 0.05);
      specColor   = vec3(0.3, 0.8, 1.0);
      shadowColor = vec3(0.005, 0.008, 0.015);

      // Radiant electric cyan, magenta, and auroral green bioluminescence
      vec3 biolum = vec3(
        0.2 + 0.8 * pow(clamp(sin(spectralPhase * 2.0), 0.0, 1.0), 2.0),
        0.7 + 0.3 * sin(spectralPhase * 1.5 + 1.0),
        0.9 + 0.1 * cos(spectralPhase)
      );
      activeIridescence = biolum * 1.6;

      float diffuse = max(dot(N, keyLightDir), 0.0);
      neutralSurface = mix(shadowColor, baseColor, diffuse * 0.7 + 0.3);
      neutralSurface += caustic * vec3(0.05, 0.15, 0.25);
      neutralSurface += specKey * vec3(0.6, 0.8, 1.0) * 1.1;
      neutralSurface += fresnel * vec3(0.1, 0.3, 0.6) * 0.6;

      coloredSurface = neutralSurface + activeIridescence * (1.1 + caustic * 1.5 + specKey * 2.0);

    } else {
      // 5. KINESIS — Liquid Mercury & Laser Optical Dispersion (380-750nm)
      baseColor   = vec3(0.75, 0.76, 0.78);
      specColor   = vec3(1.0, 1.0, 1.0);
      shadowColor = vec3(0.20, 0.22, 0.25);

      float waveParam = fract(spectralPhase * 0.6);
      vec3 laserSpectrum = wavelengthToRGB(waveParam);
      activeIridescence = laserSpectrum * 1.5;

      float diffuse = 0.4 + 0.6 * dot(N, keyLightDir);
      neutralSurface = mix(shadowColor, baseColor, diffuse);
      neutralSurface += caustic * 0.4;
      neutralSurface += specKey * specColor * 1.4;
      neutralSurface += (box1 + box2) * specColor * 0.7;
      neutralSurface += fresnel * specColor * 0.6;

      coloredSurface = mix(neutralSurface, activeIridescence * 1.2 + specKey * specColor, 0.85);
    }

    // Final color strictly gated by pointer velocity iridescence mask
    vec3 finalColor = mix(neutralSurface, coloredSurface, clamp(iridescenceMask, 0.0, 1.0));

    // Subtle film grain for ultra-high-end physical feel
    float grain = (hash(uv * 1200.0 + fract(uTime)) - 0.5) * 0.018;
    finalColor += grain;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
