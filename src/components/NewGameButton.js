import React from 'react'

const NewGameButton = ({ newGame, parent }) => {
  return (
    <button onClick={newGame} className={`button button--new-game ${parent}__button`}>
      New Game
    </button>
  )
}

export default NewGameButton
