import { KubernetesCluster } from '@linode/api-v4';
import * as React from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useAllKubernetesNodePoolQuery } from 'src/queries/kubernetes';
import { useSpecificTypes } from 'src/queries/types';
import { extendTypesQueryResult } from 'src/utilities/extendType';
import { useRegionsQuery } from 'src/queries/regions';
import { pluralize } from 'src/utilities/pluralize';
import {
  getTotalClusterMemoryCPUAndStorage,
  getTotalClusterPrice,
} from '../kubeUtils';

interface Props {
  cluster: KubernetesCluster;
}

const useStyles = makeStyles((theme: Theme) => ({
  iconTextOuter: {
    flexBasis: '72%',
    minWidth: 115,
  },
  item: {
    '&:first-of-type': {
      paddingTop: 0,
    },
    '&:last-of-type': {
      paddingBottom: 0,
    },
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  mainGridContainer: {
    position: 'relative',
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'space-between',
    },
  },
  root: {
    marginBottom: theme.spacing(3),
    padding: `${theme.spacing(2.5)} ${theme.spacing(2.5)} ${theme.spacing(3)}`,
  },
}));

export const KubeClusterSpecs = (props: Props) => {
  const { cluster } = props;
  const classes = useStyles();
  const { data: regions } = useRegionsQuery();

  const { data: pools } = useAllKubernetesNodePoolQuery(cluster.id);

  const typesQuery = useSpecificTypes(pools?.map((pool) => pool.type) ?? []);
  const types = extendTypesQueryResult(typesQuery);

  const { CPU, RAM, Storage } = getTotalClusterMemoryCPUAndStorage(
    pools ?? [],
    types ?? []
  );

  const region = regions?.find((r) => r.id === cluster.region);

  const displayRegion = region?.label ?? cluster.region;

  const kubeSpecsLeft = [
    `Version ${cluster.k8s_version}`,
    displayRegion,
    `$${getTotalClusterPrice(
      pools ?? [],
      types ?? [],
      cluster.control_plane.high_availability
    ).toFixed(2)}/month`,
  ];

  const kubeSpecsRight = [
    pluralize('CPU Core', 'CPU Cores', CPU),
    `${RAM / 1024} GB RAM`,
    `${Math.floor(Storage / 1024)} GB Storage`,
  ];

  const kubeSpecItem = (spec: string, idx: number) => {
    return (
      <Grid
        key={`spec-${idx}`}
        wrap="nowrap"
        alignItems="center"
        className={classes.item}
      >
        <Grid className={classes.iconTextOuter}>
          <Typography>{spec}</Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container direction="row" xs={12} lg={3} spacing={0}>
      <Grid lg={6}>{kubeSpecsLeft.map(kubeSpecItem)}</Grid>
      <Grid lg={6}>{kubeSpecsRight.map(kubeSpecItem)}</Grid>
    </Grid>
  );
};

export default KubeClusterSpecs;
