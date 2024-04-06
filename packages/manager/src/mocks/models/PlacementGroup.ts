import { manyOf, oneOf, primaryKey } from '@mswjs/data';

import { mswUUID } from '../utils';

const PlacementGroupLinodesModel = {
  id: primaryKey(() => mswUUID()),
  is_compliant: Boolean,
  linode_id: oneOf('linode'),
};

const PlacementGroupModel = {
  affinity_type: String,
  id: primaryKey(() => mswUUID()),
  is_compliant: Boolean,
  is_strict: Boolean,
  label: String,
  members: manyOf('placementGroupLinodes'),
  region: String,
};

export { PlacementGroupLinodesModel, PlacementGroupModel };
