import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import type { APIError } from '@linode/api-v4';
import type { UseQueryResult } from '@tanstack/react-query';

export type DataNotFound = 'Not Found' | undefined;

interface Props<TEntity> {
  /**
   * The query hook to fetch the entity.
   */
  queryHook: UseQueryResult<TEntity, APIError[]>;
}

/**
 * This hook is used to fetch data for a dialog routed via Tanstack Router (Drawer, Modal, etc.)
 *
 * It can't be used outside of a feature that hasn't been migrated to Tanstack Router.
 * It will return the data for the entity that the dialog is going to target, including its loading state.
 * It is usually used on a feature landing page, where the dialog is triggered by a route change.
 * Its purpose is to handle some internal logic for displaying helpful notifications and redirect when the entity is not found,
 * as providing a common API to route dialogs.
 * Because of the way our modals and drawers are mounted, handling not found content is critical when routing dialogs.
 */
export const useValidateDialogData = <TEntity>({
  queryHook,
}: Props<TEntity>) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isNotFound, setIsNotFound] = React.useState<DataNotFound>(undefined);

  React.useEffect(() => {
    setIsNotFound(undefined);
    if (queryHook.isFetched && !queryHook.isLoading && !queryHook.data) {
      setIsNotFound('Not Found');
    }
  }, [queryHook, enqueueSnackbar, navigate]);

  return {
    ...queryHook,
    isNotFound,
  };
};
