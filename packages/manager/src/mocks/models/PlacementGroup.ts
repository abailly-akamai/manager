import { manyOf, primaryKey } from '@mswjs/data';

import { mswUUID } from '../utils';

const PlacementGroupModel = {
  affinity_type: String,
  id: primaryKey(() => mswUUID()),
  is_compliant: Boolean,
  is_strict: Boolean,
  label: String,
  members: manyOf('linode'),
  region: String,
};

export { PlacementGroupModel };
