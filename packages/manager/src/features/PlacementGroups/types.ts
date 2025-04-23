import type { PlacementGroup, Region } from '@linode/api-v4';
import type { DataNotFound } from 'src/hooks/useValidateDialogData';

export interface PlacementGroupsDrawerPropsBase {
  onClose: () => void;
  open: boolean;
}

export interface PlacementGroupsCreateDrawerProps {
  disabledPlacementGroupCreateButton: boolean;
  onClose: PlacementGroupsDrawerPropsBase['onClose'];
  onPlacementGroupCreate?: (placementGroup: PlacementGroup) => void;
  open: PlacementGroupsDrawerPropsBase['open'];
  selectedRegionId?: string;
}

export interface PlacementGroupsEditDrawerProps {
  dataNotFound: DataNotFound;
  disableEditButton: boolean;
  isFetching: boolean;
  onClose: PlacementGroupsDrawerPropsBase['onClose'];
  onPlacementGroupEdit?: (placementGroup: PlacementGroup) => void;
  open: PlacementGroupsDrawerPropsBase['open'];
  region: Region | undefined;
  selectedPlacementGroup: PlacementGroup | undefined;
}

export interface PlacementGroupsAssignLinodesDrawerProps {
  onClose: PlacementGroupsDrawerPropsBase['onClose'];
  onLinodeAddedToPlacementGroup?: (placementGroup: PlacementGroup) => void;
  open: PlacementGroupsDrawerPropsBase['open'];
  region: Region | undefined;
  selectedPlacementGroup: PlacementGroup | undefined;
}
