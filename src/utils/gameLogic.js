export function generateQuestions(level) {
  const pool = level.notes
  const questions = []
  while (questions.length < level.questionsPerRound) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    questions.push(...shuffled)
  }
  return questions.slice(0, level.questionsPerRound)
}

export function generateChoices(correctId, levelNotes, choiceCount) {
  const others = levelNotes.filter(id => id !== correctId)
  const shuffled = others.sort(() => Math.random() - 0.5)
  const choices = [correctId, ...shuffled.slice(0, choiceCount - 1)]
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
