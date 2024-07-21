import { HttpResponse, http } from 'msw';

import type { MockPreset } from 'src/mocks/types';

/**
 * Mock all requests to Linode API v4 to mock HTTP request failure.
 */
const respondWithFailure = () => {
  return [
    http.all('*/v4*/*', () => {
      return HttpResponse.error();
    }),
  ];
};

export const baselineApiOfflinePreset: MockPreset = {
  group: 'API State',
  handlers: [respondWithFailure],
  id: 'baseline-api-offline',
  label: 'API Offline',
};