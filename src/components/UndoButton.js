import React from 'react'

const UndoButton = ({ handleUndoClick }) => {
  return (
    <button onClick={handleUndoClick} className="button game-info__undo">
      Undo
    </button>
  )
}

export default UndoButton
