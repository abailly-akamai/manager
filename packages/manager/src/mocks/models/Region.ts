import { primaryKey } from '@mswjs/data';

const RegionModel = {
  capabilities: Array,
  country: String,
  id: primaryKey(String),
  label: String,
  placement_group_limits: {
    maximum_linodes_per_pg: Number,
    maximum_pgs_per_customer: Number,
  },
  resolvers: {
    ipv4: String,
    ipv6: String,
  },
  site_type: String,
  status: String,
};

export { RegionModel };
