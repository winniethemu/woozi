import React from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Box, Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useCopyToClipboard, useReadLocalStorage } from 'usehooks-ts';

import { BOARD_SIZE, USER_ID_KEY } from '../../consts';
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
  const [, copy] = useCopyToClipboard();
  const socket = useSocket();
  const userId = useReadLocalStorage<string>(USER_ID_KEY);
  const me = game.players.find((player) => player.userId === userId);
  if (!me) {
    throw new Error('Player not found');
  }

  const handleCopyCode = () => {
    copy(state.code).then(() => {
      setShowShareCodeModal(false);
    });
  };

  const handleMyMove = (row: number, col: number) => {
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
  };

  const handleOpponentMove = React.useCallback((move: Move) => {
    const [row, col] = move.position;
    setBoard((currBoard: (StoneType | '')[][]) => {
      const nextBoard = structuredClone(currBoard);
      nextBoard[row][col] = move.player.color;
      return nextBoard;
    });
  }, []);

  React.useEffect(() => {
    socket.emit(MessageType.JOIN_ROOM, game.code);
    socket.on(MessageType.PLACE_STONE, (move) => handleOpponentMove(move));
    return () => {
      socket.off();
    };
  }, [socket, game.code, handleOpponentMove]);

  return (
    <div>
      <Text>Welcome to the game {state.code}!</Text>
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
    </div>
  );
}
