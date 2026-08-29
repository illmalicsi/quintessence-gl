/**
 * Concept Profiles for the 5 Kinetic Fluid Surface Experiences:
 * 1. AETHERIS  — Luminiferous Celestial Medium (Platinum)
 * 2. VELOX     — Pure Kinetic Chronometry (Titanium & Split-Second Chrono)
 * 3. OPALINE   — Liquid Gemology & Guilloché (Mother-of-Pearl & Gold)
 * 4. THALASSA  — Deep Abyss & Bioluminescent Wake (Abyssal Marine)
 * 5. KINESIS   — Optical Synesthesia & Digital Art (Liquid Mercury)
 */

export interface ConceptDefinition {
  id: 'aetheris' | 'velox' | 'opaline' | 'thalassa' | 'kinesis';
  name: string;
  subHeader: string;
  tagline: string;
  hintText: string;
  themeClass: string;
  themeIndex: number; // For GLSL shader uniform uTheme
  specs: {
    calibre: string;
    case: string;
    shader: string;
    interaction: string;
    footerLeft: string;
    footerCenter: string;
    footerRight: string;
  };
  audioProfile: {
    type: 'celestial' | 'metallic' | 'warm-gold' | 'sonar' | 'synesthesia';
    baseScale: number[];
    decayTime: number;
    qFactor: number;
  };
  shaderParams: {
    iridescenceGain: number;
    velocitySensitivity: number;
    rippleStrength: number;
    viscosity: number;
    chromaticAberration: number;
    refractionStrength: number;
    normalStrength: number;
  };
  narrative: {
    title: string;
    tag: string;
    lead: string;
    description: string;
  };
}

export const CONCEPTS: Record<string, ConceptDefinition> = {
  aetheris: {
    id: 'aetheris',
    name: 'AETHERIS',
    subHeader: 'LUMINIFEROUS RESONANCE',
    tagline: 'Celestial Astrolabe Tourbillon',
    hintText: 'Sweep across the celestial vacuum to illuminate the photonic spectrum',
    themeClass: 'theme-aetheris',
    themeIndex: 0,
    specs: {
      calibre: 'Calibre IX Astrolabe Orbit',
      case: '950 Solid Platinum · 39.00mm',
      shader: '2D Wave PDE · Crystalline Thin-Film Fresnel',
      interaction: 'Velocity-Driven Photonic Dispersion',
      footerLeft: '60 FPS LUMINIFEROUS ENGINE',
      footerCenter: '950 PLATINUM · 39MM · CALIBRE IX',
      footerRight: 'CELESTIAL OBSERVATORY'
    },
    audioProfile: {
      type: 'celestial',
      baseScale: [528, 594, 660, 792, 880, 1056, 1188], // Solfeggio 528Hz celestial scale
      decayTime: 0.42,
      qFactor: 14
    },
    shaderParams: {
      iridescenceGain: 1.45,
      velocitySensitivity: 1.60,
      rippleStrength: 1.25,
      viscosity: 0.984,
      chromaticAberration: 0.038,
      refractionStrength: 0.042,
      normalStrength: 1.85
    },
    narrative: {
      title: 'THE AETHERIS EXPERIMENT',
      tag: 'CELESTIAL CHRONOMETRY // VACUUM PHYSICS',
      lead: '"In classical physics, the aether was the invisible medium through which light traveled. At rest, it is pure stillness and void. Only when perturbed by kinetic energy does it reveal the radiant photonic spectrum."',
      description: 'Aetheris explores the idea of a frictionless, crystalline vacuum surface. Monochromatic in its resting equilibrium, the surface refracts starlight caustics and celestial coordinates into delicate rainbow rings upon the slightest sweep of attention.'
    }
  },

  velox: {
    id: 'velox',
    name: 'VELOX',
    subHeader: 'KINETIC DOPPLER CHRONOMETRY',
    tagline: 'Split-Second Flyback Chronograph',
    hintText: 'Inertia is monochrome. Acceleration shifts light across the Doppler spectrum',
    themeClass: 'theme-velox',
    themeIndex: 1,
    specs: {
      calibre: 'Calibre 880 Flyback Chrono',
      case: 'Grade 5 Brushed Titanium · 40.50mm',
      shader: 'Doppler Velocity Vector Refraction',
      interaction: 'Instantaneous Acceleration Vectoring',
      footerLeft: 'KINETIC VELOCITY SENSOR',
      footerCenter: 'GRADE 5 TITANIUM · 40.5MM · CALIBRE 880',
      footerRight: 'HAUTE CHRONOMÉTRIE'
    },
    audioProfile: {
      type: 'metallic',
      baseScale: [440, 480, 550, 660, 733.33, 880, 960],
      decayTime: 0.22,
      qFactor: 18
    },
    shaderParams: {
      iridescenceGain: 1.80,
      velocitySensitivity: 2.10,
      rippleStrength: 1.50,
      viscosity: 0.975,
      chromaticAberration: 0.055,
      refractionStrength: 0.050,
      normalStrength: 2.10
    },
    narrative: {
      title: 'THE VELOX EXPERIMENT',
      tag: 'KINETIC AERODYNAMICS // DOPPLER OPTICS',
      lead: '"Inertia holds zero hue. Velocity is the only catalyst of color. Accelerate the pointer and light stretches across the Doppler spectrum; slow down and it snaps back to brushed titanium."',
      description: 'Velox represents high-speed Swiss chronometry. The dark liquid titanium surface generates directional chromatic streaks aligned directly with your acceleration vector, creating high-energy refractive wake trails.'
    }
  },

  opaline: {
    id: 'opaline',
    name: 'OPALINE',
    subHeader: 'HAUTE JOAILLERIE & GUILLOCHÉ',
    tagline: 'Hydrophane Opal & Grand Feu Enamel',
    hintText: 'Touch the surface to trigger microscopic optical diffraction waves',
    themeClass: 'theme-opaline',
    themeIndex: 2,
    specs: {
      calibre: 'Calibre 1080 Tourbillon Mystérieux',
      case: '18K Honey Gold & Mother of Pearl',
      shader: 'Diffraction Grating & Thin-Film Oil Interference',
      interaction: 'Micro-Diffraction Shear Waves',
      footerLeft: 'DIFFRACTION GRATING ENGINE',
      footerCenter: '18K HONEY GOLD · 38MM · CALIBRE 1080',
      footerRight: 'HAUTE JOAILLERIE'
    },
    audioProfile: {
      type: 'warm-gold',
      baseScale: [330, 392, 493.88, 587.33, 659.25, 783.99, 987.77],
      decayTime: 0.55,
      qFactor: 10
    },
    shaderParams: {
      iridescenceGain: 1.65,
      velocitySensitivity: 1.45,
      rippleStrength: 1.20,
      viscosity: 0.986,
      chromaticAberration: 0.040,
      refractionStrength: 0.045,
      normalStrength: 1.70
    },
    narrative: {
      title: 'THE OPALINE EXPERIMENT',
      tag: 'GEMOLOGICAL DIFFRACTION // PERPETUAL GUILLOCHÉ',
      lead: '"Precious hydrophane opal has no intrinsic pigment. Its fiery play-of-color emerges purely from micro-diffraction through orderly silica spheres as light angles shift."',
      description: 'Opaline fuses the lost art of guilloché rose engine engraving with liquid mother-of-pearl. The liquid gold and obsidian sheen melts under interaction into rich, undulating emerald, amber, and violet interference fringes.'
    }
  },

  thalassa: {
    id: 'thalassa',
    name: 'THALASSA',
    subHeader: 'ABYSSAL MARINE CHRONOMETRY',
    tagline: 'Perpetual Hydro-Dynamics · 1000M',
    hintText: 'Disturb the deep abyssal calm to ignite bioluminescent luminescence',
    themeClass: 'theme-thalassa',
    themeIndex: 3,
    specs: {
      calibre: 'Calibre 300 Deep Abyssal Rotor',
      case: 'Forged Carbon & Deep Sea Ceramic',
      shader: 'Abyssal Bioluminescence & Caustic Refraction',
      interaction: 'Hydrodynamic Wake Turbulence',
      footerLeft: '1000M HYDROSTATIC SENSOR',
      footerCenter: 'FORGED CARBON · 42MM · 1000M CALIBRE 300',
      footerRight: 'MARINE CHRONOMÉTRIE'
    },
    audioProfile: {
      type: 'sonar',
      baseScale: [220, 277.18, 329.63, 440, 554.37, 659.25, 880],
      decayTime: 0.60,
      qFactor: 8
    },
    shaderParams: {
      iridescenceGain: 2.20,
      velocitySensitivity: 1.80,
      rippleStrength: 1.40,
      viscosity: 0.980,
      chromaticAberration: 0.060,
      refractionStrength: 0.048,
      normalStrength: 2.00
    },
    narrative: {
      title: 'THE THALASSA EXPERIMENT',
      tag: 'DEEP ABYSS // BIOLUMINESCENT HYDRODYNAMICS',
      lead: '"Deep waters maintain total silence until the surface is broken. Turbulence sparks the dinoflagellate bioluminescence, creating glowing cyan, violet, and auroral wakes."',
      description: 'Thalassa plunges into deep-sea marine chronometry. The dark obsidian water appears pitch black at rest, but bursts into vivid electric neon wakes, cyan bioluminescence, and caustic underwater flares as you stir the depths.'
    }
  },

  kinesis: {
    id: 'kinesis',
    name: 'KINESIS',
    subHeader: 'OPTICAL SYNESTHESIA LAB',
    tagline: 'Digital Kinetic Sculpture · Phase 04',
    hintText: 'Move cursor to translate physical velocity directly into optical frequency',
    themeClass: 'theme-kinesis',
    themeIndex: 4,
    specs: {
      calibre: 'Phase 04 Synesthesia Core',
      case: 'Pure Liquid Mercury & Optical Quartz',
      shader: 'Full-Spectrum Laser Diffraction (380-750nm)',
      interaction: 'Velocity-to-Wavelength Phase Synthesis',
      footerLeft: 'SYNESTHESIA OPTICAL CORE',
      footerCenter: 'MERCURY QUARTZ · PHASE 04 · 380-750NM',
      footerRight: 'TOKYO ART LAB'
    },
    audioProfile: {
      type: 'synesthesia',
      baseScale: [432, 486, 540, 576, 648, 720, 864], // 432Hz harmonic synesthesia series
      decayTime: 0.38,
      qFactor: 16
    },
    shaderParams: {
      iridescenceGain: 1.70,
      velocitySensitivity: 1.90,
      rippleStrength: 1.30,
      viscosity: 0.985,
      chromaticAberration: 0.045,
      refractionStrength: 0.042,
      normalStrength: 1.90
    },
    narrative: {
      title: 'THE KINESIS EXPERIMENT',
      tag: 'KINETIC SCULPTURE // SENSORY SYNESTHESIA',
      lead: '"A surface that only becomes itself when touched. Color does not exist in the object; it is born from the velocity of observer attention."',
      description: 'Kinesis is a pure kinetic art installation. Stripping away conventional watch styling, it features pure concentric resonance geometry and real-time physical telemetry that maps pointer speed directly into razor-sharp optical laser dispersion.'
    }
  }
};
