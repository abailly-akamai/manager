import { factory } from '@mswjs/data';

import { LinodeModel } from './models/Linode';
import { PlacementGroupModel } from './models/PlacementGroup';
import { RegionModel } from './models/Region';
import { seedPlacementGroupsData } from './seeds/placementGroups';
import { seedRegionsData } from './seeds/regions';

export const mswDB = factory({
  linode: LinodeModel,
  placementGroup: PlacementGroupModel,
  region: RegionModel,
});

seedRegionsData();
seedPlacementGroupsData();
