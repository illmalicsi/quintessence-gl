/**
 * Ripple Mode Definitions & Physics Profiles
 */

export interface RippleModeDefinition {
  id: 'classic' | 'harmonic' | 'mercury' | 'capillary' | 'vortex' | 'zen_rain';
  name: string;
  shortLabel: string;
  code: string;
  modeIndex: number; // For GLSL uRippleMode uniform
  description: string;
  audioModulation: {
    harmonicMultiplier: number;
    decayMultiplier: number;
    resonanceMultiplier: number;
  };
}

export const RIPPLE_MODES: Record<string, RippleModeDefinition> = {
  classic: {
    id: 'classic',
    name: 'Hydrodynamic Fluid',
    shortLabel: 'HYDRO',
    code: '01',
    modeIndex: 0,
    description: 'Smooth natural water wave PDE with continuous line-segment splatting and Snell refraction.',
    audioModulation: {
      harmonicMultiplier: 1.0,
      decayMultiplier: 1.0,
      resonanceMultiplier: 1.0
    }
  },
  harmonic: {
    id: 'harmonic',
    name: 'Harmonic Echo Rings',
    shortLabel: 'ECHO',
    code: '02',
    modeIndex: 1,
    description: 'Concentric Bessel shockwave series emitting multi-ring acoustic interference on every stroke.',
    audioModulation: {
      harmonicMultiplier: 1.5,
      decayMultiplier: 1.35,
      resonanceMultiplier: 1.8
    }
  },
  mercury: {
    id: 'mercury',
    name: 'Viscous Mercury',
    shortLabel: 'MERCURY',
    code: '03',
    modeIndex: 2,
    description: 'Heavy liquid metal with high surface tension, deep splash craters, and rapid viscous damping.',
    audioModulation: {
      harmonicMultiplier: 0.65,
      decayMultiplier: 0.75,
      resonanceMultiplier: 1.4
    }
  },
  capillary: {
    id: 'capillary',
    name: 'Capillary Shimmer',
    shortLabel: 'SHIMMER',
    code: '04',
    modeIndex: 3,
    description: 'Ultra-dense high-frequency micro-ripples creating dazzling prismatic reflections and caustics.',
    audioModulation: {
      harmonicMultiplier: 2.0,
      decayMultiplier: 0.6,
      resonanceMultiplier: 2.2
    }
  },
  vortex: {
    id: 'vortex',
    name: 'Quantum Vortex',
    shortLabel: 'VORTEX',
    code: '05',
    modeIndex: 4,
    description: 'Rotational fluid wakes with angular momentum creating swirling spiral vortices and caustics.',
    audioModulation: {
      harmonicMultiplier: 1.2,
      decayMultiplier: 1.5,
      resonanceMultiplier: 1.2
    }
  },
  zen_rain: {
    id: 'zen_rain',
    name: 'Ambient Zen Rain',
    shortLabel: 'RAIN',
    code: '06',
    modeIndex: 5,
    description: 'Calming procedural raindrops continuously falling across the canvas with randomized phase.',
    audioModulation: {
      harmonicMultiplier: 1.1,
      decayMultiplier: 1.1,
      resonanceMultiplier: 1.3
    }
  }
};
