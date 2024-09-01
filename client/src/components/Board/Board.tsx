import React from 'react';

import Cell from '../Cell/Cell';
import { BOARD_SIZE, USER_ID_KEY } from '../../consts';
import { CellType, GameData, MessageType, Move, StoneType } from '../../types';
import { range } from '../../utils';
import { useSocket } from '../../contexts/SocketContext';

import styles from './Board.module.css';
import { useReadLocalStorage } from 'usehooks-ts';

export interface BoardProps {
  game: GameData;
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

export default function Board({ game, size }: BoardProps) {
  const [board, setBoard] = React.useState<(StoneType | '')[][]>(emptyBoard);
  const socket = useSocket();
  const userId = useReadLocalStorage<string>(USER_ID_KEY);
  const me = game.players.find((player) => player.userId === userId);

  const handleOpponentMove = React.useCallback(
    (move: Move) => {
      const [row, col] = move.position;
      const nextBoard = structuredClone(board);
      nextBoard[row][col] = move.player.color;
      setBoard(nextBoard);
    },
    [board]
  );

  React.useEffect(() => {
    socket.emit(MessageType.JOIN_ROOM, game.code);
    socket.on(MessageType.PLACE_STONE, (move) => handleOpponentMove(move));
    return () => {
      socket.off();
    };
  }, [socket, game.code, handleOpponentMove]);

  if (!me) {
    throw new Error('Player not found');
  }

  function handleMyMove(row: number, col: number) {
    const nextBoard = structuredClone(board);
    nextBoard[row][col] = me!.color;
    setBoard(nextBoard);

    const move = {
      player: me,
      position: [row, col],
    };

    socket.emit(MessageType.PLACE_STONE, {
      code: game.code,
      move,
    });
    // TODO: handle failure
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
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === 0 && colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.TOP_RIGHT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1 && colIndex === 0) {
              return (
                <Cell
                  type={CellType.BOTTOM_LEFT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1 && colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.BOTTOM_RIGHT_CORNER}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === 0) {
              return (
                <Cell
                  type={CellType.TOP_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (rowIndex === size - 1) {
              return (
                <Cell
                  type={CellType.BOTTOM_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (colIndex === 0) {
              return (
                <Cell
                  type={CellType.LEFT_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else if (colIndex === size - 1) {
              return (
                <Cell
                  type={CellType.RIGHT_EDGE}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
                  occupied={board[rowIndex][colIndex]}
                />
              );
            } else {
              return (
                <Cell
                  type={CellType.MIDDLE}
                  isStar={isStar(rowIndex, colIndex)}
                  key={`${rowIndex}:${colIndex}`}
                  handleMove={() => handleMyMove(rowIndex, colIndex)}
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
