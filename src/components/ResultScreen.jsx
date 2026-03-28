import { LEVELS } from '../data/drumData.js'

export function ResultScreen({ result, onReplay, onMenu, onNextLevel }) {
  const { score, correctCount, totalQuestions, maxStreak, levelId, isNewHigh, passingScore } = result
  const accuracy = Math.round((correctCount / totalQuestions) * 100)
  const passed = score >= passingScore
  const currentLevel = LEVELS.find(l => l.id === levelId)
  const nextLevel = LEVELS.find(l => l.id === levelId + 1)

  const grade = accuracy >= 90 ? 'S' : accuracy >= 75 ? 'A' : accuracy >= 60 ? 'B' : accuracy >= 45 ? 'C' : 'D'
  const gradeColor = { S: '#f39c12', A: '#2ecc71', B: '#3498db', C: '#9b59b6', D: '#e74c3c' }[grade]

  return (
    <div className="screen result-screen">
      <div className="result-header">
        <div className="result-emoji">
          {passed ? '🎉' : accuracy >= 50 ? '💪' : '😤'}
        </div>
        <h2>{passed ? 'Round Complete!' : 'Keep Practising!'}</h2>
        {isNewHigh && <div className="new-high-badge">🏆 New High Score!</div>}
      </div>

      <div className="result-score-display">
        <div className="result-score">{score.toLocaleString()}</div>
        <div className="result-score-label">points</div>
      </div>

      <div className="result-stats">
        <div className="stat-card">
          <div className="stat-grade" style={{ color: gradeColor }}>{grade}</div>
          <div className="stat-label">Grade</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{correctCount}/{totalQuestions}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🔥{maxStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      {passed && nextLevel && (
        <div className="unlock-banner">
          <span>🔓</span> {nextLevel.name} unlocked!
        </div>
      )}

      {!passed && (
        <div className="pass-target">
          Score {passingScore.toLocaleString()} to unlock the next level
          &nbsp;({score.toLocaleString()} / {passingScore.toLocaleString()})
        </div>
      )}

      <div className="result-actions">
        {passed && nextLevel && (
          <button className="btn btn-primary" onClick={onNextLevel}>
            Next Level {nextLevel.emoji}
          </button>
        )}
        <button className="btn btn-secondary" onClick={onReplay}>
          🔄 Play Again
        </button>
        <button className="btn btn-ghost" onClick={onMenu}>
          ← Level Select
        </button>
      </div>

      <div className="result-level-name">
        {currentLevel.emoji} {currentLevel.name} — {currentLevel.subtitle}
      </div>
    </div>
  )
}
