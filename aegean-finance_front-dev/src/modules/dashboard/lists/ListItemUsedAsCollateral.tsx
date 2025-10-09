import { Switch } from '@mui/material';
import React from 'react';

import { ListItemIsolationBadge } from './ListItemIsolationBadge';

interface ListItemUsedAsCollateralProps {
  isIsolated: boolean;
  usageAsCollateralEnabledOnUser: boolean;
  canBeEnabledAsCollateral: boolean;
  onToggleSwitch: () => void;
  // directly disable without additional canBeEnabledAsCollateral check for migration page
  disabled?: boolean;
}

export const ListItemUsedAsCollateral = ({
  isIsolated,
  usageAsCollateralEnabledOnUser,
  canBeEnabledAsCollateral,
  onToggleSwitch,
  disabled,
}: ListItemUsedAsCollateralProps) => {
  const isEnabled = usageAsCollateralEnabledOnUser && canBeEnabledAsCollateral;
  return (
    <>
      {!isIsolated ? (
        <Switch
          onClick={(e) => {
            e.stopPropagation();
            onToggleSwitch();
          }}
          disableRipple
          checked={isEnabled}
          disabled={!canBeEnabledAsCollateral || disabled}
        />
      ) : (
        <ListItemIsolationBadge>
          <Switch
            onClick={(e) => {
              e.stopPropagation();
              onToggleSwitch();
            }}
            disableRipple
            checked={isEnabled}
            disabled={!canBeEnabledAsCollateral || disabled}
          />
        </ListItemIsolationBadge>
      )}
    </>
  );
};
