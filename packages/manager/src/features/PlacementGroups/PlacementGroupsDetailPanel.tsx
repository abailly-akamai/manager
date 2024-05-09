import { useTheme } from '@mui/material/styles';
import * as React from 'react';

import { Box } from 'src/components/Box';
import { Button } from 'src/components/Button/Button';
import { ListItem } from 'src/components/ListItem';
import { Notice } from 'src/components/Notice/Notice';
import { PlacementGroupsSelect } from 'src/components/PlacementGroupsSelect/PlacementGroupsSelect';
import { TextTooltip } from 'src/components/TextTooltip';
import { Typography } from 'src/components/Typography';
import { PlacementGroupsCreateDrawer } from 'src/features/PlacementGroups/PlacementGroupsCreateDrawer';
import { hasRegionReachedPlacementGroupCapacity } from 'src/features/PlacementGroups/utils';
import { useRestrictedGlobalGrantCheck } from 'src/hooks/useRestrictedGlobalGrantCheck';
import { useAllPlacementGroupsQuery } from 'src/queries/placementGroups';
import { useRegionsQuery } from 'src/queries/regions/regions';

import { PLACEMENT_GROUP_SELECT_TOOLTIP_COPY } from './constants';
import { StyledDetailPanelFormattedRegionList } from './PlacementGroups.styles';

import type { PlacementGroup } from '@linode/api-v4';

interface Props {
  handlePlacementGroupChange: (selected: PlacementGroup) => void;
  selectedPlacementGroupId?: number;
  selectedRegionId?: string;
}

export const PlacementGroupsDetailPanel = (props: Props) => {
  const theme = useTheme();
  const {
    handlePlacementGroupChange,
    selectedPlacementGroupId,
    selectedRegionId,
  } = props;
  const { data: allPlacementGroupsInRegion } = useAllPlacementGroupsQuery({
    enabled: Boolean(selectedRegionId),
    filter: {
      region: selectedRegionId,
    },
  });
  const { data: regions } = useRegionsQuery();

  const [
    isCreatePlacementGroupDrawerOpen,
    setIsCreatePlacementGroupDrawerOpen,
  ] = React.useState(false);

  const selectedRegion = regions?.find(
    (thisRegion) => thisRegion.id === selectedRegionId
  );

  const hasRegionPlacementGroupCapability = Boolean(
    selectedRegion?.capabilities.includes('Placement Group')
  );

  const isLinodeReadOnly = useRestrictedGlobalGrantCheck({
    globalGrantType: 'add_linodes',
  });

  const handlePlacementGroupCreated = (placementGroup: PlacementGroup) => {
    handlePlacementGroupChange(placementGroup);
  };

  const allRegionsWithPlacementGroupCapability = regions?.filter((region) =>
    region.capabilities.includes('Placement Group')
  );
  const isPlacementGroupSelectDisabled =
    !selectedRegionId || !hasRegionPlacementGroupCapability;

  const placementGroupSelectLabel = selectedRegion
    ? `Placement Groups in ${selectedRegion.label} (${selectedRegion.id})`
    : 'Placement Group';

  return (
    <>
      {!selectedRegion && (
        <Notice
          dataTestId="placement-groups-no-region-notice"
          spacingBottom={0}
          spacingTop={16}
          variant="warning"
        >
          <Typography fontFamily={theme.font.bold}>
            Select a Region for your Linode to see existing placement groups.
          </Typography>
        </Notice>
      )}
      {selectedRegion && !hasRegionPlacementGroupCapability && (
        <Notice
          dataTestId="placement-groups-no-capability-notice"
          spacingBottom={0}
          spacingTop={16}
          variant="warning"
        >
          <Typography fontFamily={theme.font.bold}>
            Currently, only specific{' '}
            <TextTooltip
              sxTypography={{
                fontFamily: theme.font.bold,
              }}
              tooltipText={
                <StyledDetailPanelFormattedRegionList>
                  {allRegionsWithPlacementGroupCapability?.map((region) => (
                    <ListItem key={region.id}>
                      {region.label} ({region.id})
                    </ListItem>
                  ))}
                </StyledDetailPanelFormattedRegionList>
              }
              displayText="regions"
              minWidth={225}
            />{' '}
            support placement groups.
          </Typography>
        </Notice>
      )}
      <Box>
        <PlacementGroupsSelect
          sx={{
            mb: 1,
            width: '100%',
          }}
          textFieldProps={{
            tooltipPosition: 'right',
            tooltipText: PLACEMENT_GROUP_SELECT_TOOLTIP_COPY,
          }}
          disabled={isPlacementGroupSelectDisabled}
          handlePlacementGroupChange={handlePlacementGroupChange}
          label={placementGroupSelectLabel}
          noOptionsMessage="There are no Placement Groups in this region."
          selectedPlacementGroupId={selectedPlacementGroupId}
          selectedRegion={selectedRegion}
        />
        {selectedRegion && hasRegionPlacementGroupCapability && (
          <Button
            disabled={hasRegionReachedPlacementGroupCapacity({
              allPlacementGroups: allPlacementGroupsInRegion,
              region: selectedRegion,
            })}
            sx={(theme) => ({
              fontFamily: theme.font.normal,
              fontSize: '0.875rem',
              mt: -0.75,
              p: 0,
            })}
            sxEndIcon={{
              color: theme.color.grey4,
            }}
            onClick={() => setIsCreatePlacementGroupDrawerOpen(true)}
            tooltipText="This region has reached its Placement Group capacity."
            variant="text"
          >
            Create Placement Group
          </Button>
        )}
      </Box>
      <PlacementGroupsCreateDrawer
        disabledPlacementGroupCreateButton={isLinodeReadOnly}
        onClose={() => setIsCreatePlacementGroupDrawerOpen(false)}
        onPlacementGroupCreate={handlePlacementGroupCreated}
        open={isCreatePlacementGroupDrawerOpen}
        selectedRegionId={selectedRegionId}
      />
    </>
  );
};
