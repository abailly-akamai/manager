import DoneIcon from '@mui/icons-material/Done';
import { styled } from '@mui/material/styles';

import { ListItem } from 'src/components/ListItem';

export const GroupHeader = styled('div')(({ theme }) => ({
  color: theme.color.headline,
  fontFamily: theme.font.bold,
  fontSize: '1rem',
  padding: '15px 4px 4px 10px',
  textTransform: 'initial',
}));

export const StyledFlagContainer = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&.MuiListItem-root[aria-disabled="true"]': {
    background: 'transparent !important',
    color: theme.palette.text.primary,
    cursor: 'not-allowed !important',
    pointerEvents: 'inherit !important',
  },
  '&.MuiListItem-root[aria-disabled="true"]:active': {
    pointerEvents: 'none !important',
  },
}));

export const SelectedIcon = styled(DoneIcon, {
  label: 'SelectedIcon',
  shouldForwardProp: (prop) => prop != 'visible',
})<{ visible: boolean }>(({ visible }) => ({
  height: 17,
  marginLeft: '-2px',
  marginRight: '5px',
  visibility: visible ? 'visible' : 'hidden',
  width: 17,
}));

export const RegionSelectMenuStyles = {
  menuList: (base: any) => ({ ...base, maxHeight: `40vh !important` }),
};
