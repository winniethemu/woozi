import React from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Box, Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useCopyToClipboard } from 'usehooks-ts';

import { Board } from '../../components';
import { BOARD_SIZE } from '../../consts';

export default function Game() {
  const { state } = useLocation();
  const [, copy] = useCopyToClipboard();
  const [showShareCodeModal, setShowShareCodeModal] = React.useState(true);

  function handleCopyCode() {
    copy(state.code).then(() => {
      setShowShareCodeModal(false);
    });
  }

  return (
    <div>
      <Text>Welcome to the game {state.code}!</Text>
      <Board size={BOARD_SIZE} game={state} />
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
