import React from 'react'

const NewGameButton = ({ newGame }) => {
  return (
    <button onClick={newGame} className="button button--new-game game__button">
      New Game
    </button>
  )
}

export default NewGameButton
