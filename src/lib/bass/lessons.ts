export type Experience = "new" | "some" | "stuck";

export type Step = {
  rest: boolean;
  beats: number;
  string?: number;
  fret?: number;
};

export type Lesson = {
  id: string;
  stage: string;
  title: string;
  minutes: number;
  summary: string;
  paragraphs: { heading: string; body: string[] }[];
  tryThis: string;
  pattern?: { bpm: number; note: string; steps: Step[] };
  tool?: { mode: "tune" | "drill" | "click"; label: string; bpm?: number };
  tag?: string;
  setlist?: boolean;
};

export const STAGES = [
  {
    id: "setup",
    index: "01",
    title: "The instrument",
    blurb: "Hold it, name the strings, make a clean note.",
  },
  {
    id: "notes",
    index: "02",
    title: "The neck",
    blurb: "Find notes without guessing.",
  },
  {
    id: "time",
    index: "03",
    title: "Time",
    blurb: "The click is the other half of the band.",
  },
  {
    id: "grooves",
    index: "04",
    title: "Grooves",
    blurb: "Parts you can actually play under a song.",
  },
  {
    id: "shapes",
    index: "05",
    title: "Shapes",
    blurb: "Scales as shapes you can move, not theory homework.",
  },
  {
    id: "chords",
    index: "06",
    title: "Chords",
    blurb: "Major, minor, and the power chord under rock and metal.",
  },
  {
    id: "scales",
    index: "07",
    title: "Scales",
    blurb: "The minor sounds riffs are actually built from.",
  },
  {
    id: "metal",
    index: "08",
    title: "Rock and metal",
    blurb: "Chugs, gallops, and a low note that doesn't leave.",
  },
  {
    id: "songs",
    index: "09",
    title: "Songs",
    blurb: "Original parts. Rock first, heavier ones after the metal hand.",
  },
  {
    id: "heavy",
    index: "10",
    title: "Heavy metal",
    blurb: "Tone, a pick, three fingers, triplets, then the heavy riffs.",
  },
  {
    id: "forward",
    index: "11",
    title: "Keep going",
    blurb: "A way to practice after the lessons run out.",
  },
] as const;

const note = (string: number, fret: number, beats = 1): Step => ({
  rest: false,
  string,
  fret,
  beats,
});
const rest = (beats = 1): Step => ({ rest: true, beats });

export const LESSONS: Lesson[] = [
  {
    id: "hold",
    stage: "setup",
    title: "Hold it so the hands are free",
    minutes: 4,
    summary: "The strap holds the bass. Your hands make the notes.",
    paragraphs: [
      {
        heading: "Posture",
        body: [
          "Set the strap so the body of the bass sits against your torso, around your waist, neck tilted slightly up. If you sit, let your right thigh take the lower bout (swap that if you play left-handed). The neck is not a handle.",
          "Your fretting hand should be able to let go without the bass diving. If a shoulder burns after a minute, lengthen the strap one notch and try again.",
        ],
      },
    ],
    tryThis:
      "Stand for one minute with both hands off the neck. The bass stays put. Then bring the fretting hand back without grabbing.",
  },
  {
    id: "strings",
    stage: "setup",
    title: "Four strings, low to high",
    minutes: 4,
    summary: "Thick to thin: E, A, D, G. Say it until you don't look.",
    paragraphs: [
      {
        heading: "The order",
        body: [
          "Look down at the bass. The thickest string, closest to your face, is E. Then A, D, and the thinnest, G. E is the lowest note on a four-string bass.",
          "Left-handed players: the thick string is still E. Fret numbers always count from the nut, the same way this app draws them.",
        ],
      },
    ],
    tryThis: "Pluck each open string slowly and say its name out loud. Five passes: E, A, D, G.",
    pattern: {
      bpm: 72,
      note: "Open strings, low to high. Say the name with each one.",
      steps: [note(0, 0), note(1, 0), note(2, 0), note(3, 0)],
    },
  },
  {
    id: "fretting",
    stage: "setup",
    title: "Press behind the fret",
    minutes: 5,
    summary: "Thumb behind the neck. Fingers curved. Just behind the wire.",
    paragraphs: [
      {
        heading: "The fretting hand",
        body: [
          "Thumb sits on the back of the neck, roughly opposite your index and middle fingers. Fingers curve. You press just behind the metal fret, not on top of it and not in the middle of the wood. Closer to the fret means less pressure.",
          "In the first position, give each fret a finger: index on 1, middle on 2, ring on 3, pinky on 4. You will break this later. Learn it first.",
        ],
      },
    ],
    tryThis:
      "On the E string, fret 1 with the index, 2 with the middle, 3 with the ring, 4 with the pinky. One clear note each. If it buzzes, move a hair closer to the fret before you squeeze harder.",
  },
  {
    id: "plucking",
    stage: "setup",
    title: "Index, middle, even",
    minutes: 5,
    summary: "Alternate fingers. Land on the next string. Keep the volume even.",
    paragraphs: [
      {
        heading: "The plucking hand",
        body: [
          "This path uses fingers. A pick is allowed if you already play that way — the timing work is the same — but fingers make muting easier to feel. Rest your thumb on the pickup, or on the E string when you play the higher ones.",
          "Alternate index and middle. Pull across the string and come to rest on the next one. That rest stroke keeps notes short and even. The goal is the same volume every time, not speed.",
        ],
      },
    ],
    tryThis: "Open A, eight notes, alternating fingers. If one note jumps out, you rushed that finger. Slow down until they match.",
  },
  {
    id: "tune",
    stage: "setup",
    title: "Get in tune before you judge yourself",
    minutes: 5,
    summary: "Standard tuning is E A D G. Match the reference, then check again.",
    paragraphs: [
      {
        heading: "Tuning",
        body: [
          "An out-of-tune bass makes correct fingers sound wrong. Tune every session. Use Practice, then Tune. Play the reference tone and match the string. When you can, tune up to the pitch rather than drooping down onto it.",
          "New strings drift. Play for a few minutes, then tune again. The mic tuner needs permission. If you deny it, the reference tones still work — match them by ear.",
        ],
      },
    ],
    tryThis: "Tune all four strings. Play them low to high. The stack should sound calm, not sour.",
    tool: { mode: "tune", label: "Open the tuner" },
  },
  {
    id: "opens",
    stage: "notes",
    title: "Open strings are already music",
    minutes: 5,
    summary: "A lot of useful bass is open E and open A, played on time.",
    paragraphs: [
      {
        heading: "Home base",
        body: [
          "An open string is a fret with no finger. E and A, the two lowest, carry more songs than people admit. You do not need a scale to start sounding like a bass player. You need those notes in time, and silence around them.",
        ],
      },
    ],
    tryThis:
      "Count 1 2 3 4 out loud. Play open E for four beats, rest for four, open A for four, rest for four. The rests are part of the part.",
    pattern: {
      bpm: 70,
      note: "E, rest, A, rest. Each block is four beats.",
      steps: [note(0, 0, 4), rest(4), note(1, 0, 4), rest(4)],
    },
  },
  {
    id: "first-frets",
    stage: "notes",
    title: "The first five frets",
    minutes: 6,
    summary: "On the E string: E, F, F#, G, G#, A. Fret 5 matches the next open string.",
    paragraphs: [
      {
        heading: "A map, not a guess",
        body: [
          "Low E string, frets 0 through 5: E, F, F#, G, G#, A. The natural notes in that stretch are E, F, G, A. Fret 3 is G. Fret 5 is A — the same pitch as the open A string, not an octave. Same note, two places.",
          "This repeats. Fret 5 on any string is the next open string: A-string fret 5 is D, D-string fret 5 is G, G-string fret 5 is C. That is the skeleton of the neck.",
        ],
      },
    ],
    tryThis: "Play E-string frets 0, 3, and 5. Say E, G, A. Then check fret 5 against the open A string. They should match.",
    pattern: {
      bpm: 76,
      note: "E, G, A on the low string, then the open A that matches fret 5.",
      steps: [note(0, 0), note(0, 3), note(0, 5), note(1, 0, 2)],
    },
  },
  {
    id: "roots",
    stage: "notes",
    title: "Roots, and the octave shape",
    minutes: 7,
    summary: "If the chord is A, you play A. Learn a few homes for E, A, D, and G.",
    paragraphs: [
      {
        heading: "Where they live",
        body: [
          "A root is the note a chord is named after. If a guitar plays A, an A from you will fit. Homes worth memorizing: A is the open A string, E-string fret 5, and D-string fret 7. E is the open E string, A-string fret 7, and D-string fret 2. D is the open D string and A-string fret 5. G is the open G string, D-string fret 5, and E-string fret 3.",
          "Octave shape: from a note on the E or A string, the same note an octave up is two strings higher and two frets up. Open A, then G-string fret 2, is that shape. You do not need the whole neck today. You need this.",
        ],
      },
    ],
    tryThis:
      "Find A three ways: open A, E-string fret 5, D-string fret 7. Play them slowly. Two are the same pitch. The last one is an octave higher.",
    pattern: {
      bpm: 72,
      note: "Three homes for A. The third sits an octave up.",
      steps: [note(1, 0, 2), note(0, 5, 2), note(2, 7, 2)],
    },
  },
  {
    id: "clean",
    stage: "notes",
    title: "Clean notes, quiet strings",
    minutes: 5,
    summary: "Buzz is a position problem more often than a strength problem.",
    paragraphs: [
      {
        heading: "What 'clean' means",
        body: [
          "A buzz usually means you are too far from the fret, too light, or another finger is grazing the string. Mute the strings you are not playing with the side of the fretting hand and with unused plucking fingers. A clean note is not heroic. It just doesn't rattle.",
        ],
      },
    ],
    tryThis:
      "Play A-string fret 3 (that's C) five times, stopping between each. Fix the finger that buzzed. Do not play faster to hide it.",
    pattern: {
      bpm: 60,
      note: "C, five times, with space between.",
      steps: [note(1, 3), rest(1), note(1, 3), rest(1), note(1, 3), rest(1), note(1, 3), rest(1), note(1, 3)],
    },
  },
  {
    id: "names",
    stage: "notes",
    title: "Say the note, then play it",
    minutes: 6,
    summary: "The neck stops being a guess when the name comes first.",
    paragraphs: [
      {
        heading: "Naming",
        body: [
          "Before you press, say the note you want. Then find it. Wrong answers are the lesson — the drill will tell you what you actually played.",
          "Any fingering of the right note counts. Open G and E-string fret 3 are both G.",
        ],
      },
    ],
    tryThis: "Open Find the note and get five in a row. Start slow. Turn note names off so you can't cheat off the neck.",
    tool: { mode: "drill", label: "Find the note" },
  },
  {
    id: "counting",
    stage: "time",
    title: "Count out loud",
    minutes: 4,
    summary: "If you can't say the count, you can't play it yet. That's allowed.",
    paragraphs: [
      {
        heading: "Time first",
        body: [
          "Bass is a time instrument that happens to have pitch. Say '1 2 3 4' evenly before you play anything musical. Your foot can tap all four, or just 1 and 3.",
        ],
      },
    ],
    tryThis: "Two bars of counting, no bass. Then open E only on beat 1 of each bar. The other beats stay empty on purpose.",
  },
  {
    id: "quarters",
    stage: "time",
    title: "Quarter notes and rests",
    minutes: 5,
    summary: "A quarter note is one beat. A rest is a beat you meant to leave empty.",
    paragraphs: [
      {
        heading: "One note, one beat",
        body: [
          "In 4/4, four quarter notes fill a bar. Silence is not a mistake unless you missed a note you meant to play. Most bass parts are mostly silence.",
        ],
      },
    ],
    tryThis:
      "Bar 1: open E on every beat. Bar 2: open E on 1 and 3 only. Count the whole time, including the empty beats.",
    pattern: {
      bpm: 70,
      note: "Four notes, then two notes with rests.",
      steps: [note(0, 0), note(0, 0), note(0, 0), note(0, 0), note(0, 0), rest(1), note(0, 0), rest(1)],
    },
  },
  {
    id: "eighths",
    stage: "time",
    title: "Eighth notes — the ands",
    minutes: 5,
    summary: "Split the beat: 1-and 2-and 3-and 4-and.",
    paragraphs: [
      {
        heading: "Offbeats",
        body: [
          "Each beat splits in two. The number is the downbeat. The 'and' is the offbeat. Eighth notes are the engine under a lot of rock and pop. Evenness matters more than how fast you can say it.",
        ],
      },
    ],
    tryThis:
      "Say the ands for two bars. Then pluck open A on every number and every and. If you rush, the ands will crowd the next number. Slow the count.",
    pattern: {
      bpm: 76,
      note: "Eight even notes. One bar.",
      steps: Array.from({ length: 8 }, () => note(1, 0, 0.5)),
    },
  },
  {
    id: "click",
    stage: "time",
    title: "Meet the click",
    minutes: 5,
    summary: "A metronome is a patient drummer. Start at 60.",
    paragraphs: [
      {
        heading: "Sixty",
        body: [
          "60 BPM is one click a second. It feels slow, which is why people skip it, which is why they rush later. Clap with it for a minute before the bass comes out of the stand.",
        ],
      },
    ],
    tryThis: "Set the click to 60. Clap two bars. Then play open strings only on the clicks, one note each.",
    tool: { mode: "click", label: "Open the click at 60", bpm: 60 },
  },
  {
    id: "lock",
    stage: "time",
    title: "In the pocket",
    minutes: 6,
    summary: "Not ahead of the click, not chasing it. With it.",
    paragraphs: [
      {
        heading: "Where the note sits",
        body: [
          "Rushing feels like energy. It reads as nervous. Dragging feels relaxed and sounds late. The pocket is the note landing with the click. Empty beats are how you hear whether you were early: the next click arrives and you weren't already there waiting.",
        ],
      },
    ],
    tryThis: "70 BPM. Roots on beats 1 and 3 only. Leave 2 and 4 empty. Listen for the click landing in the silence.",
    tool: { mode: "click", label: "Set the click to 70", bpm: 70 },
  },
  {
    id: "ones",
    stage: "grooves",
    title: "Roots on beat 1",
    minutes: 8,
    summary: "The most useful bass part: the root, on 1, then get out of the way.",
    paragraphs: [
      {
        heading: "A song shape",
        body: [
          "Four bars of A, four of D, four of A, four of E. Play only the root on beat 1. A is open A. D is open D. E is open E. That is a whole song shape.",
          "Hear it below plays the order as one note per bar so you can memorize A, D, A, E. When you practice, keep each of those notes on beat 1 and let the rest of the bar stay quiet, at 80 BPM.",
        ],
      },
    ],
    tryThis: "Loop A D A E, one note per bar, on beat 1 only, at 80. Say the chord name as you play it.",
    pattern: {
      bpm: 80,
      note: "The form, one note per bar: A, D, A, E.",
      steps: [note(1, 0, 4), note(2, 0, 4), note(1, 0, 4), note(0, 0, 4)],
    },
    tool: { mode: "click", label: "Click at 80", bpm: 80 },
  },
  {
    id: "root-five",
    stage: "grooves",
    title: "Root and fifth",
    minutes: 8,
    summary: "The fifth is the note that holds the root up. You still don't need a scale.",
    paragraphs: [
      {
        heading: "The workhorse",
        body: [
          "From A, the fifth is E. From D, the fifth is A. From E, the fifth is B. Play the root on beat 1 and the fifth on beat 3.",
          "Easy fingerings: A then open E. D then open A. E then A-string fret 2, which is B. Same string, seven frets up, is the fifth too — A-string fret 7 is the E above open A — but the open-string versions are enough today.",
        ],
      },
    ],
    tryThis: "Two bars each of A, D, and E. Root on 1, fifth on 3, beats 2 and 4 empty. 76 BPM.",
    pattern: {
      bpm: 76,
      note: "A and its fifth, then D and its fifth, then E and its fifth.",
      steps: [
        note(1, 0),
        rest(1),
        note(0, 0),
        rest(1),
        note(2, 0),
        rest(1),
        note(1, 0),
        rest(1),
        note(0, 0),
        rest(1),
        note(1, 2),
        rest(1),
      ],
    },
  },
  {
    id: "blues",
    stage: "grooves",
    title: "A 12-bar blues",
    minutes: 8,
    summary: "Twelve bars. Three chords. The form is the song.",
    paragraphs: [
      {
        heading: "The map",
        body: [
          "In A: bars 1–4 are A, bars 5–6 are D, bars 7–8 are A, bar 9 is E, bar 10 is D, bar 11 is A, bar 12 is E, then back to A. This is the basic form, without the 'quick change' to D in bar 2.",
          "Hear it plays one note per beat so you can memorize the order. When you practice, each of those letters is a whole bar at 72. Root on beat 1. When that feels boring and steady, add the fifth on beat 3.",
        ],
      },
    ],
    tryThis: "One chorus at 72, roots only, on beat 1. Then a second chorus with the fifth on beat 3. Don't speed up in bar 9.",
    pattern: {
      bpm: 96,
      note: "The form, compressed to one note per beat: A A A A D D A A E D A E.",
      steps: [
        note(1, 0),
        note(1, 0),
        note(1, 0),
        note(1, 0),
        note(2, 0),
        note(2, 0),
        note(1, 0),
        note(1, 0),
        note(0, 0),
        note(2, 0),
        note(1, 0),
        note(0, 0),
      ],
    },
  },
  {
    id: "rock",
    stage: "grooves",
    title: "Straight eighths",
    minutes: 7,
    summary: "One note, every eighth. The skill is evenness.",
    paragraphs: [
      {
        heading: "The motor",
        body: [
          "A lot of rock bass is the root played on every eighth note: 1-and 2-and 3-and 4-and. It sounds simple and exposes a rushing right hand immediately. Accent beat 1 by playing it a little louder, not by arriving early.",
        ],
      },
    ],
    tryThis: "Open E, straight eighths, 76 BPM, two bars. Alternate fingers. Record it if you can and listen once. Fix the note that stuck out.",
    pattern: {
      bpm: 76,
      note: "One bar of eighths on E.",
      steps: Array.from({ length: 8 }, () => note(0, 0, 0.5)),
    },
    tool: { mode: "click", label: "Click at 76", bpm: 76 },
  },
  {
    id: "reggae",
    stage: "grooves",
    title: "Leave the downbeat alone",
    minutes: 7,
    summary: "A practice version of a one-drop feel: the note is late on purpose.",
    paragraphs: [
      {
        heading: "Space is the groove",
        body: [
          "In a one-drop feel, beat 1 is often empty and the drummer's kick sits with the snare on beat 3. This is a reduction, not a full arrangement. The point is waiting.",
          "At 70 BPM, in A: do not play on 1. Play a short open A on beat 3. Rest through 4. Do the same on D when you move. Short means you stop the string before the next beat.",
        ],
      },
    ],
    tryThis: "Four bars of A, note only on beat 3. Then four bars of D, same rule. If you play on 1, stop and count the empty downbeat out loud.",
    pattern: {
      bpm: 70,
      note: "Empty downbeat, A on beat 3. Two bars.",
      steps: [rest(2), note(1, 0), rest(1), rest(2), note(1, 0), rest(1)],
    },
  },
  {
    id: "funk",
    stage: "grooves",
    title: "Short notes and an octave",
    minutes: 8,
    summary: "Low A, then the A an octave up. Leave holes.",
    paragraphs: [
      {
        heading: "The octave",
        body: [
          "From open A, the octave is G-string fret 2. Same shape as before: two strings up, two frets up. Funk lives in short notes. Stop each one instead of letting it ring into the next.",
          "At 80: beat 1 low A, beat 2 empty, the 'and' of 2 is the high A, beat 3 low A, beat 4 empty. Ghost notes — a muted tick from a finger that isn't pressing — can wait. The octave and the holes are the part.",
        ],
      },
    ],
    tryThis: "Loop the bar at 80 until the high A is as short as the low one. Then move the same shape to open E: octave is D-string fret 2.",
    pattern: {
      bpm: 80,
      note: "Low A, space, high A, low A, space.",
      steps: [note(1, 0), rest(0.5), note(3, 2, 0.5), note(1, 0), rest(1)],
    },
  },
  {
    id: "major",
    stage: "shapes",
    title: "A major scale, one octave",
    minutes: 8,
    summary: "A B C# D E F# G# A. Learn the frets, then notice the spacing.",
    paragraphs: [
      {
        heading: "Open position",
        body: [
          "A major is A, B, C#, D, E, F#, G#, A. On the neck: A-string frets 0, 2, 4 (A, B, C#), then D-string frets 0, 2, 4, 6, 7 (D, E, F#, G#, A). D-string fret 6 is G#. Fret 7 is the A an octave up.",
          "Fingers: open, index on 2, ring on 4. On the D string, the same idea, then a small shift so the pinky can reach 6 and you step to 7. Say the names. The sharp notes are the ones people skip — don't.",
        ],
      },
    ],
    tryThis: "Up the scale and back down, at talking speed. No click until you can say every name. Then try 70 BPM, one note per beat.",
    pattern: {
      bpm: 70,
      note: "A major, up.",
      steps: [note(1, 0), note(1, 2), note(1, 4), note(2, 0), note(2, 2), note(2, 4), note(2, 6), note(2, 7, 2)],
    },
  },
  {
    id: "pentatonic",
    stage: "shapes",
    title: "Minor pentatonic, the box",
    minutes: 8,
    summary: "Five notes. A shape you can park on a root and trust.",
    paragraphs: [
      {
        heading: "A minor pentatonic",
        body: [
          "The notes are A, C, D, E, G. An easy open-position version: open A, A-string fret 3 (C), open D, D-string fret 2 (E), open G, and D-string fret 7 for the octave A.",
          "The movable box, rooted on the E string: index at the root, then fret+3 on that string; on the next three strings, the root fret and two frets up. For A, the root is E-string fret 5. So: E string 5 and 8, A string 5 and 7, D string 5 and 7, G string 5 and 7. Park the index. Don't stretch the shape.",
        ],
      },
    ],
    tryThis: "Play the box at E-string fret 5, ascending, one note per beat at 72. Name A when you hit either A (E-string 5, and D-string 7).",
    pattern: {
      bpm: 72,
      note: "The A minor pentatonic box from fret 5.",
      steps: [note(0, 5), note(0, 8), note(1, 5), note(1, 7), note(2, 5), note(2, 7), note(3, 5), note(3, 7)],
    },
  },
  {
    id: "blues-scale",
    stage: "shapes",
    title: "The blue note",
    minutes: 6,
    summary: "Minor pentatonic plus one tense note. Visit it. Don't sit on it.",
    paragraphs: [
      {
        heading: "Flat five",
        body: [
          "The A blues scale is the minor pentatonic plus Eb (the same pitch as D#). Between D and E on the D string, fret 1 is that note. It wants to move. If you hold it, the band feels stuck. If you pass through it, the line sounds like blues.",
        ],
      },
    ],
    tryThis:
      "Play open D, D-string fret 1, D-string fret 2 — D, Eb, E — slowly, three times. Then play the pentatonic box and add that fret-1 note once per bar as you pass D on the way to E.",
    pattern: {
      bpm: 66,
      note: "D, the blue note, E. Then let it resolve.",
      steps: [note(2, 0), note(2, 1), note(2, 2, 2)],
    },
  },
  {
    id: "move",
    stage: "shapes",
    title: "Same shape, new root",
    minutes: 7,
    summary: "Slide the index to a new root. The box does not change.",
    paragraphs: [
      {
        heading: "Moving",
        body: [
          "The minor pentatonic box does not care what the song is called. Your index is the root. A lives at E-string fret 5. G lives at E-string fret 3. The frets around it stay the same distances.",
          "G box: E string 3 and 6, A string 3 and 5, D string 3 and 5, G string 3 and 5. E-string fret 6 is A#, which is the same pitch other people call Bb. This app uses sharps so the neck stays one system.",
        ],
      },
    ],
    tryThis: "Play the box in A, then move it to G, then back to A. The shape stays. Only the address changes. 72 BPM.",
    pattern: {
      bpm: 72,
      note: "G minor pentatonic box, from fret 3.",
      steps: [note(0, 3), note(0, 6), note(1, 3), note(1, 5), note(2, 3), note(2, 5)],
    },
  },
  {
    id: "thirds",
    stage: "chords",
    title: "Major and minor",
    minutes: 7,
    summary: "The third is the one fret that makes a chord bright or dark.",
    tag: "Chords",
    paragraphs: [
      {
        heading: "One note decides",
        body: [
          "A chord is a stack of notes. Bass rarely plays the whole stack at once. You play the notes that matter, one at a time, in time. The root names the chord. The fifth holds it up. The third tells you whether it is major or minor.",
          "From A, a minor third is three frets up: A-string fret 3 is C. A major third is four frets up: A-string fret 4 is C#. Same root, same fifth. Only that fret changes. Rock uses both. A lot of metal lives on the minor one, or skips the third and plays a power chord instead.",
        ],
      },
    ],
    tryThis: "Play A, then C. Say minor. Play A, then C#. Say major. Five pairs, slow enough that the name comes first.",
    pattern: {
      bpm: 60,
      note: "A minor, then A major. The third is the only change.",
      steps: [note(1, 0), note(1, 3), rest(1), note(1, 0), note(1, 4), rest(1)],
    },
  },
  {
    id: "power",
    stage: "chords",
    title: "The power chord",
    minutes: 8,
    summary: "Root and fifth. No third. This is the chord under most rock and metal riffs.",
    tag: "Chords",
    paragraphs: [
      {
        heading: "Two notes",
        body: [
          "A power chord is the root plus the fifth. It is neither major nor minor, so it fits under both guitar chords. From any note, the fifth is seven frets higher on the same string, or two frets higher on the next thinner string.",
          "Open A and A-string fret 7 are A and E. Open E and A-string fret 2 are E and B. E-string fret 3 and A-string fret 5 are G and D. That last shape — a root, then two frets up on the next string — is the one you move around the neck.",
          "Some metal tunes the thick string down to D so a one-finger shape covers the bottom. This path stays in standard E A D G, so the tuner and the note names stay honest. The shapes do not change if you retune later.",
        ],
      },
    ],
    tryThis: "A, G, D, then E. Root for two beats, fifth for two beats, at 72. No extra notes.",
    pattern: {
      bpm: 72,
      note: "Four power chords: A, G, D, E.",
      steps: [
        note(1, 0, 2),
        note(1, 7, 2),
        note(0, 3, 2),
        note(1, 5, 2),
        note(2, 0, 2),
        note(2, 7, 2),
        note(0, 0, 2),
        note(1, 2, 2),
      ],
    },
  },
  {
    id: "arpeggio",
    stage: "chords",
    title: "One note at a time",
    minutes: 7,
    summary: "An arpeggio is the chord broken into a line. Root, third, fifth.",
    tag: "Chords",
    paragraphs: [
      {
        heading: "The line is the chord",
        body: [
          "Guitar can strum. You get one note at a time, which is the point: the chord becomes a riff. A minor is A, C, E. In open position that is open A, A-string fret 3, and D-string fret 2. Come back down through C.",
          "A major swaps C for C#, A-string fret 4. Same fifth. If someone says “A” and the major third clashes, it was minor. Your ear is allowed to decide. Keep the fingers that aren't playing off the string.",
        ],
      },
    ],
    tryThis: "A minor up and down, twice. Then A major up and down, twice. 70 BPM. The fifth should be as clean as the open A.",
    pattern: {
      bpm: 70,
      note: "A minor arpeggio, up and back.",
      steps: [note(1, 0), note(1, 3), note(2, 2), note(1, 3), note(1, 0, 2)],
    },
  },
  {
    id: "changes",
    stage: "chords",
    title: "Changes rock songs use",
    minutes: 8,
    summary: "A few chords, looped. Your job is the root, on time.",
    tag: "Chords",
    paragraphs: [
      {
        heading: "The loops",
        body: [
          "A huge amount of rock is I, IV, and V. In A that is A, D, and E — the open strings you already know. The other loop shows up just as often: A, G, D. In minor it becomes A, F, G. F is E-string fret 1. G is E-string fret 3.",
          "Play the root on beat 1. When that is boring and steady, add the fifth on beat 3. The song is the order of the roots. Extra notes are decoration you earn after the order is memorized.",
        ],
      },
    ],
    tryThis: "Loop A, G, D, A at 76. One bar each. Root on 1, fifth on 3. Say the chord name on beat 1.",
    pattern: {
      bpm: 76,
      note: "A, G, D, A. Root, then fifth.",
      steps: [
        note(1, 0),
        rest(1),
        note(1, 7),
        rest(1),
        note(0, 3),
        rest(1),
        note(1, 5),
        rest(1),
        note(2, 0),
        rest(1),
        note(2, 7),
        rest(1),
        note(1, 0),
        rest(1),
        note(0, 0),
        rest(1),
      ],
    },
    tool: { mode: "click", label: "Click at 76", bpm: 76 },
  },
  {
    id: "natural-minor",
    stage: "scales",
    title: "Natural minor",
    minutes: 8,
    summary: "A B C D E F G A. The pentatonic box, plus the two notes it left out.",
    tag: "Scale",
    paragraphs: [
      {
        heading: "The full minor",
        body: [
          "A natural minor is A, B, C, D, E, F, G, and the A an octave up. You already know A, C, D, E, and G from the minor pentatonic. The new ones are B and F. Rock and metal riffs use this set more often than the major scale.",
          "Open position: A-string frets 0, 2, 3 are A, B, C. D-string frets 0, 2, 3, 5 are D, E, F, G. D-string fret 7 is the octave A. The pentatonic box is the safe version of this. This is the complete one.",
        ],
      },
    ],
    tryThis: "Up the scale saying every name, including F. Then down. When the names are easy, one note per beat at 66.",
    pattern: {
      bpm: 66,
      note: "A natural minor, up.",
      steps: [note(1, 0), note(1, 2), note(1, 3), note(2, 0), note(2, 2), note(2, 3), note(2, 5), note(2, 7, 2)],
    },
  },
  {
    id: "phrygian",
    stage: "scales",
    title: "The half step",
    minutes: 7,
    summary: "One fret above the root. That is the metal sound, before the riff does anything else.",
    tag: "Scale",
    paragraphs: [
      {
        heading: "F against E",
        body: [
          "From open E, the next fret is F. One fret, not two. That half step sits under a lot of heavy riffs. The scale is often called Phrygian. You don't need the name in the room. You need the fret.",
          "One octave from open E: E, F, G, A, B, C, D, E. On the neck: E-string frets 0, 1, 3, 5, then A-string frets 2, 3, 5, 7. Use F as a neighbor that falls back to E. If every note is F, the riff has nowhere to sit.",
        ],
      },
    ],
    tryThis: "E, F, E, five times, slowly. Then the scale up at 60, one note per beat. The F should feel like it wants to go home.",
    pattern: {
      bpm: 60,
      note: "E Phrygian, from the open string.",
      steps: [note(0, 0), note(0, 1), note(0, 3), note(0, 5), note(1, 2), note(1, 3), note(1, 5), note(1, 7, 2)],
    },
  },
  {
    id: "harmonic",
    stage: "scales",
    title: "The raised seventh",
    minutes: 6,
    summary: "Natural minor, except the note before the root moves up one fret.",
    tag: "Scale",
    paragraphs: [
      {
        heading: "G becomes G#",
        body: [
          "A natural minor uses G. Harmonic minor uses G# instead — one fret under A. On the D string, fret 5 is G, fret 6 is G#, fret 7 is A. That raised note pulls hard into the root.",
          "You don't rebuild every riff around it. Play pentatonic or natural minor, and let G# show up once, at the end of a phrase, when you want the line to fall onto A. Sitting on it sounds lost. Passing through it sounds finished.",
        ],
      },
    ],
    tryThis: "D-string frets 5, 6, 7 — G, G#, A — four times. Then play natural minor and swap G for G# only at the top.",
    pattern: {
      bpm: 60,
      note: "G, G#, A. The middle note leads.",
      steps: [note(2, 5), note(2, 6), note(2, 7, 2)],
    },
  },
  {
    id: "chug",
    stage: "metal",
    title: "Palm mute",
    minutes: 6,
    summary: "The side of your hand rests at the bridge. The note becomes a thud.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "Where the hand sits",
        body: [
          "Rest the fleshy side of the plucking hand on the strings, right where they meet the bridge. Not on the fretboard. Not in the middle of the string. Too much hand and the pitch disappears. Too little and it rings like a normal note.",
          "The rhythm is straight eighths, accent on beat 1. Alternate fingers, or down-up if you already use a pick — a lot of metal does. This app's speaker cannot chug for you. The click can. Your hand does the mute.",
        ],
      },
    ],
    tryThis: "Open E, muted eighths, 80 BPM, two bars. Accent beat 1. If the note sounds pretty, move the hand toward the bridge and try again.",
    pattern: {
      bpm: 80,
      note: "Eighths on E. Mute them on your bass.",
      steps: Array.from({ length: 8 }, () => note(0, 0, 0.5)),
    },
    tool: { mode: "click", label: "Click at 80", bpm: 80 },
  },
  {
    id: "gallop",
    stage: "metal",
    title: "The gallop",
    minutes: 8,
    summary: "Long, short, short. The engine under a huge amount of metal.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "One beat, three notes",
        body: [
          "A gallop is an eighth note followed by two sixteenths. Long, short, short. The long note sits on the beat. The shorts split the back half of the beat, and they should be twins. If the second short rushes, the next beat arrives early and the whole bar leans forward.",
          "Start on open E at 72, all three notes the same pitch. The rhythm is the riff. Accent the long one by playing it a little louder, not by arriving early. When 72 is even, move the click up by 4, not by 20.",
        ],
      },
    ],
    tryThis: "One bar on open E. Then the same rhythm on open A. Palm-mute both. Stop after four bars and listen before you add speed.",
    pattern: {
      bpm: 72,
      note: "One bar. Long, short, short, four times.",
      steps: [
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
      ],
    },
    tool: { mode: "click", label: "Click at 72", bpm: 72 },
  },
  {
    id: "pedal",
    stage: "metal",
    title: "A low note that stays",
    minutes: 8,
    summary: "Open E keeps coming back. The other notes move. The floor doesn't.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "The pedal",
        body: [
          "A pedal is a note you return to, usually the lowest open string. It tells the listener what the song is sitting on while the other notes change. This riff alternates open E with notes on the A string: fret 7 (E, an octave up), fret 5 (D), fret 3 (C), then fret 5 again.",
          "The moving notes are E, D, C, D — a minor walk. Mute the A string when you return to the low E, or the two pitches smear into a mess. The low E can be palm-muted. Let the octave E ring a little longer so the two E's are obviously the same note.",
        ],
      },
    ],
    tryThis: "Four loops at 84. If C buzzes, sit closer to fret 3 before you press harder. Then try the same shape starting on open A.",
    pattern: {
      bpm: 84,
      note: "Low E between E, D, C, and D.",
      steps: [
        note(0, 0, 0.5),
        note(1, 7, 0.5),
        note(0, 0, 0.5),
        note(1, 5, 0.5),
        note(0, 0, 0.5),
        note(1, 3, 0.5),
        note(0, 0, 0.5),
        note(1, 5, 0.5),
      ],
    },
  },
  {
    id: "chromatic",
    stage: "metal",
    title: "Walk in from below",
    minutes: 6,
    summary: "Three frets in a row, landing on the root. Glue between riffs.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "Not a scale",
        body: [
          "Chromatic means fret by fret, not the notes of a key. On the E string, frets 3, 2, 1, 0 are G, F#, F, E. The middle notes don't need a chord to justify them. They exist to arrive on E.",
          "Play them as eighth notes and let E last longer than the others, so the arrival is obvious. Don't sit on F#. It is a hallway. A common place for this walk is the last half of a bar of gallops, so open E lands on beat 1 of the next bar.",
        ],
      },
    ],
    tryThis: "The walk four times at 76. Then play one bar of gallops and start the walk on beat 3, so E is the downbeat.",
    pattern: {
      bpm: 76,
      note: "G, F#, F, E. The last note stays.",
      steps: [note(0, 3, 0.5), note(0, 2, 0.5), note(0, 1, 0.5), note(0, 0, 1.5)],
    },
  },
  {
    id: "yard",
    stage: "songs",
    title: "Yard Light",
    minutes: 10,
    summary: "A four-bar rock chorus on A, D, and E. Roots and fifths only.",
    tag: "Rock",
    paragraphs: [
      {
        heading: "The song",
        body: [
          "These songs are original parts, written for the level you're at. Not covers. The job is the same one bass has on a record: hold the chords and keep the time.",
          "Yard Light is two sections. The verse is the root on beat 1 only: four bars of A, four of D, four of A, two of E. The chorus is what you can hear below — two beats of the root, two beats of the fifth, through A, D, and A, then a bar of E with B on beat 3.",
          "A is the open A string, fifth on A-string fret 7. D is the open D string, fifth on D-string fret 7. E is the open E string, fifth on A-string fret 2. Sing the chord names. If you can't, the chorus isn't memorized yet.",
        ],
      },
    ],
    tryThis: "Chorus twice at 84 without staring at the frets. Then the verse, roots on beat 1, same tempo. Stop while it still sounds calm.",
    pattern: {
      bpm: 84,
      note: "Chorus: A, D, A, then E.",
      steps: [
        note(1, 0),
        note(1, 0),
        note(1, 7),
        note(1, 7),
        note(2, 0),
        note(2, 0),
        note(2, 7),
        note(2, 7),
        note(1, 0),
        note(1, 0),
        note(1, 7),
        note(1, 7),
        note(0, 0),
        note(0, 0),
        note(1, 2),
        note(0, 0),
      ],
    },
    tool: { mode: "click", label: "Click at 84", bpm: 84 },
  },
  {
    id: "gravel",
    stage: "songs",
    title: "Gravel Line",
    minutes: 10,
    summary: "Straight eighths on E and A, then a short walk home.",
    tag: "Rock",
    paragraphs: [
      {
        heading: "The motor",
        body: [
          "Bar 1 is open E, every eighth note. Bar 2 is open A, every eighth note. Bar 3 leaves the motor: E, G, A, and the open A that matches E-string fret 5 — quarters, not eighths. Bar 4 is open E on beat 1 and nothing else.",
          "Accent beat 1 by volume. Alternate fingers the whole way. If bar 2 rushes, you got excited that the note changed. The click does not care that you moved to A.",
        ],
      },
    ],
    tryThis: "Two loops at 88. Palm-mute nothing yet. The skill is even eighths. Then play it once muted and decide which version the song wants. Keep the even one.",
    pattern: {
      bpm: 88,
      note: "E eighths, then the walk E, G, A, A.",
      steps: [
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0),
        note(0, 3),
        note(0, 5),
        note(1, 0),
      ],
    },
    tool: { mode: "click", label: "Click at 88", bpm: 88 },
  },
  {
    id: "concrete",
    stage: "songs",
    title: "Cold Concrete",
    minutes: 12,
    summary: "A minor riff for the verse. A, F, and G for the chorus.",
    tag: "Rock",
    paragraphs: [
      {
        heading: "Verse, then chorus",
        body: [
          "The verse riff sits in A minor, rooted at E-string fret 5. The notes are A, C, D, E, then C, A, G, A. Index stays around fret 5. G is E-string fret 3, a small shift back — don't reach for it with a pinky from fret 5.",
          "The chorus is roots, one bar each: A, F, G, A. A is E-string fret 5. F is E-string fret 1. G is E-string fret 3. Low, obvious, on beat 1. Fifths, if you want them, are two frets up on the A string: fret 7, fret 3, fret 5.",
          "Form: verse four times, chorus twice, verse twice. Hear it plays the verse once so you can learn the pitches. The chorus is the part you count.",
        ],
      },
    ],
    tryThis: "Riff four times at 80. Then the chorus roots, two bars each, no fifths yet. Don't speed up when you jump down to F.",
    pattern: {
      bpm: 80,
      note: "Verse riff. A, C, D, E, C, A, G, A.",
      steps: [
        note(0, 5, 0.5),
        note(0, 8, 0.5),
        note(1, 5, 0.5),
        note(1, 7, 0.5),
        note(0, 8, 0.5),
        note(0, 5, 0.5),
        note(0, 3, 0.5),
        note(0, 5, 1),
      ],
    },
    tool: { mode: "click", label: "Click at 80", bpm: 80 },
  },
  {
    id: "rust",
    stage: "songs",
    title: "Rust Choir",
    minutes: 10,
    summary: "A gallop on E, then the chromatic walk back into it.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "One riff, looped",
        body: [
          "Bar 1 is the gallop on open E, palm-muted. Bar 2 is the walk: G, F#, F, and E, as eighths, and E holds the last beat. Let the walk ring a little more than the gallop so the pitch change is obvious, then mute again when E returns.",
          "That two-bar loop is the song. Metal often sits on one riff longer than a rock chorus does. Four loops is a section. Eight loops is a performance. Do not add notes because you got bored. Bored and even is the part.",
        ],
      },
    ],
    tryThis: "Four loops at 76. Then two more with the click two notches slower, not faster. If the shorts turn into a buzz, you are done for today.",
    pattern: {
      bpm: 76,
      note: "Gallop, then G, F#, F, E.",
      steps: [
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 3, 0.5),
        note(0, 2, 0.5),
        note(0, 1, 0.5),
        note(0, 0, 1.5),
      ],
    },
    tool: { mode: "click", label: "Click at 76", bpm: 76 },
  },
  {
    id: "knuckle",
    stage: "songs",
    title: "Split Knuckle",
    minutes: 12,
    summary: "The pedal riff as a verse. A gallop on A as the chorus.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "Verse and chorus",
        body: [
          "The verse is the pedal riff: low E between A-string frets 7, 5, 3, and 5. Play it four times. Mute the A string on the way back to E. The chorus is not a new scale. It is the gallop, two bars, on open A, then one bar of the chromatic walk into open E so the verse can start again.",
          "Form: verse four times, chorus, verse four times. Hear it is the verse. You already know both rhythms. The new skill is changing from one to the other without a count-in from a friend.",
        ],
      },
    ],
    tryThis: "Verse twice, chorus once, verse once, at 88. Mark the chorus out loud — say “chorus” on its first beat — until you don't need to.",
    pattern: {
      bpm: 88,
      note: "Verse. Low E under E, D, C, D.",
      steps: [
        note(0, 0, 0.5),
        note(1, 7, 0.5),
        note(0, 0, 0.5),
        note(1, 5, 0.5),
        note(0, 0, 0.5),
        note(1, 3, 0.5),
        note(0, 0, 0.5),
        note(1, 5, 0.5),
      ],
    },
    tool: { mode: "click", label: "Click at 88", bpm: 88 },
  },
  {
    id: "chapel",
    stage: "songs",
    title: "Low Chapel",
    minutes: 12,
    summary: "An A minor arpeggio for the verse. Power chords for the chorus.",
    tag: "Rock",
    paragraphs: [
      {
        heading: "Chords, as a song",
        body: [
          "Mid-tempo. The verse is A minor, one note per beat: A, C, E, C, and again. Open A, A-string fret 3, D-string fret 2. Short notes. Two bars is the verse.",
          "The chorus is power chords, half a bar of root and half a bar of fifth: A, G, D, E. Same shapes as the power-chord lesson. A and its fifth, G and D, D and A, E and B. Play the verse twice and the chorus once, then stop. If the fifths are late, the chorus is too fast, not your hands.",
        ],
      },
    ],
    tryThis: "The whole form at 72, twice. Sing “minor” on the verse and the chord names on the chorus. Log it when the second pass doesn't fall apart at G.",
    pattern: {
      bpm: 72,
      note: "Verse arpeggio, then the power-chord chorus.",
      steps: [
        note(1, 0),
        note(1, 3),
        note(2, 2),
        note(1, 3),
        note(1, 0),
        note(1, 3),
        note(2, 2),
        note(1, 3),
        note(1, 0, 2),
        note(1, 7, 2),
        note(0, 3, 2),
        note(1, 5, 2),
        note(2, 0, 2),
        note(2, 7, 2),
        note(0, 0, 2),
        note(1, 2, 2),
      ],
    },
  },
  {
    id: "tone",
    stage: "heavy",
    title: "A metal tone you can hear",
    minutes: 5,
    summary: "Gain is allowed. Mud is not. The pitch still has to read.",
    tag: "Tone",
    paragraphs: [
      {
        heading: "What the amp is for",
        body: [
          "Matt Scharfglass's heavy-metal bass lesson starts with tone, before the riffs. Fresh strings, the bass's tone knob mostly open, and only enough amp grit that the note still has a pitch. If you cannot sing the note back, turn the gain down before you blame your fretting hand.",
          "Palm mute is part of the sound, not a separate trick. The speaker in this app stays clean on purpose, so you can hear the pitches. The grind happens on your amp. This neck is four strings, E A D G. Alex Webster's Extreme Metal Bass is written for a five-string with a low B. The shapes are the same. You just don't have that low B here.",
        ],
      },
    ],
    tryThis: "Play open E, then E-string fret 1, then open E again. If fret 1 disappears into a buzz of gain, the tone is too hot. Fix the amp, then play it again.",
  },
  {
    id: "pick",
    stage: "heavy",
    title: "Fingers, or a pick",
    minutes: 6,
    summary: "Fingers are the default here. A pick is the even attack a lot of metal guitar expects.",
    tag: "Hands",
    paragraphs: [
      {
        heading: "Both are legal",
        body: [
          "Scharfglass treats fingerstyle and pick as two tools, not a moral choice. Fingers are what the earlier lessons use. A pick wins when you need every eighth note the same volume, especially under a guitar that is down-picking. Hold it loose. The tip crosses the string just past the pickup, not over the neck.",
          "Start with downstrokes, one per eighth note. Alternate picking — down, up — is for sixteenths, and only after the downstrokes are even. If you stay with fingers, the next lesson is the three-finger hand. Either way, the rhythm work is the same.",
        ],
      },
    ],
    tryThis: "Open E, eight downstrokes, at 80. Then the same eight with index and middle. Keep the one that stays even. Don't keep the one that feels tougher.",
    pattern: {
      bpm: 80,
      note: "Eight even attacks on E. Downstrokes if you have a pick.",
      steps: Array.from({ length: 8 }, () => note(0, 0, 0.5)),
    },
    tool: { mode: "click", label: "Click at 80", bpm: 80 },
  },
  {
    id: "three",
    stage: "heavy",
    title: "Three fingers, in fours",
    minutes: 8,
    summary: "Ring, middle, index. Accent every fourth note so it doesn't collapse into triplets.",
    tag: "Hands",
    paragraphs: [
      {
        heading: "The extreme-metal right hand",
        body: [
          "Alex Webster's three-finger pluck is ring, middle, index, over and over. Two fingers are still the meat of bass playing. The third finger is how extreme metal keeps sixteenths even when two fingers gas out. He is explicit about the trap: three fingers want to become triplets. They have to feel like fours.",
          "Accent in groups of four, not three. Ring is the first accent, then four notes later the middle finger is the accent, then four later the index. Say “ONE e and a TWO e and a” while the fingers keep their order. At speed you stop counting. This tempo is slow on purpose. Even at 60 beats the point. Fast and lumpy is not the lick.",
          "The book also teaches a second order, return to the middle: ring, middle, index, middle. The middle finger plays on the way out and again on the way back, so every group of four starts on the ring. That one lines up with the beat. The order above is the one he plays, and the accent moves. Drills has both, plus the left-hand work from the same chapter: one finger per fret, the shape moved to the next string, a string skip, and legato, where you pluck once and the fretting fingers sound the rest. Stop if the forearm burns.",
        ],
      },
    ],
    tryThis: "One bar of sixteenths on open E at 60. Accent beats 1, 2, 3, and 4. If you can't say which finger played the accent, slow down. Do not speed up today.",
    pattern: {
      bpm: 60,
      note: "Twelve sixteenths. Three accents. Ring, middle, index, and keep going.",
      steps: Array.from({ length: 12 }, () => note(0, 0, 0.25)),
    },
    tool: { mode: "click", label: "Click at 60", bpm: 60 },
  },
  {
    id: "spider",
    stage: "heavy",
    title: "One finger per fret",
    minutes: 6,
    summary: "Index, middle, ring, pinky. The fretting hand's version of not collapsing.",
    tag: "Hands",
    paragraphs: [
      {
        heading: "Four frets, four fingers",
        body: [
          "Webster's left-hand chapter parks one finger per fret so the pinky stops being a guest. On the E string: fret 1 index, 2 middle, 3 ring, 4 pinky. Then the same frets on the A string. The thumb stays behind the neck. You do not slide the whole hand for fret 4.",
          "This is a generic chromatic drill, not a riff. Metal uses it because the music is full of fret-by-fret notes. If the pinky buzzes, move it closer to the fret. Squeezing harder is the wrong fix.",
        ],
      },
    ],
    tryThis: "E string 1-2-3-4, then A string 1-2-3-4, at talking speed. Four passes. Name nothing. Listen for the pinky.",
    pattern: {
      bpm: 66,
      note: "One finger per fret, E string then A string.",
      steps: [note(0, 1), note(0, 2), note(0, 3), note(0, 4), note(1, 1), note(1, 2), note(1, 3), note(1, 4)],
    },
  },
  {
    id: "tritone",
    stage: "heavy",
    title: "The tritone",
    minutes: 6,
    summary: "One fret under the fifth. Mean on purpose, then get off it.",
    tag: "Shape",
    paragraphs: [
      {
        heading: "Six frets up",
        body: [
          "Scharfglass's two-note metal map is minor third, major third, fifth, tritone, octave. You have the thirds, the fifth, and the octave. The missing one is the tritone: six frets above the root, which is also one fret under the fifth.",
          "From open E, the fifth is A-string fret 2 (B). The tritone is A-string fret 1 (A#). It wants to move — up to B, or back to E. Sitting on it sounds lost. Passing through it sounds like metal. Same shape from any root: the fifth you know, one fret lower.",
        ],
      },
    ],
    tryThis: "Open E, A-string fret 1, A-string fret 2, open E. Say root, tritone, fifth, root. Four times, slow. Then start the shape on E-string fret 3, which is G.",
    pattern: {
      bpm: 66,
      note: "E, the tritone, the fifth, E.",
      steps: [note(0, 0), note(1, 1), note(1, 2), note(0, 0, 2)],
    },
  },
  {
    id: "feels",
    stage: "heavy",
    title: "Straight, half-time, double-time",
    minutes: 7,
    summary: "Same notes. Three speeds against the same click.",
    tag: "Time",
    paragraphs: [
      {
        heading: "The click stays",
        body: [
          "A feel is how your notes sit on a click that does not change. Straight time here is eighth notes: one-and, two-and. Half-time is the same riff with half as many notes — quarters, so you play on the clicks and leave the ands empty. Double-time is sixteenths: two notes in the space of each eighth.",
          "Metal songs flip these on purpose. The chorus feels huge because you dropped to half-time, not because the drummer slowed the tempo. Hear it is the straight version. You play the other two by thinning it out or doubling it, same frets, same 80.",
        ],
      },
    ],
    tryThis: "At 80: one bar of eighths on E, one bar of quarters, one bar of sixteenths. Don't touch the tempo knob between them.",
    pattern: {
      bpm: 80,
      note: "Straight eighths. Half-time leaves out the ands. Double-time splits these.",
      steps: Array.from({ length: 8 }, () => note(0, 0, 0.5)),
    },
    tool: { mode: "click", label: "Click at 80", bpm: 80 },
  },
  {
    id: "triplets",
    stage: "heavy",
    title: "Triplet grooves",
    minutes: 7,
    summary: "Three notes in one beat. Not the gallop. Not sixteenths.",
    tag: "Time",
    paragraphs: [
      {
        heading: "One-trip-let",
        body: [
          "Webster spends a chapter on triplet grooves because extreme metal sits on them as often as it sits on sixteenths. A triplet is three equal notes in the space of one beat. Count “one-trip-let, two-trip-let.” The gallop is long-short-short, which is an eighth plus two sixteenths. It is not a triplet. If your three fingers make every group a triplet by accident, this is the drill that separates them.",
          "All three notes the same length. Accent the first of each three. Palm mute. When E is even, move the group to G (E-string fret 3) and back.",
        ],
      },
    ],
    tryThis: "Two beats of triplets on E, two beats on G, at 70. Say the count out loud. If the middle note is shorter, you played a gallop. Fix that before you speed up.",
    pattern: {
      bpm: 70,
      note: "Triplets on E, then on G.",
      steps: [
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 3, 1 / 3),
        note(0, 3, 1 / 3),
        note(0, 3, 1 / 3),
        note(0, 3, 1 / 3),
        note(0, 3, 1 / 3),
        note(0, 3, 1 / 3),
      ],
    },
    tool: { mode: "click", label: "Click at 70", bpm: 70 },
  },
  {
    id: "kick",
    stage: "heavy",
    title: "What you double",
    minutes: 6,
    summary: "The kick, the guitar, or both. You don't have to play every pick stroke.",
    tag: "Rhythm",
    paragraphs: [
      {
        heading: "Three jobs",
        body: [
          "Webster describes three ordinary ways a metal bass part works. Follow the drums: your notes are the kick pattern, and the guitar can be busier than you. Double the guitar: you play the riff, and the kick may be doing something else. Or do both, which is the heavy one, and the one that falls apart first.",
          "When a guitar is speed-picking sixteenths, you do not owe them every stroke. Eighths under their sixteenths still lock. Doubling every pick only counts if your hand is already even. Start by playing the kicks — here, beats 1 and 3 — and let the rest of the bar be a choice, not a panic.",
        ],
      },
    ],
    tryThis: "80 BPM. Open E on 1 and 3 only, for four bars. Then add the and of 2, one extra note. If the bar leans forward, take the extra note back out.",
    pattern: {
      bpm: 80,
      note: "Kicks on 1 and 3. The empty beats are the rest of the band.",
      steps: [note(0, 0), rest(1), note(0, 0), rest(1)],
    },
    tool: { mode: "click", label: "Click at 80", bpm: 80 },
  },
  {
    id: "hammers",
    stage: "heavy",
    title: "Hammers, pulls, trills",
    minutes: 6,
    summary: "The left hand sounds a note the right hand did not pluck.",
    tag: "Hands",
    paragraphs: [
      {
        heading: "One pluck, two notes",
        body: [
          "A hammer-on is a finger snapping onto a higher fret hard enough to sound, after you plucked a lower note. A pull-off is the reverse: the fretting finger plucks the string as it leaves, and a lower finger is already waiting. A trill is those two, back and forth, fast, on purpose.",
          "Hear it plucks every note, because the speaker has no left hand. On your bass, pluck only the first note of each pair. E-string open, hammer to fret 3. Pull back to open. Then hammer fret 3 to fret 5 and pull back. The second note should be almost as loud as the first. If it isn't, the hammer was a press.",
        ],
      },
    ],
    tryThis: "Four pairs, open to fret 3, plucked only on the open string. Then a short trill between frets 3 and 5, three times, and stop on 3.",
    pattern: {
      bpm: 72,
      note: "The pitches. You pluck only the first of each pair.",
      steps: [note(0, 0), note(0, 3), note(0, 0), note(0, 3), note(0, 3), note(0, 5), note(0, 3, 2)],
    },
  },
  {
    id: "taps",
    stage: "heavy",
    title: "A tap, not a trick",
    minutes: 6,
    summary: "The plucking hand frets one note. Then it gets out of the way.",
    tag: "Hands",
    paragraphs: [
      {
        heading: "One extra finger on the neck",
        body: [
          "Both of those metal methods get to tapping late, and both treat it as a left-hand hammer plus a right-hand finger that taps a fret and pulls off. Webster credits the idea to other bassists' lessons, not to a secret. You don't need it for the songs below. You need to know what it is so a tab stops looking like magic.",
          "Fretting hand holds E-string fret 5 (A). Plucking-hand index taps G-string fret 9, which is E an octave up, then pulls off. The tap has to be a strike, not a lay-down. Hear it plays both pitches plucked, so you can match them. On the bass, the high one is the tap.",
        ],
      },
    ],
    tryThis: "Four slow taps at the 9th fret on G, each one pulling off to a note you aren't even fretting yet — just the open G. When that sounds, add the fretted A underneath on beat 1 only.",
    pattern: {
      bpm: 66,
      note: "Low A, then the E you will tap.",
      steps: [note(0, 5, 2), note(3, 9), note(3, 0), note(3, 9), note(3, 0)],
    },
  },
  {
    id: "redline",
    stage: "heavy",
    setlist: true,
    title: "Redline",
    minutes: 10,
    summary: "Hard rock. Eighths that don't let up, then a short walk home.",
    tag: "Rock",
    paragraphs: [
      {
        heading: "The song",
        body: [
          "Louder than Yard Light, and less polite. Bar 1 is open E, every eighth, accent on beat 1. Palm mute. Pick or fingers, whichever one stayed even. Bar 2 is the turn: G, A, E, E, then G, F#, and E held. E-string frets 3, 5, 0, then 3, 2, 0.",
          "That two-bar loop is the verse, four times. The chorus is the same eighths on A (open A, or E-string fret 5 if you want it lower) for one bar, then back to E. Don't add notes. Rock this fast falls apart in the fill, not in the riff.",
        ],
      },
    ],
    tryThis: "Verse twice at 96. If the eighths rush when G shows up, play it at 88 until the walk is as even as the chug.",
    pattern: {
      bpm: 96,
      note: "Muted E eighths, then G, A, E, G, F#, E.",
      steps: [
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 3, 0.5),
        note(0, 5, 0.5),
        note(0, 0, 0.5),
        note(0, 0, 0.5),
        note(0, 3, 0.5),
        note(0, 2, 0.5),
        note(0, 0, 1),
      ],
    },
    tool: { mode: "click", label: "Click at 96", bpm: 96 },
  },
  {
    id: "hotrail",
    stage: "heavy",
    setlist: true,
    title: "Hot Rail",
    minutes: 10,
    summary: "Driving rock. Low note, octave, low note, octave. Then get out.",
    tag: "Rock",
    paragraphs: [
      {
        heading: "The octave riff",
        body: [
          "A straight rock engine. Open A and the A an octave up, G-string fret 2. Alternate them as eighths for a bar. Accent the low one. The high one is short — stop it, or it rings over the next low A.",
          "Bar 2 moves to D: open D, then G-string fret 7, which is the D an octave up. Two of those, then open E on beat 3 and nothing on 4. Form: A-octave bar, D-octave bar, twice, then a bar of open-E eighths to turn around. This is the rock song. Play it bored and even.",
        ],
      },
    ],
    tryThis: "Two loops at 92. If the octave is late, you are looking for it. Find G-string fret 2 with the index before the bar starts.",
    pattern: {
      bpm: 92,
      note: "A and its octave, then D and its octave, then E.",
      steps: [
        note(1, 0, 0.5),
        note(3, 2, 0.5),
        note(1, 0, 0.5),
        note(3, 2, 0.5),
        note(1, 0, 0.5),
        note(3, 2, 0.5),
        note(1, 0, 0.5),
        note(3, 2, 0.5),
        note(2, 0, 0.5),
        note(3, 7, 0.5),
        note(2, 0, 0.5),
        note(3, 7, 0.5),
        note(0, 0),
        rest(1),
      ],
    },
    tool: { mode: "click", label: "Click at 92", bpm: 92 },
  },
  {
    id: "ash",
    stage: "heavy",
    setlist: true,
    title: "Ash Kiln",
    minutes: 10,
    summary: "Heavy metal. Gallop on E, then the same gallop one fret up.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "The half step is the riff",
        body: [
          "Bar 1: gallop on open E for two beats, gallop on E-string fret 1 (F) for two beats. Palm mute all of it. F should feel wrong in a way you chose. Bar 2 walks G, F#, F into E — frets 3, 2, 1, 0 — and E holds the last beat.",
          "Four loops is a section. The break is eight gallops on open E and nothing else, then the riff again. Three fingers if the gallop is clean with two. If the shorts rush when you move to F, the riff is too fast.",
        ],
      },
    ],
    tryThis: "Four loops at 88. Then the break. Mark the F out loud the first two times so you don't skip the half step.",
    pattern: {
      bpm: 88,
      note: "Gallop E, gallop F, then G, F#, F, E.",
      steps: [
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        note(0, 1, 0.5),
        note(0, 1, 0.25),
        note(0, 1, 0.25),
        note(0, 1, 0.5),
        note(0, 1, 0.25),
        note(0, 1, 0.25),
        note(0, 3, 0.5),
        note(0, 2, 0.5),
        note(0, 1, 0.5),
        note(0, 0, 1.5),
      ],
    },
    tool: { mode: "click", label: "Click at 88", bpm: 88 },
  },
  {
    id: "powder",
    stage: "heavy",
    setlist: true,
    title: "Black Powder",
    minutes: 10,
    summary: "Slow and heavy. Long notes, a half step, and one gallop at the end.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "Doom tempo",
        body: [
          "This is the slow end of what Webster files under doom and sludge. The heaviness is the wait, not the speed. Bar 1 is open E, the whole bar, palm muted but still a pitch. Bar 2 is F for two beats and E for two. Bar 3 is G for two and F# for two. Bar 4 is a single gallop on E, then silence.",
          "Let bar 1 actually last four beats. The speaker will hold the note. Your job is not to fill it. Form: play it twice. Second time, choke the E at the end of bar 1 so the F arrives out of silence.",
        ],
      },
    ],
    tryThis: "Twice through at 60. Count all four beats of the first bar out loud. If you play anything else in that bar, start over.",
    pattern: {
      bpm: 60,
      note: "E, then F and E, then G and F#, then one gallop.",
      steps: [
        note(0, 0, 4),
        note(0, 1, 2),
        note(0, 0, 2),
        note(0, 3, 2),
        note(0, 2, 2),
        note(0, 0, 0.5),
        note(0, 0, 0.25),
        note(0, 0, 0.25),
        rest(3),
      ],
    },
    tool: { mode: "click", label: "Click at 60", bpm: 60 },
  },
  {
    id: "thirdrail",
    stage: "heavy",
    setlist: true,
    title: "Third Rail",
    minutes: 10,
    summary: "A triplet metal groove. Three equal notes, then the tritone, then home.",
    tag: "Metal",
    paragraphs: [
      {
        heading: "Triplets as a section",
        body: [
          "Two bars, played tight. The first two beats are triplets on open E, accent on each downbeat. Then E, the tritone (A-string fret 1), the fifth (A-string fret 2), and open E held. Loop it. Extreme metal will sit on a phrase this small for a long time.",
          "Three-finger plucking fits here if the fingers are already even in fours. If they aren't, play the triplets with two fingers and keep them equal. Do not use this song to invent the technique.",
        ],
      },
    ],
    tryThis: "Four loops at 76. The tritone is one note, not a rest stop. If the triplets turn into gallops, go back to the triplet lesson before you loop this again.",
    pattern: {
      bpm: 76,
      note: "E triplets, then root, tritone, fifth, root.",
      steps: [
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0, 1 / 3),
        note(0, 0),
        note(1, 1),
        note(1, 2),
        note(0, 0, 2),
        rest(1),
      ],
    },
    tool: { mode: "click", label: "Click at 76", bpm: 76 },
  },
  {
    id: "muting",
    stage: "forward",
    title: "Stop the note on purpose",
    minutes: 6,
    summary: "Length is a choice. Most of the time, shorter is righter.",
    paragraphs: [
      {
        heading: "Muting",
        body: [
          "Stop a note by touching the string with the plucking hand, or by lifting the fretting finger until it still touches the string but no longer presses — a mute, not a release into a buzz. The click should often land on silence.",
        ],
      },
    ],
    tryThis: "Quarter notes on open A at 80. Each note dies before the next beat. If they overlap, you are letting the string go instead of stopping it.",
    tool: { mode: "click", label: "Click at 80", bpm: 80 },
  },
  {
    id: "space",
    stage: "forward",
    title: "Take a note out",
    minutes: 6,
    summary: "If you can't sing the bassline, the listener can't hold it either.",
    paragraphs: [
      {
        heading: "Editing",
        body: [
          "Busy feels like playing. Memorable feels like a part. The test: look away from the neck and sing what you just played. If you can't, remove notes until you can.",
        ],
      },
    ],
    tryThis:
      "Play roots on beat 1 for the A D A E loop. Add one extra note, somewhere in bar 2 only. Loop it four times. If the loop isn't better, take the note back out.",
  },
  {
    id: "write",
    stage: "forward",
    title: "Four bars of your own",
    minutes: 8,
    summary: "Rules, so you aren't staring at the neck hoping.",
    paragraphs: [
      {
        heading: "The constraints",
        body: [
          "Key of A. Only A, E, and D — roots and fifths you already know. 72 BPM. Beat 1 of every bar is a root. At least one bar is a single note. Write the beats on paper before you touch the bass.",
          "A starter you may change: bar 1 is A and nothing else, bar 2 is A then E on beat 3, bar 3 is D and nothing else, bar 4 is A then E on beat 3.",
        ],
      },
    ],
    tryThis: "Write it, play it twice clean, then change one note and decide if you keep the change. Log the play-through when the second pass is real.",
    pattern: {
      bpm: 72,
      note: "A starter line. Change it.",
      steps: [note(1, 0, 4), note(1, 0, 2), note(0, 0, 2), note(2, 0, 4), note(1, 0, 2), note(0, 0, 2)],
    },
  },
  {
    id: "week",
    stage: "forward",
    title: "A week that keeps moving",
    minutes: 4,
    summary: "You don't need a new song every day. You need a loop you return to.",
    paragraphs: [
      {
        heading: "After the path",
        body: [
          "Ten focused minutes beat an hour of wandering. A week that works: one day on the song you just unlocked, two days with a drill from Practice, one day with no new notes — an old groove slower than you want, one day rewriting four bars, one day that is only tuning and review, and one day off if you need it. The streak counts the days you show up, not the days you play fast.",
          "Lowline keeps your lessons, minutes, and streak on this phone. Come back tomorrow. The next thing is the same neck, a little quieter.",
        ],
      },
    ],
    tryThis:
      "Set tomorrow's plan before you stop: one old groove, eight notes in the drill, five minutes on the click. That's enough.",
    tool: { mode: "drill", label: "Run today's drill" },
  },
];

export function getLesson(id: string) {
  return LESSONS.find((lesson) => lesson.id === id) ?? null;
}

export function stageById(id: string) {
  return STAGES.find((stage) => stage.id === id) ?? STAGES[0];
}

export function lessonIndex(id: string) {
  return LESSONS.findIndex((lesson) => lesson.id === id);
}

export function nextLesson(completed: readonly string[]) {
  return LESSONS.find((lesson) => !completed.includes(lesson.id)) ?? null;
}

export function isUnlocked(id: string, completed: readonly string[]) {
  const index = lessonIndex(id);
  if (index <= 0) return true;
  if (completed.includes(id)) return true;
  return completed.includes(LESSONS[index - 1]!.id);
}

export function previousLesson(id: string) {
  const index = lessonIndex(id);
  if (index <= 0) return null;
  return LESSONS[index - 1] ?? null;
}

export function skippedIds(experience: Experience) {
  const cut = experience === "some" ? "opens" : experience === "stuck" ? "ones" : null;
  if (!cut) return [];
  const index = lessonIndex(cut);
  if (index <= 0) return [];
  return LESSONS.slice(0, index).map((lesson) => lesson.id);
}

export function stageLessons(stageId: string) {
  return LESSONS.filter((lesson) => lesson.stage === stageId);
}

export function setlistLessons() {
  return LESSONS.filter((lesson) => lesson.stage === "songs" || lesson.setlist);
}

export type DrillSpot = { string: number; fret: number; name: string };

export function drillSpots(completed: readonly string[]): DrillSpot[] {
  const has = (id: string) => completed.includes(id);
  const spots: { string: number; fret: number }[] = [];
  const add = (string: number, fret: number) => spots.push({ string, fret });

  add(0, 0);
  add(1, 0);
  add(2, 0);
  add(3, 0);

  if (has("first-frets") || has("roots")) {
    add(0, 1);
    add(0, 3);
    add(0, 5);
    add(1, 2);
    add(1, 3);
    add(1, 5);
  }

  if (has("roots")) {
    add(2, 7);
    add(1, 7);
    add(2, 2);
    add(2, 5);
    add(0, 3);
  }

  if (has("major")) {
    add(1, 4);
    add(2, 4);
    add(2, 6);
    add(2, 7);
  }

  if (has("pentatonic") || has("move")) {
    for (const [string, fret] of [
      [0, 5],
      [0, 8],
      [1, 5],
      [1, 7],
      [2, 5],
      [2, 7],
      [3, 5],
      [3, 7],
    ] as const) {
      add(string, fret);
    }
  }

  if (has("move")) {
    for (const [string, fret] of [
      [0, 3],
      [0, 6],
      [1, 3],
      [1, 5],
      [2, 3],
      [2, 5],
    ] as const) {
      add(string, fret);
    }
  }

  if (has("natural-minor") || has("harmonic")) {
    add(1, 2);
    add(1, 3);
    add(2, 3);
    add(2, 5);
    add(2, 6);
  }

  if (has("phrygian") || has("chromatic") || has("pedal")) {
    add(0, 1);
    add(0, 2);
    add(0, 3);
    add(1, 2);
    add(1, 3);
    add(1, 5);
    add(1, 7);
  }

  const map = new Map<string, DrillSpot>();
  for (const spot of spots) {
    const name = midiName(spot.string, spot.fret);
    map.set(`${spot.string}:${spot.fret}`, { ...spot, name });
  }
  return [...map.values()];
}

function midiName(stringIndex: number, fret: number) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const midi = [28, 33, 38, 43][stringIndex]! + fret;
  return names[((midi % 12) + 12) % 12]!;
}

export function lessonsUntil(id: string, completed: readonly string[]) {
  const index = lessonIndex(id);
  if (index <= 0) return 0;
  let count = 0;
  for (let i = 0; i < index; i++) {
    if (!completed.includes(LESSONS[i]!.id)) count += 1;
  }
  return count;
}

export function patternMinutes(steps: Step[], bpm: number) {
  const beats = steps.reduce((sum, step) => sum + step.beats, 0);
  return Math.max(1, Math.round(beats / bpm));
}
