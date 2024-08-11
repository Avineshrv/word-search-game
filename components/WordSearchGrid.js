import React from 'react';

const WordSearchGrid = ({
  grid,
  selectedCells,
  getCellClass,
  onCellMouseDown,
  onCellMouseOver,
  onMouseUp
}) => {
  return (
    <div className="grid grid-arrangement gap-1 p-4 w-fit mx-auto" onMouseUp={onMouseUp}>
      {grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={getCellClass(rowIndex, colIndex)}
            onMouseDown={() => onCellMouseDown(rowIndex, colIndex)}
            onMouseOver={() => onCellMouseOver(rowIndex, colIndex)}
          >
            {letter}
          </div>
        ))
      )}
    </div>
  );
};

export default WordSearchGrid;
