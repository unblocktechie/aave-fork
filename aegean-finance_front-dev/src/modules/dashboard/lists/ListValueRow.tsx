import { Box } from '@mui/material';
import { ReactNode } from 'react';

import { FormattedNumber } from '../../../components/primitives/FormattedNumber';
import { Row } from '../../../components/primitives/Row';

interface ListValueRowProps {
  title: ReactNode;
  capsComponent?: ReactNode;
  value: string | number;
  subValue: string | number;
  disabled?: boolean;
  color?: string;
}

export const ListValueRow = ({
  title,
  capsComponent,
  value,
  subValue,
  disabled,
  color = 'text.primary',
}: ListValueRowProps) => {
  return (
    <Row caption={title} captionVariant="description" align="flex-start" mb={2}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <FormattedNumber
            value={value}
            variant="secondary14"
            color={disabled ? 'text.disabled' : color}
          />
          {capsComponent}
        </Box>

        {!disabled && (
          <FormattedNumber
            value={subValue}
            variant="secondary12"
            color={color}
            symbol="USD"
            mb={0.5}
          />
        )}
      </Box>
    </Row>
  );
};
