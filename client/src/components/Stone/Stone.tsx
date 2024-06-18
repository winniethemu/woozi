import { StoneType } from '../../types';

import styles from './Stone.module.css';

export interface StoneProps {
  type: StoneType;
}

export default function Stone({ type }: StoneProps) {
  return <div className={styles.stone} style={{ backgroundColor: type }} />;
}
