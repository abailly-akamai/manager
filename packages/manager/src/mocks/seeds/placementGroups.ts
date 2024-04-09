import { linodeFactory, placementGroupFactory } from 'src/factories';

import { mswDB } from '../db';
import { convertToMswContent } from '../utils';

import type { Linode, PlacementGroup } from '@linode/api-v4';

export const seedPlacementGroupsData = () => {
  const linode1 = convertToMswContent<Linode>(
    linodeFactory.build({
      label: `pg-linode-1`,
      placement_group: undefined,
      region: 'eu-west',
    })
  );

  const pg1 = convertToMswContent<PlacementGroup>(
    placementGroupFactory.build({
      affinity_type: 'anti_affinity:local',
      is_compliant: true,
      is_strict: true,
      label: `pg-1`,
      members: [],
      region: 'eu-west',
    })
  );

  const pg2 = convertToMswContent<PlacementGroup>(
    placementGroupFactory.build({
      affinity_type: 'anti_affinity:local',
      is_compliant: true,
      is_strict: true,
      label: `pg-2`,
      members: [],
      region: 'eu-west',
    })
  );

  const pg3 = convertToMswContent<PlacementGroup>(
    placementGroupFactory.build({
      affinity_type: 'anti_affinity:local',
      is_compliant: true,
      is_strict: false,
      label: `pg-3`,
      members: [],
      region: 'eu-west',
    })
  );

  // Create initial data
  const db_Linode1 = mswDB.linode.create({ ...linode1 });
  mswDB.placementGroup.create({ ...pg1 });
  const db_Pg2 = mswDB.placementGroup.create({ ...pg2 });
  mswDB.placementGroup.create({ ...pg3 });
  // Seeding additional Linodes to add to Placement Groups
  Array.from({ length: 4 }, (_, idx) => {
    const linode = convertToMswContent(
      linodeFactory.build({
        label: `pg-linode-${idx + 2}`,
        placement_group: undefined,
        region: 'eu-west',
      })
    );
    return mswDB.linode.create(linode);
  });

  // Create initial relationships
  mswDB.placementGroup.update({
    data: {
      members: [db_Linode1],
    },
    where: {
      id: { equals: db_Pg2.id },
    },
  });
};
