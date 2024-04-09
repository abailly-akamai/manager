import { nullable, oneOf, primaryKey } from '@mswjs/data';

import { mswUUID } from '../utils';

const LinodeModel = {
  alerts: Array,
  backups: Array,
  group: String,
  hypervisor: String,
  id: primaryKey(() => mswUUID()),
  image: nullable(String),
  ipv4: Array,
  ipv6: Array,
  label: String,
  placement_group: nullable(oneOf('placementGroup')),
  region: String,
  specs: Object,
  status: String,
  tags: Array,
  type: nullable(String),
  updated: String,
  watchdog_enabled: Boolean,
};

export { LinodeModel };
