import * as React from 'react';
import { LinodeBackup } from '@linode/api-v4/lib/linodes';
import ActionMenu, { Action } from 'src/components/ActionMenu';

interface Props {
  backup: LinodeBackup;
  disabled: boolean;
  onRestore: () => void;
  onDeploy: () => void;
}

export const LinodeBackupActionMenu = (props: Props) => {
  const { disabled, onDeploy, onRestore } = props;
  const disabledProps = {
    disabled,
    tooltip: disabled
      ? "You don't have permission to deploy from this Linode\u{2019}s backups"
      : undefined,
  };

  const actions: Action[] = [
    {
      onClick: () => {
        onRestore();
      },
      title: 'Restore to Existing Linode',
      ...disabledProps,
    },
    {
      onClick: () => {
        onDeploy();
      },
      title: 'Deploy New Linode',
      ...disabledProps,
    },
  ];

  return (
    <ActionMenu
      actionsList={actions}
      ariaLabel={`Action menu for Backup ${props.backup.label}`}
    />
  );
};
