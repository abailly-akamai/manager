import { regions } from 'src/__data__/regionsData';
import { regionFactory } from 'src/factories';

import { mswDB } from '../db';

export const seedRegionsData = () => {
  regions.forEach((region) => {
    const regionData = regionFactory.build(region);

    mswDB.region.create(regionData);
  });
};
