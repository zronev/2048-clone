import React from 'react'

const Score = ({ score, bestScore }) => {
  return (
    <div className="score-bar">
      <span className="score">
        <span className="score__title">Score</span>
        <span className="score__number">{score}</span>
      </span>
      <span className="score score--best">
        <span className="score__title">Best</span>
        <span className="score__number">{bestScore}</span>
      </span>
    </div>
  )
}

export default Score
