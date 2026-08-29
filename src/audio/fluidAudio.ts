/**
 * Concept-Aware Fluid Acoustics Web Audio Synthesizer
 * Adapts sound synthesis to match each concept's unique physical personality:
 * - AETHERIS: Celestial Solfeggio glass/crystal resonance
 * - VELOX: High-speed titanium chronograph ping
 * - OPALINE: Warm golden bell chime & harmonic decay
 * - THALASSA: Subaquatic low-pass sonar pulse & deep droplet
 * - KINESIS: Pure 432Hz synesthesia harmonic sine series
 */

import { CONCEPTS, type ConceptDefinition } from '../engine/concepts';
import { RIPPLE_MODES, type RippleModeDefinition } from '../engine/rippleModes';

export class FluidAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private lastPlayTime: number = 0;
  private masterGain: GainNode | null = null;
  private currentConcept: ConceptDefinition = CONCEPTS.aetheris;
  private currentRippleMode: RippleModeDefinition = RIPPLE_MODES.classic;

  constructor() {}

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setConcept(concept: ConceptDefinition) {
    this.currentConcept = concept;
  }

  public setRippleMode(mode: RippleModeDefinition) {
    this.currentRippleMode = mode;
  }

  public toggleMute(): boolean {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime, 0.05);
    }
    return !this.isMuted;
  }

  public getSoundState(): boolean {
    return !this.isMuted;
  }

  /**
   * Plays a concept-tuned fluid harmonic resonance
   * @param velocity Pointer velocity magnitude
   * @param x Normalized X position (affects pitch and stereo pan)
   */
  public triggerDroplet(velocity: number, x: number = 0.5) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const throttleTime = this.currentConcept.audioProfile.type === 'metallic' ? 0.05 : 0.08;
    if (now - this.lastPlayTime < throttleTime) return;
    this.lastPlayTime = now;

    try {
      const { baseScale, decayTime: baseDecay, qFactor: baseQ, type } = this.currentConcept.audioProfile;
      const { harmonicMultiplier, decayMultiplier, resonanceMultiplier } = this.currentRippleMode.audioModulation;

      const decayTime = baseDecay * decayMultiplier;
      const qFactor = baseQ * resonanceMultiplier;

      const noteIdx = Math.floor(Math.min(x, 0.99) * baseScale.length);
      const targetFreq = (baseScale[noteIdx] || 440) * harmonicMultiplier;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      if (type === 'sonar') {
        // Subaquatic sonar pulse
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(targetFreq * 0.75, now);
        osc.frequency.exponentialRampToValueAtTime(targetFreq * 0.5, now + decayTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(targetFreq * 1.5, now);
      } else if (type === 'metallic') {
        // Crisp high-frequency titanium click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(targetFreq * 2.2, now);
        osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.04);
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(600, now);
      } else if (type === 'warm-gold') {
        // Warm golden bell harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(targetFreq * 1.25, now);
        osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.08);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(targetFreq, now);
      } else {
        // Celestial & Synesthesia pure sine chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(targetFreq * 1.5, now);
        osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.06);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(targetFreq * 1.2, now);
      }

      filter.Q.setValueAtTime(qFactor, now);

      // Amplitude envelope
      const initialGain = Math.min(Math.max(velocity * 0.45, 0.02), 0.20);
      gain.gain.setValueAtTime(initialGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      if (panner) {
        panner.pan.setValueAtTime((x - 0.5) * 1.5, now);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);
      } else {
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
      }

      osc.start(now);
      osc.stop(now + decayTime + 0.05);
    } catch {
      // Audio context autoplay guard
    }
  }
}
