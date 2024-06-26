import React from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Box, Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useCopyToClipboard } from 'usehooks-ts';

import { Board } from '../../components';
import { BOARD_SIZE } from '../../consts';

export default function Game() {
  const { state } = useLocation();
  const { code, color } = state;
  const [, copy] = useCopyToClipboard();
  const [showShareCodeModal, setShowShareCodeModal] = React.useState(true);

  function handleCopyCode() {
    copy(code as string).then(() => {
      setShowShareCodeModal(false);
    });
  }

  return (
    <div>
      <Text>Welcome to the game {code}!</Text>
      <Board color={color} size={BOARD_SIZE} />
      {createPortal(
        <Dialog.Root open={showShareCodeModal}>
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Share the Code</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Another player can use the code to join this game.
            </Dialog.Description>
            <Flex direction="row" gap="3">
              <Box width="100%">
                <TextField.Root defaultValue={code} disabled={true} />
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
