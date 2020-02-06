import React from 'react';
import classNames from 'classnames';

const Cell = ({ cell, row, column }) => {
  const { value, className } = cell;
  if (cell.className !== 'move-to-merge') {
    cell.row = row;
    cell.column = column;
  }

  const cellClass = classNames({
    cell: true,
    [`grid__cell--${cell.row}-${cell.column}`]: cell.className !== 'empty',
    [`cell--${className}`]: className,
    [`cell--${value}`]: value > 2 && value <= 2048,
    'cell--over-2048': value > 2048,
  });

  return <div className={cellClass}>{value ? value : ''}</div>;
};

export default Cell;
