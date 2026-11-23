export const STRING_LABELS = ["E", "A", "D", "G"] as const;
/** MIDI note numbers for open strings, low E to G. */
export const OPEN_MIDI = [28, 33, 38, 43] as const;
export const OPEN_FREQ = [41.203, 55, 73.416, 97.999] as const;

const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export function midiToFreq(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function midiToName(midi: number) {
  const index = ((midi % 12) + 12) % 12;
  return NAMES[index] ?? "C";
}

export function freqToMidi(freq: number) {
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

export function fretMidi(stringIndex: number, fret: number) {
  return OPEN_MIDI[stringIndex]! + fret;
}

export function describeFret(stringIndex: number, fret: number) {
  const name = midiToName(fretMidi(stringIndex, fret));
  const stringName = STRING_LABELS[stringIndex] ?? "E";
  const where = fret === 0 ? "open" : `fret ${fret}`;
  return {
    name,
    stringName,
    where,
    label: `${name} · ${stringName} string · ${where}`,
  };
}

export function centsBetween(freq: number, target: number) {
  return 1200 * Math.log2(freq / target);
}

export const GAUGES = ["3px", "2px", "1.5px", "1px"];
