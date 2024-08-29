import React from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Box, Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useCopyToClipboard, useReadLocalStorage } from 'usehooks-ts';

import { Board } from '../../components';
import { BOARD_SIZE, USER_ID_KEY } from '../../consts';
import { GameData } from '../../types';

export default function Game() {
  const { state } = useLocation();
  const [data] = React.useState<GameData>(state);
  const [, copy] = useCopyToClipboard();
  const [showShareCodeModal, setShowShareCodeModal] = React.useState(true);
  const userId = useReadLocalStorage<string>(USER_ID_KEY);
  const me = data.players.find((player) => player.userId === userId);
  if (!me) {
    throw new Error('Player not found');
  }

  function handleCopyCode() {
    copy(data.code).then(() => {
      setShowShareCodeModal(false);
    });
  }

  return (
    <div>
      <Text>Welcome to the game {data.code}!</Text>
      <Board player={me} size={BOARD_SIZE} />
      {createPortal(
        <Dialog.Root open={showShareCodeModal}>
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Share the Code</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Another player can use the code to join this game.
            </Dialog.Description>
            <Flex direction="row" gap="3">
              <Box width="100%">
                <TextField.Root defaultValue={data.code} disabled={true} />
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
