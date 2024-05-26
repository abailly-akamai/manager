import * as React from 'react';

import { EventMessageLink } from '../EventMessageLink';

import type { PartialEventMap } from '../types';

export const lke: PartialEventMap = {
  lke_cluster_create: {
    notification: (e) => (
      <>
        Kubernetes Cluster <EventMessageLink entity={e.entity} /> has been{' '}
        <strong>created</strong>.
      </>
    ),
  },
  lke_cluster_delete: {
    notification: (e) => (
      <>
        Kubernetes Cluster <EventMessageLink entity={e.entity} /> has been{' '}
        <strong>deleted</strong>.
      </>
    ),
  },
  lke_cluster_recycle: {
    notification: (e) => (
      <>
        Kubernetes Cluster <EventMessageLink entity={e.entity} /> has been{' '}
        <strong>recycled</strong>.
      </>
    ),
  },
  lke_cluster_regenerate: {
    notification: (e) => (
      <>
        Kubernetes Cluster <EventMessageLink entity={e.entity} /> has been{' '}
        <strong>regenerated</strong>.
      </>
    ),
  },
  lke_cluster_update: {
    notification: (e) => (
      <>
        Kubernetes Cluster <EventMessageLink entity={e.entity} /> has been{' '}
        <strong>updated</strong>.
      </>
    ),
  },
  lke_control_plane_acl_create: {
    notification: (e) => (
      <>
        The IP ACL for Kubernetes Cluster <EventMessageLink entity={e.entity} />{' '}
        has been <strong>created</strong>.
      </>
    ),
  },
  lke_control_plane_acl_delete: {
    notification: (e) => (
      <>
        The IP ACL for Kubernetes Cluster <EventMessageLink entity={e.entity} />{' '}
        has been <strong>disabled</strong>.
      </>
    ),
  },
  lke_control_plane_acl_update: {
    notification: (e) => (
      // `The IP ACL for Kubernetes Cluster${
      //   e.entity?.label ? ` ${e.entity.label}` : ''
      // } has been updated.`,
      <>
        The IP ACL for Kubernetes Cluster <EventMessageLink entity={e.entity} />{' '}
        has been <strong>updated</strong>.
      </>
    ),
  },
  lke_kubeconfig_regenerate: {
    notification: (e) => (
      <>
        The kubeconfig for Kubernetes Cluster{' '}
        <EventMessageLink entity={e.entity} /> has been{' '}
        <strong>regenerated</strong>.
      </>
    ),
  },
  lke_node_create: {
    // This event is a special case; a notification means the node creation failed.
    // The entity is the node pool, but entity.label contains the cluster's label.
    notification: (e) => (
      <>
        Kubernetes Cluster node could not be <strong>created</strong>
        {e.entity?.label ? ' on ' : ''}
        <EventMessageLink entity={e.entity} />.
      </>
    ),
  },
  lke_node_recycle: {
    notification: (e) => (
      <>
        The node for Kubernetes Cluster <EventMessageLink entity={e.entity} />{' '}
        has been <strong>recycled</strong>.
      </>
    ),
  },
  lke_pool_create: {
    notification: (e) => (
      <>
        A Node Pool for Kubernetes Cluster{' '}
        <EventMessageLink entity={e.entity} /> has been <strong>created</strong>
        .
      </>
    ),
  },
  lke_pool_delete: {
    notification: (e) => (
      <>
        A Node Pool for Kubernetes Cluster{' '}
        <EventMessageLink entity={e.entity} /> has been <strong>deleted</strong>
        .
      </>
    ),
  },
  lke_pool_recycle: {
    notification: (e) => (
      <>
        A Node Pool for Kubernetes Cluster{' '}
        <EventMessageLink entity={e.entity} /> has been{' '}
        <strong>recycled</strong>.
      </>
    ),
  },
  lke_token_rotate: {
    notification: (e) => (
      <>
        The token for Kubernetes Cluster <EventMessageLink entity={e.entity} />{' '}
        has been <strong>rotated</strong>.
      </>
    ),
  },
};
