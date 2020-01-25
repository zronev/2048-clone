import React from 'react'

const Cell = ({ value }) => {
  return (
    <div
      className={`grid__cell 
      ${value ? '' : 'grid__cell--empty'} 
      ${value > 2 && value <= 2048 ? `grid__cell--${value}` : ''}
      ${value > 2048 ? `grid__cell--over-2048` : ''}`}
    >
      {value ? value : ''}
    </div>
  )
}

export default Cell
