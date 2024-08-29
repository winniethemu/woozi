import { CellType, StoneType } from '../../types';
import Stone from '../Stone/Stone';

import styles from './Cell.module.css';

export interface CellProps {
  occupied: StoneType | '';
  type: CellType;
  handlePlaceStone: () => void;
  isStar?: boolean;
  size?: number;
}

const pathConfig = {
  BOTTOM_EDGE: 'M0 50 h 100 M50 0 v 50',
  BOTTOM_LEFT_CORNER: 'M50 0 v 50 M50 50 h 50',
  BOTTOM_RIGHT_CORNER: 'M50 0 v 50 M50 50 h -50',
  LEFT_EDGE: 'M50 0 v 100 M50 50 h 50',
  RIGHT_EDGE: 'M50 0 v 100 M50 50 h -50',
  TOP_EDGE: 'M0 50 h 100 M50 50 v 50',
  TOP_LEFT_CORNER: 'M50 50 h 50 M50 50 v 50',
  TOP_RIGHT_CORNER: 'M50 50 h -50 M50 50 v 50',
  MIDDLE: 'M0 50 h 100 M50 0 v 100',
};

export default function Cell({
  type,
  handlePlaceStone,
  isStar,
  occupied,
  size = 40,
}: CellProps) {
  return (
    <div
      className={styles.container}
      style={{ width: size, height: size }}
      onClick={handlePlaceStone}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <path d={pathConfig[type]} stroke="black" strokeWidth={2} />
      </svg>
      {isStar && <div className={styles.star} />}
      {occupied && <Stone type={occupied} />}
    </div>
  );
}
