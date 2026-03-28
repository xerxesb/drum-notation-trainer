import { LEVELS } from '../data/drumData.js'

export function StartScreen({ highScores, onStartLevel, unlockedLevel }) {
  return (
    <div className="screen start-screen">
      <div className="start-header">
        <div className="drum-icon">🥁</div>
        <h1>Drum Notation<br />Trainer</h1>
        <p className="tagline">Read the score. Nail the beat.</p>
      </div>

      <div className="levels-list">
        {LEVELS.map((level) => {
          const isLocked = level.id > unlockedLevel
          const hs = highScores[level.id]
          const isPassed = hs && hs >= level.passingScore

          return (
            <button
              key={level.id}
              className={`level-card ${isLocked ? 'locked' : ''} ${isPassed ? 'passed' : ''}`}
              onClick={() => !isLocked && onStartLevel(level.id)}
              disabled={isLocked}
              aria-label={isLocked ? `${level.name} - locked` : `Start ${level.name}`}
            >
              <div className="level-card-top">
                <span className="level-emoji">{isLocked ? '🔒' : level.emoji}</span>
                <div className="level-info">
                  <div className="level-name">{level.name}</div>
                  <div className="level-subtitle">{level.subtitle}</div>
                </div>
                <div className="level-meta">
                  <div className="level-stat">{level.notes.length} notes</div>
                  <div className="level-stat">{level.timeLimit}s / Q</div>
                </div>
              </div>
              <div className="level-desc">{level.description}</div>
              {hs != null && (
                <div className="level-score">
                  Best: <strong>{hs.toLocaleString()}</strong>
                  {isPassed && <span className="pass-badge"> ✓ Passed</span>}
                  {!isPassed && (
                    <span className="pass-hint"> (need {level.passingScore.toLocaleString()} to unlock next)</span>
                  )}
                </div>
              )}
              {hs == null && !isLocked && (
                <div className="level-score no-score">Not played yet</div>
              )}
            </button>
          )
        })}
      </div>

      <p className="credits">Tap a level to start · High scores saved locally</p>
    </div>
  )
}
