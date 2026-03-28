export function generateQuestions(level) {
  const pool = level.notes
  const questions = []
  while (questions.length < level.questionsPerRound) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    questions.push(...shuffled)
  }
  return questions.slice(0, level.questionsPerRound)
}

// Visual twins: notes that look identical on the staff and must always appear
// together in the choices so the player can actually distinguish them.
const VISUAL_TWINS = {
  snare: 'ghost_snare',
  ghost_snare: 'snare',
  hihat_closed: 'hihat_open',
  hihat_open: 'hihat_closed',
}

export function generateChoices(correctId, levelNotes, choiceCount) {
  const twin = VISUAL_TWINS[correctId]
  // Always include the twin if it's in the level's note pool
  const mustInclude = twin && levelNotes.includes(twin) ? [twin] : []
  const others = levelNotes.filter(id => id !== correctId && !mustInclude.includes(id))
  const shuffled = others.sort(() => Math.random() - 0.5)
  const fillerCount = choiceCount - 1 - mustInclude.length
  const choices = [correctId, ...mustInclude, ...shuffled.slice(0, fillerCount)]
  return choices.sort(() => Math.random() - 0.5)
}

export function getStreakMultiplier(streak) {
  if (streak >= 10) return 3.0
  if (streak >= 5) return 2.0
  if (streak >= 3) return 1.5
  return 1.0
}

export function calculatePoints(timeLeft, timeLimit, basePoints, streak) {
  const multiplier = getStreakMultiplier(streak)
  const speedBonus = Math.floor((timeLeft / timeLimit) * basePoints * 0.5)
  return Math.floor((basePoints + speedBonus) * multiplier)
}

export function loadHighScores() {
  try {
    return JSON.parse(localStorage.getItem('drumHighScores') || '{}')
  } catch {
    return {}
  }
}

export function saveHighScore(levelId, score) {
  const scores = loadHighScores()
  if (!scores[levelId] || score > scores[levelId]) {
    scores[levelId] = score
    localStorage.setItem('drumHighScores', JSON.stringify(scores))
    return true // new high score
  }
  return false
}
