import * as React from 'react';

import { regionFactory } from 'src/factories';
import { linodeFactory } from 'src/factories';
import { placementGroupFactory } from 'src/factories';
import {
  renderWithTheme,
  resizeScreenSize,
  wrapWithTableBody,
} from 'src/utilities/testHelpers';

import { PlacementGroupsRow } from './PlacementGroupsRow';

const handleDeletePlacementGroupMock = vi.fn();
const handleEditPlacementGroupMock = vi.fn();

describe('PlacementGroupsRow', () => {
  it('renders the columns with proper data', () => {
    resizeScreenSize(1200);

    const { getByRole, getByTestId, getByText } = renderWithTheme(
      wrapWithTableBody(
        <PlacementGroupsRow
          assignedLinodes={[
            linodeFactory.build({
              id: 1,
              label: 'linode1',
              region: 'us-iad',
            }),
          ]}
          placementGroup={placementGroupFactory.build({
            affinity_type: 'anti_affinity:local',
            id: 1,
            is_compliant: false,
            label: 'group 1',
            members: [
              {
                is_compliant: true,
                linode_id: 1,
              },
            ],
            region: 'us-iad',
          })}
          region={regionFactory.build({
            country: 'us',
            id: 'us-iad',
            label: 'Washington, DC',
            status: 'ok',
          })}
          disabled
          handleDeletePlacementGroup={handleDeletePlacementGroupMock}
          handleEditPlacementGroup={handleEditPlacementGroupMock}
        />
      )
    );

    expect(getByTestId('link-to-placement-group-1')).toHaveTextContent(
      'group 1'
    );
    expect(getByText('Non-compliant')).toBeInTheDocument();
    expect(getByTestId('placement-group-1-assigned-linodes')).toHaveTextContent(
      '1'
    );
    expect(getByText('Washington, DC')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});
