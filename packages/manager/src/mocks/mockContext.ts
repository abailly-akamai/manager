import { mswDB } from './indexedDB';

import type { MockContext, MockContextPopulator } from './types';

/**
 * Describes a function that executes on each request to the events endpoint.
 *
 * Can be used to simulate progress or update state in response to an event.
 *
 * @returns `true` if event is considered complete, `false` if callback should continue to be called.
 */
export const getContextPopulatorGroups = (
  populators: MockContextPopulator[]
): Array<string | undefined> => {
  return populators.reduce((acc: Array<string | undefined>, cur) => {
    if (!acc.includes(cur.group)) {
      acc.push(cur.group);
    }

    return acc;
  }, []);
};

export const emptyStore: MockContext = {
  eventQueue: [],
  firewalls: [],
  linodeConfigs: [],
  linodes: [],
  notificationQueue: [],
  placementGroups: [],
  regionAvailability: [],
  regions: [],
  volumes: [],
};

/**
 * Creates and returns an empty mock context.
 *
 * @returns Empty mock context.
 */
export const createInitialMockStore = async (): Promise<MockContext> => {
  const mockContext = await mswDB.getStore('mockContext');

  if (mockContext) {
    return mockContext;
  }

  return emptyStore;
};