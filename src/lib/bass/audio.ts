import { midiToFreq } from "@/lib/bass/theory";

type Win = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let wantMute = false;

export function setMuted(muted: boolean) {
  wantMute = muted;
  if (master) master.gain.value = muted ? 0 : 1;
}

export function getAudio() {
  if (typeof window === "undefined") {
    throw new Error("Audio is only available in the browser");
  }
  if (!ctx) {
    const AC = window.AudioContext ?? (window as Win).webkitAudioContext;
    if (!AC) throw new Error("This browser has no audio engine");
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = wantMute ? 0 : 1;
    master.connect(ctx.destination);
  }
  return ctx;
}

export async function resumeAudio() {
  const audio = getAudio();
  if (audio.state !== "running") await audio.resume();
  return audio;
}

function out() {
  getAudio();
  return master!;
}

export function playMidi(midi: number, when?: number, dur = 0.5) {
  const audio = getAudio();
  const t = when ?? audio.currentTime;
  const freq = midiToFreq(midi);
  const osc = audio.createOscillator();
  const body = audio.createOscillator();
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();
  const sawMix = audio.createGain();
  const sineMix = audio.createGain();

  osc.type = "sawtooth";
  body.type = "sine";
  osc.frequency.setValueAtTime(freq, t);
  body.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, freq * 0.985), t + 0.09);

  filter.type = "lowpass";
  filter.Q.value = 0.7;
  filter.frequency.setValueAtTime(Math.min(1600, freq * 9), t);
  filter.frequency.exponentialRampToValueAtTime(Math.max(140, freq * 2.2), t + dur);

  sawMix.gain.value = 0.28;
  sineMix.gain.value = 0.85;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.32, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(sawMix);
  body.connect(sineMix);
  sawMix.connect(filter);
  sineMix.connect(filter);
  filter.connect(gain);
  gain.connect(out());
  osc.start(t);
  body.start(t);
  osc.stop(t + dur + 0.03);
  body.stop(t + dur + 0.03);
}

function scheduleClick(audio: AudioContext, time: number, accent: boolean) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(accent ? 1680 : 1040, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.28 : 0.14, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);
  osc.connect(gain);
  gain.connect(out());
  osc.start(time);
  osc.stop(time + 0.05);
}

export class Metro {
  bpm = 80;
  beatsPerBar = 4;
  private timer = 0;
  private next = 0;
  private beat = 0;
  private running = false;
  private visuals: number[] = [];

  constructor(private onBeat: (beat: number) => void) {}

  start() {
    const audio = getAudio();
    this.stop();
    this.running = true;
    this.beat = 0;
    this.next = audio.currentTime + 0.06;
    this.loop();
  }

  stop() {
    this.running = false;
    window.clearTimeout(this.timer);
    for (const id of this.visuals) window.clearTimeout(id);
    this.visuals = [];
  }

  private loop = () => {
    if (!this.running) return;
    const audio = getAudio();
    const bar = Math.max(1, this.beatsPerBar);
    while (this.next < audio.currentTime + 0.25) {
      const beat = this.beat;
      const when = this.next;
      scheduleClick(audio, when, beat === 0);
      const delay = Math.max(0, (when - audio.currentTime) * 1000);
      this.visuals.push(window.setTimeout(() => this.onBeat(beat), delay));
      this.beat = (beat + 1) % bar;
      this.next += 60 / Math.max(30, this.bpm);
    }
    this.timer = window.setTimeout(this.loop, 40);
  };
}
