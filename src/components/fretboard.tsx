import { GAUGES, STRING_LABELS, describeFret } from "@/lib/bass/theory";

const FRETS = 13;
const INLAYS = [3, 5, 7, 9];

export type FretSpot = { string: number; fret: number };

type FretboardProps = {
  hot?: FretSpot | null;
  guide?: FretSpot | null;
  showNames?: boolean;
  onPlay: (stringIndex: number, fret: number) => void;
};

export function Fretboard({ hot, guide, showNames = false, onPlay }: FretboardProps) {
  return (
    <div>
      <div className="flex">
        <div className="w-8 shrink-0" aria-hidden="true">
          {STRING_LABELS.map((label) => (
            <div key={label} className="flex h-12 items-center justify-center text-xs text-muted">
              {label}
            </div>
          ))}
        </div>
        <div className="neck-scroll min-w-0 flex-1 rounded-lg bg-surface">
          <div className="neck relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48">
              {INLAYS.map((fret) => (
                <span
                  key={fret}
                  className="inlay"
                  style={{
                    left: `calc(${fret} * var(--fret-w) + var(--fret-w) / 2)`,
                    top: "50%",
                  }}
                />
              ))}
              <span
                className="inlay"
                style={{ left: "calc(12 * var(--fret-w) + var(--fret-w) / 2)", top: "36%" }}
              />
              <span
                className="inlay"
                style={{ left: "calc(12 * var(--fret-w) + var(--fret-w) / 2)", top: "64%" }}
              />
            </div>
            {STRING_LABELS.map((label, stringIndex) => (
              <div key={label} className="fret-row" style={{ ["--gauge" as string]: GAUGES[stringIndex] }}>
                {Array.from({ length: FRETS }, (_, fret) => {
                  const isHot = hot?.string === stringIndex && hot.fret === fret;
                  const isGuide = guide?.string === stringIndex && guide.fret === fret;
                  const described = describeFret(stringIndex, fret);
                  const show = showNames || isHot;
                  return (
                    <button
                      key={fret}
                      type="button"
                      className="fret-btn press"
                      data-nut={fret === 0 ? "true" : undefined}
                      data-hot={isHot ? "true" : undefined}
                      data-guide={!isHot && isGuide ? "true" : undefined}
                      aria-label={described.label}
                      onClick={() => onPlay(stringIndex, fret)}
                    >
                      {show ? <span className="fret-name text-xs font-medium">{described.name}</span> : null}
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="fret-row">
              {Array.from({ length: FRETS }, (_, fret) => (
                <div key={fret} className="flex h-6 items-center justify-center text-xs text-subtle">
                  {fret === 0 ? "" : fret}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-subtle">Low E on top, as you look down. Fret numbers count from the nut.</p>
    </div>
  );
}
