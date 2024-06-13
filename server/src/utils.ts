import { ALPHA_NUM } from './consts.js';

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
