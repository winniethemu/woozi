import Cell from '../Cell/Cell';
import { CellType } from '../../types';
import { range } from '../../utils';

import styles from './Board.module.css';

export interface BoardProps {
  size: number;
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

export default function Board({ size }: BoardProps) {
  return (
    <div>
      {range(size).map((rowIndex) => (
        <div className={styles.row}>
          {range(size).map((colIndex) => {
            if (rowIndex + colIndex === 0) {
              return <Cell type={CellType.TOP_LEFT_CORNER} />;
            } else if (rowIndex === 0 && colIndex === size - 1) {
              return <Cell type={CellType.TOP_RIGHT_CORNER} />;
            } else if (rowIndex === size - 1 && colIndex === 0) {
              return <Cell type={CellType.BOTTOM_LEFT_CORNER} />;
            } else if (rowIndex === size - 1 && colIndex === size - 1) {
              return <Cell type={CellType.BOTTOM_RIGHT_CORNER} />;
            } else if (rowIndex === 0) {
              return <Cell type={CellType.TOP_EDGE} />;
            } else if (rowIndex === size - 1) {
              return <Cell type={CellType.BOTTOM_EDGE} />;
            } else if (colIndex === 0) {
              return <Cell type={CellType.LEFT_EDGE} />;
            } else if (colIndex === size - 1) {
              return <Cell type={CellType.RIGHT_EDGE} />;
            } else {
              return (
                <Cell
                  type={CellType.MIDDLE}
                  isStar={isStar(rowIndex, colIndex)}
                />
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}
