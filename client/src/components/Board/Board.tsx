import Cell from '../Cell/Cell';
import { CellType, StoneType } from '../../types';
import { range } from '../../utils';

import styles from './Board.module.css';

export interface BoardProps {
  data: Array<Array<StoneType | ''>>;
  handleMyMove: (r: number, c: number) => void;
}

const starPoints = [
  [3, 3],
  [3, 11],
  [7, 7],
  [11, 3],
  [11, 11],
];

function isStar(row: number, col: number) {
  for (const [r, c] of starPoints) {
    if (row === r && col === c) return true;
  }
  return false;
}

export default function Board({ data, handleMyMove }: BoardProps) {
  const size = data.length;

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
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === 0 && colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.TOP_RIGHT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1 && colIndex === 0) {
              return (
                <Cell
                  type={CellType.BOTTOM_LEFT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1 && colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.BOTTOM_RIGHT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === 0) {
              return (
                <Cell
                  type={CellType.TOP_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1) {
              return (
                <Cell
                  type={CellType.BOTTOM_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            } else if (colIndex === 0) {
              return (
                <Cell
                  type={CellType.LEFT_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            } else if (colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.RIGHT_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            } else {
              return (
                <Cell
                  type={CellType.MIDDLE}
                  isStar={isStar(rowIndex, colIndex)}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={data[rowIndex][colIndex]}
                />
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}
