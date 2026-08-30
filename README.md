# QUINTESSENCE
### *Kinetic Fluid & Optical Dispersion Laboratory*

> *"A surface that only becomes itself when touched. Monochromatic in repose; chromatic in response to kinetic attention."*

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL2-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![GLSL](https://img.shields.io/badge/GLSL-Custom_Shaders-5586A4?style=flat-square&logo=opengl&logoColor=white)](https://www.khronos.org/opengl/)
[![License](https://img.shields.io/badge/License-Noncommercial_1.0-orange?style=flat-square)](LICENSE)

---

## Overview

**QUINTESSENCE** is an interactive WebGL / GLSL fluid simulation exploring the intersection of kinetic optical physics and Swiss Haute Horlogerie aesthetics.

The liquid surface sits still and neutral at rest—chrome-dark, platinum-white, or molten gold—without static color. As you move the pointer across the surface, **iridescence appears in direct proportion to pointer velocity**. The faster the movement, the further the optical path difference shifts across the spectral hue spectrum (Airy & Newton ring thin-film interference). Slow the cursor, and the colors settle back into pure monochromatic liquid metal.

---

## 5 Kinetic Material Worlds

| Key | Concept | Narrative & Material Philosophy | Centerpiece Motif |
| :---: | :--- | :--- | :--- |
| **`1`** | **AETHERIS** | **The Luminiferous Medium**: Crystalline 950 Solid Platinum vacuum that reveals ethereal photonic rainbows upon perturbation. | Celestial Astrolabe & Orbital Tourbillon |
| **`2`** | **VELOX** | **Kinetic Doppler Chronometry**: Grade 5 Brushed Titanium generating Doppler-shifted directional shockwave streaks. | Split-Second Flyback Chronograph (400 km/h) |
| **`3`** | **OPALINE** | **Liquid Gemology & Guilloché**: 18K Honey Gold & Mother-of-Pearl rippling with multi-order oil-slick diffraction. | Perpetual Guilloché Rosette (*Flinqué*) |
| **`4`** | **THALASSA** | **Abyssal Marine Engineering**: Obsidian deep-sea water erupting into vivid electric cyan and aurora bioluminescence. | 1000M Hydrostatic Depth Ring & Compass Rose |
| **`5`** | **KINESIS** | **Sensory Synesthesia Engine**: Pure Liquid Mercury mirror translating pointer speed directly into razor-sharp laser spectrum (380–750nm). | Concentric Harmonic Resonance Rings |

---

## 6 Fluid Wave Propagation Dynamics

Switchable via the bottom dock or key **`R`**:

1. **`01 HYDRO` (Hydrodynamic Fluid)**: Smooth continuous 2D wave PDE simulation with natural viscous damping and Snell refraction.
2. **`02 ECHO` (Harmonic Echo Rings)**: Concentric multi-ring Bessel acoustic shockwaves ($\cos(k \cdot d) \cdot e^{-d/\sigma}$) emitted per stroke.
3. **`03 MERCURY` (Viscous Mercury)**: Heavy liquid metal with high surface tension, deep displacement splash craters, and rapid viscous damping.
4. **`04 SHIMMER` (Capillary Shimmer)**: High-frequency microscopic capillary waves ($\sin(42 \cdot d)$) creating glittering prismatic caustics.
5. **`05 VORTEX` (Quantum Vortex)**: Rotational fluid wakes with angular momentum and curl vorticity around the pointer motion vector.
6. **`06 RAIN` (Ambient Zen Rain)**: Gentle procedural raindrops continuously falling across the canvas with randomized phase.

---

## Technical Architecture

### 1. 2D Wave PDE (GPU Ping-Pong FBO)
The wave equation is integrated discretely on the GPU across ping-pong framebuffers:
$$\frac{\partial^2 h}{\partial t^2} = c^2 \nabla^2 h - \gamma \frac{\partial h}{\partial t}$$
- High-order 9-point Laplacian stencil eliminates grid anisotropy.
- Continuous line-segment splatting prevents dot artifacts during fast sweeps.

### 2. Velocity-Driven Spectral Dispersion (GLSL)
- Instantaneous pointer velocity vector $(\Delta x / \Delta t, \Delta y / \Delta t)$ is tracked on every animation frame.
- Thin-film optical path difference formula:
$$\text{OPD} = 2 n_{\text{film}} d \cos(\theta_t) + \vec{N} \cdot \vec{v}_{\text{norm}} \times \text{gain} + \text{phase}(t)$$
- Chromatic aberration offsets separate R, G, B refractive wavelengths proportionally to cursor acceleration.

### 3. Procedural Fluid Acoustics (Web Audio API)
- Zero external audio files.
- Synthesizes organic liquid droplet harmonics, Solfeggio 528Hz celestial glass tones, and resonant titanium pings tuned to each concept's physical profile.

---

## Keyboard Shortcuts

| Key | Action |
| :---: | :--- |
| **`1` – `5`** | Switch Concept World (*Aetheris*, *Velox*, *Opaline*, *Thalassa*, *Kinesis*) |
| **`R`** | Cycle through the 6 Ripple Dynamics (*Hydro*, *Echo*, *Mercury*, *Shimmer*, *Vortex*, *Rain*) |
| **`Space`** | Trigger Rain Burst impulse wave |
| **`S`** | Toggle Fluid Acoustics (Sound on/off) |
| **`C`** | Open / Close Surface Configurator Drawer |
| **`M`** | Open / Close Concept Manifesto Exhibition |
| **`Esc`** | Close all drawers and modals |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/quintessence.git

# Navigate to project directory
cd quintessence

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be running at `http://localhost:5173/`.

### Build for Production

```bash
npm run build
```

The optimized production bundle will be generated in the `dist/` directory.

---

## License

**PolyForm Noncommercial License 1.0.0** © 2026 Ivan Louie.

- **Permitted**: You are free to view, fork, run, modify, study, and create personal/educational non-commercial projects.
- **Restricted**: Commercial use, monetized distribution, or integration into paid products/services is strictly prohibited.

See [`LICENSE`](LICENSE) for complete terms.
