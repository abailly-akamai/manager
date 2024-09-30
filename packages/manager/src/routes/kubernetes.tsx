import { Outlet, createRoute, redirect } from '@tanstack/react-router';
import React from 'react';

import { ProductInformationBanner } from 'src/components/ProductInformationBanner/ProductInformationBanner';
import { SuspenseLoader } from 'src/components/SuspenseLoader';

import { rootRoute } from './root';

export const KubernetesRoutes = () => {
  return (
    <React.Suspense fallback={<SuspenseLoader />}>
      <ProductInformationBanner bannerLocation="Kubernetes" />
      <Outlet />
    </React.Suspense>
  );
};

export const kubernetesRoute = createRoute({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/kubernetes') {
      throw redirect({
        to: '/kubernetes/clusters',
      });
    }
  },
  component: KubernetesRoutes,
  getParentRoute: () => rootRoute,
  path: 'kubernetes',
});

const kubernetesIndexRoute = createRoute({
  getParentRoute: () => kubernetesRoute,
  path: '/',
}).lazy(() =>
  import('src/features/Kubernetes/KubernetesLanding/KubernetesLanding').then(
    (m) => m.kubernetesLandingLazyRoute
  )
);

const kubernetesClustersRoute = createRoute({
  getParentRoute: () => kubernetesRoute,
  path: 'clusters',
}).lazy(() =>
  import('src/features/Kubernetes/KubernetesLanding/KubernetesLanding').then(
    (m) => m.kubernetesLandingLazyRoute
  )
);

const kubernetesCreateRoute = createRoute({
  getParentRoute: () => kubernetesRoute,
  path: 'create',
}).lazy(() =>
  import('src/features/Kubernetes/CreateCluster/CreateCluster').then(
    (m) => m.createClusterLazyRoute
  )
);

const kubernetesClusterDetailRoute = createRoute({
  getParentRoute: () => kubernetesRoute,
  parseParams: (params) => ({
    clusterID: Number(params.clusterID),
  }),
  path: 'clusters/$clusterID',
}).lazy(() =>
  import(
    'src/features/Kubernetes/KubernetesClusterDetail/KubernetesClusterDetail'
  ).then((m) => m.kubernetesClusterDetailLazyRoute)
);

const kubernetesClusterDetailSummaryRoute = createRoute({
  getParentRoute: () => kubernetesClusterDetailRoute,
  path: 'summary',
}).lazy(() =>
  import(
    'src/features/Kubernetes/KubernetesClusterDetail/KubernetesClusterDetail'
  ).then((m) => m.kubernetesClusterDetailLazyRoute)
);

export const kubernetesRouteTree = kubernetesRoute.addChildren([
  kubernetesIndexRoute,
  kubernetesClustersRoute,
  kubernetesCreateRoute,
  kubernetesClusterDetailRoute.addChildren([
    kubernetesClusterDetailSummaryRoute,
  ]),
]);
