import './style.css';
import { FluidSimulationEngine } from './engine/fluidSimulation';
import { FluidAudioEngine } from './audio/fluidAudio';
import { CONCEPTS, type ConceptDefinition } from './engine/concepts';
import { RIPPLE_MODES, type RippleModeDefinition } from './engine/rippleModes';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  // Initialize Engines with Default Concept (Aetheris) and Ripple Mode (Classic)
  const fluidEngine = new FluidSimulationEngine(canvas, 'aetheris', 'classic');
  const audioEngine = new FluidAudioEngine();
  audioEngine.setConcept(CONCEPTS.aetheris);
  audioEngine.setRippleMode(RIPPLE_MODES.classic);

  // DOM Elements - Typography & Centerpiece
  const brandTag = document.getElementById('brand-tag') as HTMLElement;
  const brandSubHeader = document.getElementById('brand-sub-header') as HTMLElement;
  const brandMainTitle = document.getElementById('brand-main-title') as HTMLElement;
  const brandTagline = document.getElementById('brand-tagline') as HTMLElement;
  const brandHintText = document.getElementById('brand-hint-text') as HTMLElement;

  // Footer Elements
  const footerLeftText = document.getElementById('footer-left-text') as HTMLElement;
  const footerCenterText = document.getElementById('footer-center-text') as HTMLElement;
  const footerRightText = document.getElementById('footer-right-text') as HTMLElement;

  // Drawer Info Elements
  const drawerInfoTitle = document.getElementById('drawer-info-title') as HTMLElement;
  const drawerInfoDesc = document.getElementById('drawer-info-desc') as HTMLElement;

  // Modal Elements
  const modalConceptTag = document.getElementById('modal-concept-tag') as HTMLElement;
  const modalConceptTitle = document.getElementById('modal-concept-title') as HTMLElement;
  const modalConceptLead = document.getElementById('modal-concept-lead') as HTMLElement;
  const modalSpecCalibre = document.getElementById('modal-spec-calibre') as HTMLElement;
  const modalSpecCase = document.getElementById('modal-spec-case') as HTMLElement;

  // Buttons & Controls
  const soundBtn = document.getElementById('sound-btn') as HTMLButtonElement;
  const controlsBtn = document.getElementById('controls-btn') as HTMLButtonElement;
  const portfolioBtn = document.getElementById('portfolio-btn') as HTMLButtonElement;
  const controlsDrawer = document.getElementById('controls-drawer') as HTMLElement;
  const closeDrawerBtn = document.getElementById('close-drawer-btn') as HTMLButtonElement;
  const portfolioModal = document.getElementById('portfolio-modal') as HTMLElement;
  const closeModalBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;

  // Concept Tab & Option Selectors
  const conceptTabs = document.querySelectorAll('.concept-tab');
  const drawerThemeOptions = document.querySelectorAll('.theme-option');
  const modalConceptCards = document.querySelectorAll('.concept-card');
  const dialSvgs = document.querySelectorAll('.dial-svg');

  // Ripple Mode Selectors
  const rippleTabs = document.querySelectorAll('.ripple-tab');
  const rippleDrawerOptions = document.querySelectorAll('.ripple-mode-option');
  const hudRippleLabel = document.getElementById('hud-ripple-label') as HTMLElement;

  // HUD Meters
  const velocityBar = document.getElementById('velocity-bar') as HTMLElement;
  const velocityVal = document.getElementById('velocity-val') as HTMLElement;
  const dispersionBar = document.getElementById('dispersion-bar') as HTMLElement;
  const dispersionVal = document.getElementById('dispersion-val') as HTMLElement;

  // Sliders
  const sliderIridescence = document.getElementById('slider-iridescence') as HTMLInputElement;
  const valIridescence = document.getElementById('val-iridescence') as HTMLElement;
  const sliderVelocitySens = document.getElementById('slider-velocity-sens') as HTMLInputElement;
  const valVelocitySens = document.getElementById('val-velocity-sens') as HTMLElement;
  const sliderRippleStrength = document.getElementById('slider-ripple-strength') as HTMLInputElement;
  const valRippleStrength = document.getElementById('val-ripple-strength') as HTMLElement;
  const sliderViscosity = document.getElementById('slider-viscosity') as HTMLInputElement;
  const valViscosity = document.getElementById('val-viscosity') as HTMLElement;
  const sliderChromatic = document.getElementById('slider-chromatic') as HTMLInputElement;
  const valChromatic = document.getElementById('val-chromatic') as HTMLElement;
  const sliderRefraction = document.getElementById('slider-refraction') as HTMLInputElement;
  const valRefraction = document.getElementById('val-refraction') as HTMLElement;

  // Actions
  const btnDrop = document.getElementById('btn-trigger-drop') as HTMLButtonElement;
  const btnVortex = document.getElementById('btn-trigger-vortex') as HTMLButtonElement;
  const btnReset = document.getElementById('btn-reset') as HTMLButtonElement;

  // -------------------------------------------------------------
  // CONCEPT SWITCHER HANDLER
  // -------------------------------------------------------------
  const switchConcept = (conceptId: 'aetheris' | 'velox' | 'opaline' | 'thalassa' | 'kinesis') => {
    const concept: ConceptDefinition = CONCEPTS[conceptId];
    if (!concept) return;

    // 1. Update Fluid Simulation & Audio
    fluidEngine.setConcept(conceptId);
    audioEngine.setConcept(concept);

    // 2. Update Typography
    if (brandTag) brandTag.textContent = `EXPERIMENT 0${concept.themeIndex + 1} // ${concept.name}`;
    if (brandSubHeader) brandSubHeader.textContent = concept.subHeader;
    if (brandMainTitle) brandMainTitle.textContent = concept.name;
    if (brandTagline) brandTagline.textContent = concept.tagline;
    if (brandHintText) brandHintText.textContent = concept.hintText;

    // 3. Update Footer
    if (footerLeftText) footerLeftText.innerHTML = `<span class="pulse-indicator"></span> ${concept.specs.footerLeft}`;
    if (footerCenterText) footerCenterText.textContent = concept.specs.footerCenter;
    if (footerRightText) footerRightText.textContent = concept.specs.footerRight;

    // 4. Update Drawer Card
    if (drawerInfoTitle) drawerInfoTitle.textContent = `ABOUT ${concept.name}`;
    if (drawerInfoDesc) drawerInfoDesc.textContent = concept.narrative.description;

    // 5. Update Modal Details
    if (modalConceptTag) modalConceptTag.textContent = concept.narrative.tag;
    if (modalConceptTitle) modalConceptTitle.textContent = concept.narrative.title;
    if (modalConceptLead) modalConceptLead.textContent = concept.narrative.lead;
    if (modalSpecCalibre) modalSpecCalibre.textContent = concept.specs.calibre;
    if (modalSpecCase) modalSpecCase.textContent = concept.specs.case;

    // 6. Cross-fade Active SVG Dial
    dialSvgs.forEach(svg => {
      if (svg.id === `dial-${conceptId}`) {
        svg.classList.add('active');
      } else {
        svg.classList.remove('active');
      }
    });

    // 7. Update Active State on Tabs
    conceptTabs.forEach(tab => {
      if (tab.getAttribute('data-concept') === conceptId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // 8. Update Active State in Drawer
    drawerThemeOptions.forEach(opt => {
      if (opt.getAttribute('data-concept') === conceptId) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // 9. Update Active State on Modal Cards
    modalConceptCards.forEach(card => {
      if (card.getAttribute('data-concept') === conceptId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // 10. Sync Slider UI Controls
    syncSlidersToConfig();

    // Trigger acoustic feedback tone
    audioEngine.triggerDroplet(0.8, 0.5);
  };

  // -------------------------------------------------------------
  // RIPPLE MODE SWITCHER HANDLER
  // -------------------------------------------------------------
  const rippleModeList: Array<'classic' | 'harmonic' | 'mercury' | 'capillary' | 'vortex' | 'zen_rain'> = [
    'classic', 'harmonic', 'mercury', 'capillary', 'vortex', 'zen_rain'
  ];

  const switchRippleMode = (modeId: 'classic' | 'harmonic' | 'mercury' | 'capillary' | 'vortex' | 'zen_rain') => {
    const mode: RippleModeDefinition = RIPPLE_MODES[modeId];
    if (!mode) return;

    fluidEngine.setRippleMode(modeId);
    audioEngine.setRippleMode(mode);

    // Update HUD
    if (hudRippleLabel) hudRippleLabel.textContent = mode.shortLabel;

    // Update Dock Tabs
    rippleTabs.forEach(tab => {
      if (tab.getAttribute('data-ripple') === modeId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Drawer Options
    rippleDrawerOptions.forEach(opt => {
      if (opt.getAttribute('data-ripple') === modeId) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    audioEngine.triggerDroplet(0.9, 0.5);
  };

  const syncSlidersToConfig = () => {
    const cfg = fluidEngine.config;
    if (sliderIridescence) sliderIridescence.value = cfg.iridescenceGain.toString();
    if (valIridescence) valIridescence.textContent = cfg.iridescenceGain.toFixed(2);

    if (sliderVelocitySens) sliderVelocitySens.value = cfg.velocitySensitivity.toString();
    if (valVelocitySens) valVelocitySens.textContent = cfg.velocitySensitivity.toFixed(2);

    if (sliderRippleStrength) sliderRippleStrength.value = cfg.rippleStrength.toString();
    if (valRippleStrength) valRippleStrength.textContent = cfg.rippleStrength.toFixed(2);

    if (sliderViscosity) sliderViscosity.value = cfg.viscosity.toString();
    if (valViscosity) valViscosity.textContent = cfg.viscosity.toFixed(3);

    if (sliderChromatic) sliderChromatic.value = cfg.chromaticAberration.toString();
    if (valChromatic) valChromatic.textContent = cfg.chromaticAberration.toFixed(3);

    if (sliderRefraction) sliderRefraction.value = cfg.refractionStrength.toString();
    if (valRefraction) valRefraction.textContent = cfg.refractionStrength.toFixed(3);
  };

  // -------------------------------------------------------------
  // EVENT BINDINGS
  // -------------------------------------------------------------

  // Top Concept Tabs
  conceptTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-concept') as 'aetheris' | 'velox' | 'opaline' | 'thalassa' | 'kinesis';
      if (id) switchConcept(id);
    });
  });

  // Ripple Dock Tabs
  rippleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-ripple') as 'classic' | 'harmonic' | 'mercury' | 'capillary' | 'vortex' | 'zen_rain';
      if (id) switchRippleMode(id);
    });
  });

  // Drawer Ripple Options
  rippleDrawerOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const id = opt.getAttribute('data-ripple') as 'classic' | 'harmonic' | 'mercury' | 'capillary' | 'vortex' | 'zen_rain';
      if (id) switchRippleMode(id);
    });
  });

  // Drawer Concept Options
  drawerThemeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const id = opt.getAttribute('data-concept') as 'aetheris' | 'velox' | 'opaline' | 'thalassa' | 'kinesis';
      if (id) switchConcept(id);
    });
  });

  // Modal Cards
  modalConceptCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-concept') as 'aetheris' | 'velox' | 'opaline' | 'thalassa' | 'kinesis';
      if (id) {
        switchConcept(id);
        portfolioModal.classList.remove('open');
      }
    });
  });

  // Audio Control
  soundBtn?.addEventListener('click', () => {
    const isUnmuted = audioEngine.toggleMute();
    const dot = soundBtn.querySelector('.sound-dot');
    const label = soundBtn.querySelector('.btn-label');
    if (dot) {
      if (isUnmuted) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    }
    if (label) label.textContent = isUnmuted ? 'ACOUSTICS ON' : 'ACOUSTICS';
    soundBtn.style.opacity = isUnmuted ? '1.0' : '0.75';
  });

  // Sweep Acoustic Chimes
  window.addEventListener('pointermove', (e) => {
    const x = e.clientX / window.innerWidth;
    audioEngine.triggerDroplet(0.4, x);
  });

  // Drawer & Modal Toggles
  controlsBtn?.addEventListener('click', () => {
    controlsDrawer?.classList.toggle('open');
  });

  closeDrawerBtn?.addEventListener('click', () => {
    controlsDrawer?.classList.remove('open');
  });

  portfolioBtn?.addEventListener('click', () => {
    portfolioModal?.classList.add('open');
  });

  closeModalBtn?.addEventListener('click', () => {
    portfolioModal?.classList.remove('open');
  });

  portfolioModal?.addEventListener('click', (e) => {
    if (e.target === portfolioModal) {
      portfolioModal.classList.remove('open');
    }
  });

  // Slider Inputs
  sliderIridescence?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    fluidEngine.config.iridescenceGain = val;
    if (valIridescence) valIridescence.textContent = val.toFixed(2);
    fluidEngine.updateUniforms();
  });

  sliderVelocitySens?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    fluidEngine.config.velocitySensitivity = val;
    if (valVelocitySens) valVelocitySens.textContent = val.toFixed(2);
    fluidEngine.updateUniforms();
  });

  sliderRippleStrength?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    fluidEngine.config.rippleStrength = val;
    if (valRippleStrength) valRippleStrength.textContent = val.toFixed(2);
    fluidEngine.updateUniforms();
  });

  sliderViscosity?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    fluidEngine.config.viscosity = val;
    if (valViscosity) valViscosity.textContent = val.toFixed(3);
    fluidEngine.updateUniforms();
  });

  sliderChromatic?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    fluidEngine.config.chromaticAberration = val;
    if (valChromatic) valChromatic.textContent = val.toFixed(3);
    fluidEngine.updateUniforms();
  });

  sliderRefraction?.addEventListener('input', (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    fluidEngine.config.refractionStrength = val;
    if (valRefraction) valRefraction.textContent = val.toFixed(3);
    fluidEngine.updateUniforms();
  });

  // Preset Buttons
  btnDrop?.addEventListener('click', () => {
    fluidEngine.triggerRainBurst();
    audioEngine.triggerDroplet(1.0, 0.5);
  });

  btnVortex?.addEventListener('click', () => {
    fluidEngine.triggerVortex();
    audioEngine.triggerDroplet(1.2, 0.5);
  });

  btnReset?.addEventListener('click', () => {
    const curr = fluidEngine.currentConcept.id;
    fluidEngine.setConcept(curr);
    syncSlidersToConfig();
  });

  // Keyboard Shortcuts (1-5 for Concepts, R for Ripple Mode, Space for Rain, S for Sound, C for Controls, M for Modal)
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement) return;

    if (e.key === '1') switchConcept('aetheris');
    if (e.key === '2') switchConcept('velox');
    if (e.key === '3') switchConcept('opaline');
    if (e.key === '4') switchConcept('thalassa');
    if (e.key === '5') switchConcept('kinesis');

    // Cycle through ripple modes with 'R'
    if (e.key.toLowerCase() === 'r') {
      const currIdx = rippleModeList.indexOf(fluidEngine.currentRippleMode.id as any);
      const nextIdx = (currIdx + 1) % rippleModeList.length;
      switchRippleMode(rippleModeList[nextIdx]);
    }

    if (e.code === 'Space') {
      e.preventDefault();
      fluidEngine.triggerRainBurst();
      audioEngine.triggerDroplet(1.0, 0.5);
    }
    if (e.key.toLowerCase() === 's') {
      soundBtn.click();
    }
    if (e.key.toLowerCase() === 'c') {
      controlsDrawer.classList.toggle('open');
    }
    if (e.key.toLowerCase() === 'm') {
      portfolioModal.classList.toggle('open');
    }
    if (e.key === 'Escape') {
      controlsDrawer.classList.remove('open');
      portfolioModal.classList.remove('open');
    }
  });

  // Real-time Velocity & Dispersion HUD
  fluidEngine.onVelocityUpdate = (velocity, dispersionPct) => {
    const pct = Math.min(Math.round((velocity / 1.5) * 100), 100);
    if (velocityBar) velocityBar.style.width = `${pct}%`;
    if (velocityVal) velocityVal.textContent = velocity.toFixed(2);

    if (dispersionBar) dispersionBar.style.width = `${dispersionPct}%`;
    if (dispersionVal) dispersionVal.textContent = `${dispersionPct}%`;
  };
});
