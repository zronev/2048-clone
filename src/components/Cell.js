import React from 'react'

const Cell = ({ cell }) => {
  const {value, className} = cell

  return (
    <div
      className={`grid__cell grid__cell--${className}
      ${value > 2 && value <= 2048 ? `grid__cell--${value}` : ''}
      ${value > 2048 ? `grid__cell--over-2048` : ''}`}
    >
      {value ? value : ''}
    </div>
  )
}

export default Cell
