import { useState, useEffect, useCallback, useRef } from 'react'
import { DRUM_NOTES, LEVELS } from '../data/drumData.js'
import { DrumStaff } from './DrumStaff.jsx'
import {
  generateQuestions,
  generateChoices,
  calculatePoints,
  getStreakMultiplier,
  saveHighScore,
} from '../utils/gameLogic.js'

const FEEDBACK_DURATION = 1600 // ms to show correct/wrong before next question

export function GameScreen({ levelId, onFinish }) {
  const level = LEVELS.find(l => l.id === levelId)
  const [questions] = useState(() => generateQuestions(level))
  const [qIndex, setQIndex] = useState(0)
  const [choices, setChoices] = useState([])
  const [timeLeft, setTimeLeft] = useState(level.timeLimit)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | { correct: bool, selectedId, correctId, points }
  const [gameOver, setGameOver] = useState(false)
  const timerRef = useRef(null)

  const currentNoteId = questions[qIndex]
  const currentNote = DRUM_NOTES[currentNoteId]

  // Generate choices whenever question changes
  useEffect(() => {
    setChoices(generateChoices(currentNoteId, level.notes, level.choiceCount))
    setTimeLeft(level.timeLimit)
    setFeedback(null)
  }, [qIndex, currentNoteId, level])

  // Countdown timer
  useEffect(() => {
    if (feedback || gameOver) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(null) // timeout = wrong
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [qIndex, feedback, gameOver]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback((selectedId) => {
    clearInterval(timerRef.current)
    const correct = selectedId === currentNoteId
    const pts = correct
      ? calculatePoints(timeLeft, level.timeLimit, level.pointsPerCorrect, streak)
      : 0

    const newStreak = correct ? streak + 1 : 0
    const newScore = score + pts
    const newCorrectCount = correct ? correctCount + 1 : correctCount

    setFeedback({ correct, selectedId, correctId: currentNoteId, points: pts })
    setScore(newScore)
    setStreak(newStreak)
    setMaxStreak(s => Math.max(s, newStreak))
    setCorrectCount(newCorrectCount)

    setTimeout(() => {
      const nextIndex = qIndex + 1
      if (nextIndex >= questions.length) {
        const isNewHigh = saveHighScore(levelId, newScore)
        setGameOver(true)
        onFinish({
          score: newScore,
          correctCount: newCorrectCount,
          totalQuestions: questions.length,
          maxStreak: Math.max(maxStreak, newStreak),
          levelId,
          isNewHigh,
          passingScore: level.passingScore,
        })
      } else {
        setQIndex(nextIndex)
      }
    }, FEEDBACK_DURATION)
  }, [currentNoteId, timeLeft, streak, score, correctCount, qIndex, questions.length,
    levelId, level, maxStreak, onFinish])

  if (gameOver) return null

  const timerPct = (timeLeft / level.timeLimit) * 100
  const timerWarning = timeLeft <= 4
  const multiplier = getStreakMultiplier(streak)

  return (
    <div className="screen game-screen">
      {/* Header */}
      <div className="game-header">
        <div className="game-header-left">
          <div className="level-label">{level.emoji} {level.name}</div>
          <div className="question-counter">{qIndex + 1} / {questions.length}</div>
        </div>
        <div className="game-header-right">
          {streak >= 3 && (
            <div className="streak-badge">
              🔥 ×{multiplier.toFixed(1)}
            </div>
          )}
          <div className="score-display">{score.toLocaleString()}</div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="timer-track">
        <div
          className={`timer-bar ${timerWarning ? 'warning' : ''}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>
      <div className={`timer-number ${timerWarning ? 'warning' : ''}`}>{timeLeft}s</div>

      {/* Notation card */}
      <div className={`notation-card ${feedback ? (feedback.correct ? 'card-correct' : 'card-wrong') : ''}`}>
        <DrumStaff noteData={currentNote} />
      </div>

      {/* Prompt */}
      <div className="question-prompt">
        {feedback ? (
          feedback.correct ? (
            <span className="feedback-correct">
              ✓ {DRUM_NOTES[feedback.correctId].name}
              {feedback.points > 0 && <span className="points-earned"> +{feedback.points}</span>}
            </span>
          ) : (
            <span className="feedback-wrong">
              ✗ That was the <strong>{DRUM_NOTES[feedback.correctId].name}</strong>
            </span>
          )
        ) : (
          'What drum element is this?'
        )}
      </div>

      {/* Answer description shown after feedback */}
      {feedback && (
        <div className="feedback-desc">
          {DRUM_NOTES[feedback.correctId].description}
        </div>
      )}

      {/* Choice buttons */}
      <div className={`choices-grid choices-${level.choiceCount}`}>
        {choices.map(id => {
          let btnClass = 'choice-btn'
          if (feedback) {
            if (id === feedback.correctId) btnClass += ' reveal-correct'
            else if (id === feedback.selectedId) btnClass += ' reveal-wrong'
          }
          return (
            <button
              key={id}
              className={btnClass}
              onClick={() => !feedback && handleAnswer(id)}
              disabled={!!feedback}
            >
              <span className="choice-short">{DRUM_NOTES[id].shortName}</span>
              <span className="choice-name">{DRUM_NOTES[id].name}</span>
            </button>
          )
        })}
      </div>

      {/* Streak info */}
      {streak > 0 && !feedback && (
        <div className="streak-info">
          {streak >= 3
            ? `🔥 ${streak} streak — ${multiplier.toFixed(1)}× multiplier!`
            : `${streak} in a row — keep going!`}
        </div>
      )}
    </div>
  )
}
