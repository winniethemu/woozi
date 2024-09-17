import React from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Box, Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useCopyToClipboard, useReadLocalStorage } from 'usehooks-ts';

import { BOARD_SIZE, TIME_TO_MOVE, USER_ID_KEY } from '../../consts';
import { Board } from '../../components';
import {
  GameBoard,
  GameData,
  GameStatus,
  MessageType,
  Move,
  StoneType,
} from '../../types';
import { range } from '../../utils';
import { useSocket } from '../../contexts/SocketContext';

const emptyBoard = range(BOARD_SIZE).map(() => Array(BOARD_SIZE).fill(''));

export default function Game() {
  const { state } = useLocation();
  const [game, setGame] = React.useState<GameData>(state);
  const [board, setBoard] = React.useState<GameBoard>(emptyBoard);
  const [showShareCodeModal, setShowShareCodeModal] = React.useState(
    game.status === GameStatus.PENDING
  );
  const [showUndoModal, setShowUndoModal] = React.useState(false);
  const [clock, setClock] = React.useState<[number, number]>([
    TIME_TO_MOVE, // my clock
    TIME_TO_MOVE, // opponent's clock
  ]);
  const timerRef = React.useRef<number>();
  const [, copy] = useCopyToClipboard();
  const socket = useSocket();
  const userId = useReadLocalStorage<string>(USER_ID_KEY);
  const me = game.players.find((player) => player.userId === userId);
  if (!me) {
    throw new Error('Player not found');
  }

  const resetClock = () => {
    if (timerRef.current) {
      setClock([TIME_TO_MOVE, TIME_TO_MOVE]);
      clearInterval(timerRef.current);
    }
  };

  const handleCopyCode = () => {
    copy(state.code).then(() => {
      setShowShareCodeModal(false);
    });
  };

  const handleMyMove = (row: number, col: number) => {
    // TODO: visual indication?
    if (board[row][col] !== '' || game.turn !== me.color) return;

    resetClock();

    const nextBoard = structuredClone(board);
    nextBoard[row][col] = me!.color;
    setBoard(nextBoard);

    const move: Move = {
      player: me,
      position: [row, col],
    };

    const nextGame = structuredClone(game);
    nextGame.moves.push(move);
    setGame(nextGame);

    socket.emit(MessageType.PLACE_STONE, {
      code: game.code,
      move,
      board: nextBoard,
    });
    // TODO: handle failure
  };

  const handleOpponentMove = React.useCallback((move: Move) => {
    resetClock();

    const [row, col] = move.position;
    setBoard((currBoard: (StoneType | '')[][]) => {
      const nextBoard = structuredClone(currBoard);
      nextBoard[row][col] = move.player.color;
      return nextBoard;
    });
    setGame((currGame: GameData) => {
      const nextGame = structuredClone(currGame);
      nextGame.moves.push(move);
      return nextGame;
    });
  }, []);

  const handleSyncGame = React.useCallback(
    (data: Omit<GameData, 'moves'>) => {
      resetClock();
      if (data.status === GameStatus.COMPLETED) {
        // TODO: redirect to a different page
        // TODO: send message so server can clean up (e.g. delete game)
        console.log(`Game over, ${data.winner!.color} won!`);
        return;
      }

      timerRef.current = setInterval(() => {
        setClock((currClock) => {
          if (data.turn === me.color) {
            if (currClock[0] - 1 <= 0) {
              socket.emit(MessageType.TIME_OUT, {
                player: me,
                game,
              });
            }
            return [currClock[0] - 1, currClock[1]];
          } else {
            return [currClock[0], currClock[1] - 1];
          }
        });
      }, 1000);

      setGame((currGame: GameData) => {
        const nextGame = Object.assign({}, currGame, data);
        return nextGame;
      });
    },
    [game, me, socket]
  );

  React.useEffect(() => {
    socket.emit(MessageType.JOIN_GAME, game);
  }, []);

  React.useEffect(() => {
    socket.on(MessageType.SYNC_GAME, (data) => handleSyncGame(data));
    socket.on(MessageType.PLACE_STONE, (move) => handleOpponentMove(move));
    socket.on(MessageType.REQUEST_UNDO, () => setShowUndoModal(true));
    socket.on(MessageType.PERFORM_UNDO, (move) => {
      setBoard((currBoard) => {
        const [row, col] = move.position;
        const nextBoard = structuredClone(currBoard);
        nextBoard[row][col] = '';
        return nextBoard;
      });
    });
    return () => {
      socket.off();
    };
  }, [socket, game.code, handleSyncGame, handleOpponentMove]);

  return (
    <div>
      <Text as="p">Welcome to the game {state.code}!</Text>
      <Text as="p">You're playing {me.color}</Text>
      <Text as="p">Current turn: {game.turn}</Text>
      <Text as="p">Your clock: {clock[0]}</Text>
      <Text as="p">Opponent's clock: {clock[1]}</Text>
      <button
        style={{ margin: '5px 0' }}
        onClick={() => {
          socket.emit(MessageType.REQUEST_UNDO, {
            code: game.code,
          });
          resetClock();
        }}
        disabled={game.turn === me.color || game.moves.length < 1}
      >
        Undo Move
      </button>
      <Board data={board} handleMyMove={handleMyMove} />
      {createPortal(
        <Dialog.Root open={showShareCodeModal}>
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Share the Code</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Another player can use the code to join this game.
            </Dialog.Description>
            <Flex direction="row" gap="3">
              <Box width="100%">
                <TextField.Root defaultValue={state.code} disabled={true} />
              </Box>
              <Button onClick={handleCopyCode}>Copy</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>,
        document.body
      )}
      {createPortal(
        <Dialog.Root open={showUndoModal}>
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Takeback Request</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              The opponent has requested to take back the last move.
            </Dialog.Description>
            <Flex direction="row" gap="3">
              <Button
                onClick={() => {
                  socket.emit(MessageType.CONFIRM_UNDO, {
                    code: game.code,
                  });
                  setShowUndoModal(false);
                }}
              >
                Agree
              </Button>
              <Button onClick={() => setShowUndoModal(false)}>Deny</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>,
        document.body
      )}
    </div>
  );
}
