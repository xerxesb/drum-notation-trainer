// SVG-based drum notation renderer
// Staff layout:
//   viewBox: 0 0 320 120
//   Staff lines y: [32, 44, 56, 68, 80] (line 5 top → line 1 bottom)
//   Middle line (snare): y = 56
//   getY(pos) = 56 - pos * 6   (pos 0 = snare, +ve = up, -ve = down)

const MIDDLE_Y = 62        // shifted down 6px so crash/accent fits above
const HALF_SPACE = 6
const NOTE_X = 175
const STAFF_X_START = 68
const STAFF_X_END = 300
const STAFF_LINES = [38, 50, 62, 74, 86]

const getY = (position) => MIDDLE_Y - position * HALF_SPACE

// Returns y-values of any ledger lines needed for this note position
function getLedgerYs(position) {
  const ledgers = []
  if (position >= 6) {
    ledgers.push(getY(6))
    if (position >= 8) ledgers.push(getY(8))
  }
  if (position <= -6) {
    ledgers.push(getY(-6))
    if (position <= -8) ledgers.push(getY(-8))
  }
  return ledgers
}

function NormalHead({ x, y }) {
  return (
    <ellipse
      cx={x} cy={y} rx={7} ry={5}
      transform={`rotate(-20, ${x}, ${y})`}
      fill="black"
    />
  )
}

function XHead({ x, y }) {
  const s = 5
  return (
    <g>
      <line x1={x - s} y1={y - s} x2={x + s} y2={y + s}
        stroke="black" strokeWidth={2} strokeLinecap="round" />
      <line x1={x + s} y1={y - s} x2={x - s} y2={y + s}
        stroke="black" strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

function OpenXHead({ x, y }) {
  const s = 4.5
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill="none" stroke="black" strokeWidth={1.8} />
      <line x1={x - s} y1={y - s} x2={x + s} y2={y + s}
        stroke="black" strokeWidth={1.8} strokeLinecap="round" />
      <line x1={x + s} y1={y - s} x2={x - s} y2={y + s}
        stroke="black" strokeWidth={1.8} strokeLinecap="round" />
    </g>
  )
}

function GhostHead({ x, y }) {
  return (
    <g>
      <text x={x - 14} y={y + 5} fontSize="16" fill="black"
        fontFamily="Georgia, 'Times New Roman', serif" fontStyle="normal">
        (
      </text>
      <NormalHead x={x} y={y} />
      <text x={x + 7} y={y + 5} fontSize="16" fill="black"
        fontFamily="Georgia, 'Times New Roman', serif" fontStyle="normal">
        )
      </text>
    </g>
  )
}

function Note({ noteData }) {
  const { position, headType, stemDown, hasAccent, hasOpenMark } = noteData
  const y = getY(position)
  const ledgerYs = getLedgerYs(position)

  // Stem x: right side of oval for up-stems, left side for down-stems
  // X noteheads: stem from center
  const isX = headType === 'x' || headType === 'open_x'
  const stemX = isX ? NOTE_X : (stemDown ? NOTE_X - 6 : NOTE_X + 6)
  const stemY1 = y
  const stemY2 = stemDown ? y + 30 : y - 30

  return (
    <g>
      {/* Ledger lines */}
      {ledgerYs.map((ly, i) => (
        <line key={i}
          x1={NOTE_X - 13} y1={ly} x2={NOTE_X + 13} y2={ly}
          stroke="black" strokeWidth={1.5}
        />
      ))}

      {/* Stem */}
      <line
        x1={stemX} y1={stemY1} x2={stemX} y2={stemY2}
        stroke="black" strokeWidth={1.5}
      />

      {/* Notehead */}
      {headType === 'normal' && <NormalHead x={NOTE_X} y={y} />}
      {headType === 'x' && <XHead x={NOTE_X} y={y} />}
      {headType === 'open_x' && <OpenXHead x={NOTE_X} y={y} />}
      {headType === 'ghost' && <GhostHead x={NOTE_X} y={y} />}

      {/* Accent mark (crash cymbal) — above notehead */}
      {hasAccent && (
        <text
          x={NOTE_X - 7} y={y - 12}
          fontSize="14" fill="black"
          fontFamily="Georgia, serif" fontWeight="bold"
        >
          &gt;
        </text>
      )}

      {/* Open hi-hat circle mark — above notehead */}
      {hasOpenMark && (
        <text
          x={NOTE_X - 4} y={y - 12}
          fontSize="11" fill="black"
          fontFamily="Georgia, serif"
        >
          o
        </text>
      )}
    </g>
  )
}

export function DrumStaff({ noteData }) {
  return (
    <svg
      viewBox="0 0 320 120"
      className="drum-staff"
      aria-label={`Drum notation showing ${noteData.name}`}
    >
      {/* White card background */}
      <rect x="0" y="0" width="320" height="120" fill="white" />

      {/* 5 staff lines */}
      {STAFF_LINES.map((ly, i) => (
        <line key={i}
          x1={STAFF_X_START} y1={ly} x2={STAFF_X_END} y2={ly}
          stroke="black" strokeWidth={1.3}
        />
      ))}

      {/* Percussion clef: two thick vertical bars */}
      <rect
        x={STAFF_X_START + 2} y={STAFF_LINES[0]}
        width={5} height={STAFF_LINES[4] - STAFF_LINES[0]}
        fill="black"
      />
      <rect
        x={STAFF_X_START + 11} y={STAFF_LINES[0]}
        width={5} height={STAFF_LINES[4] - STAFF_LINES[0]}
        fill="black"
      />

      {/* The drum note */}
      <Note noteData={noteData} />
    </svg>
  )
}
