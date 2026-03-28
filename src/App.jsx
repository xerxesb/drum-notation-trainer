import { useState, useCallback } from 'react'
import { StartScreen } from './components/StartScreen.jsx'
import { GameScreen } from './components/GameScreen.jsx'
import { ResultScreen } from './components/ResultScreen.jsx'
import { loadHighScores } from './utils/gameLogic.js'
import { LEVELS } from './data/drumData.js'

function getUnlockedLevel(highScores) {
  // Level 1 is always unlocked. Each subsequent level unlocks when previous is passed.
  let unlocked = 1
  for (const level of LEVELS) {
    const hs = highScores[level.id]
    if (hs != null && hs >= level.passingScore) {
      unlocked = Math.min(level.id + 1, LEVELS.length)
    } else {
      break
    }
  }
  return unlocked
}

export default function App() {
  const [screen, setScreen] = useState('start') // 'start' | 'game' | 'result'
  const [selectedLevelId, setSelectedLevelId] = useState(null)
  const [gameResult, setGameResult] = useState(null)
  const [highScores, setHighScores] = useState(loadHighScores)

  const handleStartLevel = useCallback((levelId) => {
    setSelectedLevelId(levelId)
    setScreen('game')
  }, [])

  const handleGameFinish = useCallback((result) => {
    setHighScores(loadHighScores())
    setGameResult(result)
    setScreen('result')
  }, [])

  const handleReplay = useCallback(() => {
    setScreen('game')
  }, [])

  const handleMenu = useCallback(() => {
    setScreen('start')
  }, [])

  const handleNextLevel = useCallback(() => {
    const nextId = selectedLevelId + 1
    if (nextId <= LEVELS.length) {
      setSelectedLevelId(nextId)
      setScreen('game')
    }
  }, [selectedLevelId])

  const unlockedLevel = getUnlockedLevel(highScores)

  return (
    <div className="app">
      {screen === 'start' && (
        <StartScreen
          highScores={highScores}
          unlockedLevel={unlockedLevel}
          onStartLevel={handleStartLevel}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          key={`${selectedLevelId}-${Date.now()}`}
          levelId={selectedLevelId}
          onFinish={handleGameFinish}
        />
      )}
      {screen === 'result' && gameResult && (
        <ResultScreen
          result={gameResult}
          onReplay={handleReplay}
          onMenu={handleMenu}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  )
}
