import { ALPHA_NUM } from './consts.js';
import { StoneType } from './types.js';

function random(max: number, min = 0): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function createGameCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    const char = ALPHA_NUM[random(ALPHA_NUM.length)];
    code += char;
  }
  return code;
}

export function randomColor() {
  const colors = [StoneType.BLACK, StoneType.WHITE];
  const index = random(2);
  return colors[index];
}
