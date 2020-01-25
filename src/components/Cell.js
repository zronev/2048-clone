import React from 'react'

const Cell = ({ value }) => {
  return (
    <div
      className={`grid__cell ${value ? '' : 'grid__cell--empty'} ${
        value > 2 ? `grid__cell--${value}` : ''
      }`}
    >
      {value ? value : ''}
    </div>
  )
}

export default Cell
