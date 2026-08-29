/**
 * Fluid Simulation & Render Engine with Concept Switching
 */

import * as THREE from 'three';
import { simulationVertexShader, simulationFragmentShader } from '../shaders/waveSimulation';
import { renderVertexShader, renderFragmentShader } from '../shaders/renderShader';
import { CONCEPTS, type ConceptDefinition } from './concepts';
import { RIPPLE_MODES, type RippleModeDefinition } from './rippleModes';

export interface FluidConfig {
  conceptId: 'aetheris' | 'velox' | 'opaline' | 'thalassa' | 'kinesis';
  rippleModeId: 'classic' | 'harmonic' | 'mercury' | 'capillary' | 'vortex' | 'zen_rain';
  iridescenceGain: number;
  velocitySensitivity: number;
  rippleStrength: number;
  viscosity: number;
  chromaticAberration: number;
  refractionStrength: number;
  normalStrength: number;
  splatRadius: number;
}

export class FluidSimulationEngine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private sceneSim: THREE.Scene;
  private sceneRender: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  
  // Ping-Pong FBO Buffers for 2D Wave Simulation
  private targetCurrent: THREE.WebGLRenderTarget;
  private targetPrevious: THREE.WebGLRenderTarget;
  private targetNext: THREE.WebGLRenderTarget;
  private simMaterial: THREE.ShaderMaterial;
  private renderMaterial: THREE.ShaderMaterial;

  // Pointer & Velocity Tracking
  private mouse: THREE.Vector2 = new THREE.Vector2(0.5, 0.5);
  private prevMouse: THREE.Vector2 = new THREE.Vector2(0.5, 0.5);
  private velocityVec: THREE.Vector2 = new THREE.Vector2(0.0, 0.0);
  private smoothedVelocity: number = 0.0;
  private isInteracting: boolean = false;
  private lastMoveTimestamp: number = 0;

  // Config & State
  public currentConcept: ConceptDefinition;
  public currentRippleMode: RippleModeDefinition;
  public config: FluidConfig;
  private simSize: THREE.Vector2 = new THREE.Vector2(512, 512);
  private isRunning: boolean = true;
  private startTime: number = performance.now();

  // Callbacks
  public onVelocityUpdate?: (velocity: number, dispersionPercent: number) => void;

  constructor(
    canvas: HTMLCanvasElement, 
    initialConceptId: 'aetheris' | 'velox' | 'opaline' | 'thalassa' | 'kinesis' = 'aetheris',
    initialRippleModeId: 'classic' | 'harmonic' | 'mercury' | 'capillary' | 'vortex' | 'zen_rain' = 'classic'
  ) {
    this.canvas = canvas;
    this.currentConcept = CONCEPTS[initialConceptId] || CONCEPTS.aetheris;
    this.currentRippleMode = RIPPLE_MODES[initialRippleModeId] || RIPPLE_MODES.classic;
    
    this.config = {
      conceptId: this.currentConcept.id,
      rippleModeId: this.currentRippleMode.id,
      ...this.currentConcept.shaderParams,
      splatRadius: 0.045
    };

    // Initialize WebGL Renderer with High Precision
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Fullscreen Orthographic Camera
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Allocate Ping-Pong Float Render Targets
    const type = THREE.HalfFloatType;
    const rtParams: THREE.RenderTargetOptions = {
      type: type,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RedFormat,
      depthBuffer: false,
      stencilBuffer: false
    };

    this.updateSimSize();

    this.targetCurrent = new THREE.WebGLRenderTarget(this.simSize.x, this.simSize.y, rtParams);
    this.targetPrevious = new THREE.WebGLRenderTarget(this.simSize.x, this.simSize.y, rtParams);
    this.targetNext = new THREE.WebGLRenderTarget(this.simSize.x, this.simSize.y, rtParams);

    // 1. Simulation Scene
    this.sceneSim = new THREE.Scene();
    this.simMaterial = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
      uniforms: {
        uCurrentTexture: { value: this.targetCurrent.texture },
        uPreviousTexture: { value: this.targetPrevious.texture },
        uTexelSize: { value: new THREE.Vector2(1.0 / this.simSize.x, 1.0 / this.simSize.y) },
        uDamping: { value: this.config.viscosity },
        uWaveSpeed: { value: 0.98 },
        uRippleMode: { value: this.currentRippleMode.modeIndex },
        uMouse: { value: this.mouse },
        uPrevMouse: { value: this.prevMouse },
        uVelocityVec: { value: this.velocityVec },
        uSplatRadius: { value: this.config.splatRadius },
        uSplatStrength: { value: this.config.rippleStrength },
        uIsInteracting: { value: 0.0 },
        uTime: { value: 0.0 }
      },
      depthWrite: false,
      depthTest: false
    });
    const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial);
    this.sceneSim.add(simQuad);

    // 2. Render Scene
    this.sceneRender = new THREE.Scene();
    this.renderMaterial = new THREE.ShaderMaterial({
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      uniforms: {
        uSimulationTexture: { value: this.targetCurrent.texture },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouse: { value: this.mouse },
        uVelocityVec: { value: this.velocityVec },
        uVelocity: { value: 0.0 },
        uTime: { value: 0.0 },
        uTheme: { value: this.currentConcept.themeIndex },
        uIridescenceGain: { value: this.config.iridescenceGain },
        uChromaticAberration: { value: this.config.chromaticAberration },
        uRefractionStrength: { value: this.config.refractionStrength },
        uNormalStrength: { value: this.config.normalStrength }
      },
      depthWrite: false,
      depthTest: false
    });
    const renderQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.renderMaterial);
    this.sceneRender.add(renderQuad);

    this.setupEvents();
    window.addEventListener('resize', this.onResize.bind(this));
    this.animate();
  }

  private updateSimSize() {
    const aspect = window.innerWidth / window.innerHeight;
    const baseRes = 512;
    if (aspect >= 1.0) {
      this.simSize.set(Math.round(baseRes * aspect), baseRes);
    } else {
      this.simSize.set(baseRes, Math.round(baseRes / aspect));
    }
  }

  public setConcept(conceptId: 'aetheris' | 'velox' | 'opaline' | 'thalassa' | 'kinesis') {
    const concept = CONCEPTS[conceptId];
    if (!concept) return;

    this.currentConcept = concept;
    this.config.conceptId = concept.id;
    this.config.iridescenceGain = concept.shaderParams.iridescenceGain;
    this.config.velocitySensitivity = concept.shaderParams.velocitySensitivity;
    this.config.rippleStrength = concept.shaderParams.rippleStrength;
    this.config.viscosity = concept.shaderParams.viscosity;
    this.config.chromaticAberration = concept.shaderParams.chromaticAberration;
    this.config.refractionStrength = concept.shaderParams.refractionStrength;
    this.config.normalStrength = concept.shaderParams.normalStrength;

    document.body.className = concept.themeClass;
    this.renderMaterial.uniforms.uTheme.value = concept.themeIndex;
    this.updateUniforms();

    // Trigger gentle ripple transition
    this.splatAt(0.5, 0.5, 1.4);
  }

  public setRippleMode(modeId: 'classic' | 'harmonic' | 'mercury' | 'capillary' | 'vortex' | 'zen_rain') {
    const mode = RIPPLE_MODES[modeId];
    if (!mode) return;

    this.currentRippleMode = mode;
    this.config.rippleModeId = mode.id;
    this.simMaterial.uniforms.uRippleMode.value = mode.modeIndex;

    // Trigger feedback ripple splash
    this.splatAt(0.5, 0.5, 1.6);
  }

  private setupEvents() {
    const handlePointer = (clientX: number, clientY: number, active: boolean) => {
      const now = performance.now();
      const dt = Math.max((now - this.lastMoveTimestamp) / 1000, 0.001);
      this.lastMoveTimestamp = now;

      const normX = clientX / window.innerWidth;
      const normY = 1.0 - clientY / window.innerHeight;

      const dx = normX - this.mouse.x;
      const dy = normY - this.mouse.y;
      const dist = Math.hypot(dx, dy);
      const instantVelocity = Math.min((dist / dt) * 0.05, 2.5);

      this.velocityVec.set(dx, dy);
      this.prevMouse.copy(this.mouse);
      this.mouse.set(normX, normY);

      this.smoothedVelocity = THREE.MathUtils.lerp(
        this.smoothedVelocity,
        instantVelocity * this.config.velocitySensitivity,
        0.35
      );

      this.isInteracting = active || dist > 0.0005;
    };

    window.addEventListener('pointermove', (e) => {
      handlePointer(e.clientX, e.clientY, true);
    });

    window.addEventListener('pointerdown', (e) => {
      handlePointer(e.clientX, e.clientY, true);
      this.splatAt(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight, 1.8);
    });

    window.addEventListener('pointerup', () => {
      this.isInteracting = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });
  }

  public splatAt(x: number, y: number, multiplier: number = 1.0) {
    this.prevMouse.set(x, y);
    this.mouse.set(x, y);
    this.simMaterial.uniforms.uSplatStrength.value = this.config.rippleStrength * multiplier;
    this.isInteracting = true;
    this.smoothedVelocity = Math.max(this.smoothedVelocity, 0.8 * multiplier);
  }

  public triggerRainBurst() {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const rx = 0.2 + Math.random() * 0.6;
        const ry = 0.2 + Math.random() * 0.6;
        this.splatAt(rx, ry, 1.5 + Math.random() * 0.8);
      }, i * 120);
    }
  }

  public triggerVortex() {
    let angle = 0;
    const radius = 0.22;
    const interval = setInterval(() => {
      angle += 0.35;
      const x = 0.5 + Math.cos(angle) * radius * (1.0 - angle / 25.0);
      const y = 0.5 + Math.sin(angle) * radius * (1.0 - angle / 25.0);
      this.splatAt(x, y, 1.2);
      this.smoothedVelocity = Math.max(this.smoothedVelocity, 1.2);
      if (angle > 18.0) clearInterval(interval);
    }, 28);
  }

  public updateUniforms() {
    this.simMaterial.uniforms.uDamping.value = this.config.viscosity;
    this.simMaterial.uniforms.uSplatRadius.value = this.config.splatRadius;
    this.simMaterial.uniforms.uSplatStrength.value = this.config.rippleStrength;

    this.renderMaterial.uniforms.uIridescenceGain.value = this.config.iridescenceGain;
    this.renderMaterial.uniforms.uChromaticAberration.value = this.config.chromaticAberration;
    this.renderMaterial.uniforms.uRefractionStrength.value = this.config.refractionStrength;
    this.renderMaterial.uniforms.uNormalStrength.value = this.config.normalStrength;
  }

  private onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.renderMaterial.uniforms.uResolution.value.set(width, height);

    this.updateSimSize();
    this.targetCurrent.setSize(this.simSize.x, this.simSize.y);
    this.targetPrevious.setSize(this.simSize.x, this.simSize.y);
    this.targetNext.setSize(this.simSize.x, this.simSize.y);
    this.simMaterial.uniforms.uTexelSize.value.set(1.0 / this.simSize.x, 1.0 / this.simSize.y);
  }

  private animate = () => {
    if (!this.isRunning) return;
    requestAnimationFrame(this.animate);

    const elapsedTime = (performance.now() - this.startTime) * 0.001;

    this.smoothedVelocity *= 0.94;
    if (this.smoothedVelocity < 0.0005) {
      this.smoothedVelocity = 0.0;
      this.isInteracting = false;
    }

    if (this.onVelocityUpdate) {
      const dispersionPct = Math.min(Math.round(this.smoothedVelocity * this.config.iridescenceGain * 100), 100);
      this.onVelocityUpdate(this.smoothedVelocity, dispersionPct);
    }

    // Step 1: Wave Simulation Pass
    this.simMaterial.uniforms.uCurrentTexture.value = this.targetCurrent.texture;
    this.simMaterial.uniforms.uPreviousTexture.value = this.targetPrevious.texture;
    this.simMaterial.uniforms.uMouse.value.copy(this.mouse);
    this.simMaterial.uniforms.uPrevMouse.value.copy(this.prevMouse);
    this.simMaterial.uniforms.uIsInteracting.value = this.isInteracting ? 1.0 : 0.0;
    this.simMaterial.uniforms.uTime.value = elapsedTime;

    this.renderer.setRenderTarget(this.targetNext);
    this.renderer.render(this.sceneSim, this.camera);

    const temp = this.targetPrevious;
    this.targetPrevious = this.targetCurrent;
    this.targetCurrent = this.targetNext;
    this.targetNext = temp;

    // Step 2: Screen Render Pass
    this.renderer.setRenderTarget(null);
    this.renderMaterial.uniforms.uSimulationTexture.value = this.targetCurrent.texture;
    this.renderMaterial.uniforms.uMouse.value.copy(this.mouse);
    this.renderMaterial.uniforms.uVelocityVec.value.copy(this.velocityVec);
    this.renderMaterial.uniforms.uVelocity.value = this.smoothedVelocity;
    this.renderMaterial.uniforms.uTime.value = elapsedTime;

    this.renderer.render(this.sceneRender, this.camera);
  };

  public destroy() {
    this.isRunning = false;
    this.targetCurrent.dispose();
    this.targetPrevious.dispose();
    this.targetNext.dispose();
    this.simMaterial.dispose();
    this.renderMaterial.dispose();
    this.renderer.dispose();
  }
}
