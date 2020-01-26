import React from 'react'
import NewGameButton from './NewGameButton'

const ModalLost = ({ isOpen, newGame }) => {
  return (
    <div className={`modal ${isOpen ? 'modal--open' : ''}`}>
      <h3 className="modal__title">You lost...</h3>
      <NewGameButton newGame={newGame} parent="modal" />
    </div>
  )
}

export default ModalLost
