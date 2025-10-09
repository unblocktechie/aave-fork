import { XIcon } from '@heroicons/react/outline';
import { Box, IconButton, Modal, Paper, SvgIcon } from '@mui/material';
import React from 'react';

export interface BasicModalProps {
  open: boolean;
  children: React.ReactNode;
  setOpen: (value: boolean) => void;
  withCloseButton?: boolean;
  contentMaxWidth?: number;
  withCutRound?: boolean;
}

export const BasicModal = ({
  open,
  setOpen,
  withCloseButton = true,
  contentMaxWidth = 420,
  children,
  withCutRound,
  ...props
}: BasicModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '.MuiPaper-root': {
          outline: 'none',
          background: '#162148',
          borderRadius: '37px',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(10px)'
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...props}
      data-cy={'Modal'}
    >
      <Paper
        sx={{
          position: 'relative',
          margin: '10px',
          overflow: 'visible',
          width: '100%',
          maxWidth: { xs: '359px', xsm: `${contentMaxWidth}px` },
          maxHeight: 'calc(100vh - 10px)',
          p: 6,
        }}
      >
        {withCutRound && (
          <>
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              zIndex: 1000,
              height: '100px',
              backgroundColor: '#040917',
              borderRadius: '50%',
            }}
          ></div>
          </>
        )}
        {children}

        {withCloseButton && (
          <Box sx={{ position: 'absolute', top: '24px', right: '50px', zIndex: 5 }}>
            <IconButton
              sx={{
                borderRadius: '50%',
                p: 0,
                minWidth: 0,
                position: 'absolute',
                bgcolor: 'transparent',
              }}
              onClick={handleClose}
              data-cy={'close-button'}
            >
              <SvgIcon sx={{ fontSize: '28px', color: '#94A1CA' }}>
                <XIcon data-cy={'CloseModalIcon'} />
              </SvgIcon>
            </IconButton>
          </Box>
        )}
      </Paper>
    </Modal>
  );
};
