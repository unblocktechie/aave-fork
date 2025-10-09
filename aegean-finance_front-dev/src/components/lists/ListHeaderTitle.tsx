import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useRootStore } from 'src/store/root';

import { MARKETS } from '../../utils/mixPanelEvents';

interface ListHeaderTitleProps {
  sortName?: string;
  sortDesc?: boolean;
  sortKey?: string;
  source?: string;
  setSortName?: (value: string) => void;
  setSortDesc?: (value: boolean) => void;
  onClick?: () => void;
  children: ReactNode;
  isFirst?: boolean;
}

export const ListHeaderTitle = ({
  sortName,
  sortDesc,
  sortKey,
  source,
  setSortName,
  setSortDesc,
  onClick,
  children,
  isFirst,
}: ListHeaderTitleProps) => {
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleSorting = (name: string) => {
    trackEvent(MARKETS.SORT, { sort_by: name, tile: source });
    setSortDesc && setSortDesc(false);
    setSortName && setSortName(name);
    if (sortName === name) {
      setSortDesc && setSortDesc(!sortDesc);
    }
  };

  return (
    <Typography
      component="div"
      variant="subheader2"
      color="text.secondary"
      noWrap
      onClick={() => (!!onClick ? onClick() : !!sortKey && handleSorting(sortKey))}
      sx={{
        cursor: !!onClick || !!sortKey ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        borderBottom: !isFirst ? '1px solid' : 'none',
        borderStyle: !isFirst ? 'dashed' : 'none',
        borderRight: 'none',
        borderLeft: 'none',
        borderTop: 'none',
        borderColor: '#94A1CA',
      }}
    >
      {children}

      {!!sortKey && (
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            ml: 1,
          }}
        >
          <Box
            component="span"
            sx={(theme) => ({
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 4px 4px 4px',
              borderColor: `transparent transparent ${
                sortName === sortKey && sortDesc ? theme.palette.text.secondary : '#94A1CA'
              } transparent`,
              mb: 0.5,
            })}
          />
          <Box
            component="span"
            sx={(theme) => ({
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '4px 4px 0 4px',
              borderColor: `${
                sortName === sortKey && !sortDesc ? theme.palette.text.secondary : '#94A1CA'
              } transparent transparent transparent`,
            })}
          />
        </Box>
      )}
    </Typography>
  );
};
