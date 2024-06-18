import { CellType } from '../../types';
import Cell from '../Cell/Cell';

export default function Board() {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <Cell type={CellType.TOP_LEFT_CORNER} />
      <Cell type={CellType.TOP_RIGHT_CORNER} />
      <Cell type={CellType.BOTTOM_LEFT_CORNER} />
      <Cell type={CellType.BOTTOM_RIGHT_CORNER} />
      <Cell type={CellType.TOP_EDGE} />
      <Cell type={CellType.RIGHT_EDGE} />
      <Cell type={CellType.BOTTOM_EDGE} />
      <Cell type={CellType.LEFT_EDGE} />
      <Cell type={CellType.MIDDLE} />
    </div>
  );
}
