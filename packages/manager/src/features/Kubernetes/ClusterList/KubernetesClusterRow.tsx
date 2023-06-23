import * as React from 'react';
import Chip from 'src/components/core/Chip';
import Hidden from 'src/components/core/Hidden';
import Grid from '@mui/material/Unstable_Grid2';
import { DateTimeDisplay } from 'src/components/DateTimeDisplay';
import { TableCell } from 'src/components/TableCell';
import { TableRow } from 'src/components/TableRow';
import ActionMenu from './ClusterActionMenu';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { KubeNodePoolResponse, KubernetesCluster } from '@linode/api-v4';
import {
  getNextVersion,
  getTotalClusterMemoryCPUAndStorage,
} from '../kubeUtils';
import {
  useAllKubernetesNodePoolQuery,
  useKubernetesVersionQuery,
} from 'src/queries/kubernetes';
import { useSpecificTypes } from 'src/queries/types';
import { extendTypesQueryResult } from 'src/utilities/extendType';
import { useRegionsQuery } from 'src/queries/regions';

const useStyles = makeStyles((theme: Theme) => ({
  clusterRow: {
    '&:before': {
      display: 'none',
    },
  },
  labelStatusWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexFlow: 'row nowrap',
    whiteSpace: 'nowrap',
  },
  link: {
    '&:hover, &:focus': {
      textDecoration: 'underline',
    },
    color: theme.textColors.linkActiveLight,
    display: 'block',
    fontSize: '.875rem',
    lineHeight: '1.125rem',
  },
  version: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
  },
}));

export interface Props {
  cluster: KubernetesCluster;
  openDeleteDialog: (
    clusterID: number,
    clusterLabel: string,
    clusterNodePools: KubeNodePoolResponse[]
  ) => void;
  openUpgradeDialog: () => void;
}

export const KubernetesClusterRow = (props: Props) => {
  const { cluster, openDeleteDialog, openUpgradeDialog } = props;
  const classes = useStyles();

  const { data: versions } = useKubernetesVersionQuery();
  const { data: pools } = useAllKubernetesNodePoolQuery(cluster.id);
  const typesQuery = useSpecificTypes(pools?.map((pool) => pool.type) ?? []);
  const types = extendTypesQueryResult(typesQuery);
  const { data: regions } = useRegionsQuery();

  const region = regions?.find((r) => r.id === cluster.region);

  const nextVersion = getNextVersion(cluster.k8s_version, versions ?? []);

  const hasUpgrade = nextVersion !== null;

  const { CPU, RAM } = getTotalClusterMemoryCPUAndStorage(
    pools ?? [],
    types ?? []
  );

  return (
    <TableRow
      key={cluster.id}
      data-qa-cluster-cell={cluster.id}
      data-testid={'cluster-row'}
      className={classes.clusterRow}
      ariaLabel={`Cluster ${cluster.label}`}
    >
      <TableCell data-qa-cluster-label>
        <Grid
          container
          wrap="nowrap"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid className="py0">
            <div className={classes.labelStatusWrapper}>
              <Link
                className={classes.link}
                to={`/kubernetes/clusters/${cluster.id}/summary`}
                tabIndex={0}
              >
                {cluster.label}
              </Link>
            </div>
          </Grid>
          {cluster.control_plane.high_availability ? (
            <Grid>
              <Chip
                label="HA"
                variant="outlined"
                outlineColor="green"
                size="small"
                data-testid={'ha-chip'}
              />
            </Grid>
          ) : null}
        </Grid>
      </TableCell>
      <Hidden mdDown>
        <TableCell data-qa-cluster-version>
          <div className={classes.version}>
            {cluster.k8s_version}
            {hasUpgrade ? (
              <Chip
                onClick={openUpgradeDialog}
                label="UPGRADE"
                size="small"
                clickable
                inTable
              />
            ) : null}
          </div>
        </TableCell>
        <TableCell data-qa-cluster-date>
          <DateTimeDisplay value={cluster.created} />
        </TableCell>
      </Hidden>
      <TableCell data-qa-cluster-region>
        {region?.label ?? cluster.region}
      </TableCell>
      <Hidden smDown>
        <TableCell data-qa-cluster-memory>{`${RAM / 1024} GB`}</TableCell>
        <TableCell data-qa-cluster-cpu>
          {`${CPU} ${CPU === 1 ? 'CPU' : 'CPUs'}`}
        </TableCell>
      </Hidden>
      <TableCell actionCell>
        <ActionMenu
          clusterId={cluster.id}
          clusterLabel={cluster.label}
          openDialog={() =>
            openDeleteDialog(cluster.id, cluster.label, pools ?? [])
          }
        />
      </TableCell>
    </TableRow>
  );
};
