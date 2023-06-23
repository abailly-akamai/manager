import { Token } from '@linode/api-v4/lib/profile';
import * as React from 'react';
import ActionMenu, { Action } from 'src/components/ActionMenu';
import { useTheme } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import InlineMenuAction from 'src/components/InlineMenuAction';

interface Props {
  token: Token;
  type: string;
  isThirdPartyAccessToken: boolean;
  openViewDrawer: (token: Token) => void;
  openEditDrawer: (token: Token) => void;
  openRevokeDialog: (token: Token, type: string) => void;
}

export const APITokenMenu = (props: Props) => {
  const theme = useTheme<Theme>();
  const matchesSmDown = useMediaQuery(theme.breakpoints.down('md'));

  const {
    isThirdPartyAccessToken,
    openEditDrawer,
    openRevokeDialog,
    openViewDrawer,
    token,
    type,
  } = props;

  const actions = [
    {
      onClick: () => {
        openViewDrawer(token);
      },
      title: 'View Scopes',
    },
    !isThirdPartyAccessToken
      ? {
          onClick: () => {
            openEditDrawer(token);
          },
          title: 'Rename',
        }
      : null,
    {
      onClick: () => {
        openRevokeDialog(token, type);
      },
      title: 'Revoke',
    },
  ].filter(Boolean) as Action[];

  if (matchesSmDown) {
    return (
      <ActionMenu
        actionsList={actions}
        ariaLabel={`Action menu for API Token ${props.token.label}`}
      />
    );
  }

  return (
    <>
      {actions.map((action) => (
        <InlineMenuAction
          key={action.title}
          actionText={action.title}
          onClick={action.onClick}
        />
      ))}
    </>
  );
};
