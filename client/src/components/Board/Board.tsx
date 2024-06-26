import React from 'react';

import Cell from '../Cell/Cell';
import { CellType } from '../../types';
import { range } from '../../utils';

import styles from './Board.module.css';
import { BOARD_SIZE } from '../../consts';

export interface BoardProps {
  color: string;
  size: number;
}

const starPoints = [
  [3, 3],
  [3, 11],
  [7, 7],
  [11, 3],
  [11, 11],
];

const emptyBoard = range(BOARD_SIZE).map(() => Array(BOARD_SIZE).fill(''));

function isStar(row: number, col: number) {
  for (const [r, c] of starPoints) {
    if (row === r && col === c) return true;
  }
  return false;
}

export default function Board({ color, size }: BoardProps) {
  const [board, setBoard] = React.useState(emptyBoard);

  function handlePlaceStone(row: number, col: number) {
    const nextBoard = structuredClone(board);
    nextBoard[row][col] = color;
    setBoard(nextBoard);
  }

  return (
    <div>
      {range(size).map((rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {range(size).map((colIndex) => {
            if (rowIndex + colIndex === 0) {
              return (
                <Cell
                  type={CellType.TOP_LEFT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === 0 && colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.TOP_RIGHT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1 && colIndex === 0) {
              return (
                <Cell
                  type={CellType.BOTTOM_LEFT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1 && colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.BOTTOM_RIGHT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === 0) {
              return (
                <Cell
                  type={CellType.TOP_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1) {
              return (
                <Cell
                  type={CellType.BOTTOM_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (colIndex === 0) {
              return (
                <Cell
                  type={CellType.LEFT_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.RIGHT_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else {
              return (
                <Cell
                  type={CellType.MIDDLE}
                  isStar={isStar(rowIndex, colIndex)}
                  key={`${rowIndex}:${colIndex}`}
                  handlePlaceStone={() => handlePlaceStone(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}
