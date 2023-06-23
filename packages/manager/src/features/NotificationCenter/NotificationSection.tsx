import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { StyledLinkButton } from 'src/components/Button/StyledLinkButton';
import { CircleProgress } from 'src/components/CircleProgress';
import { ExtendedAccordion } from 'src/components/ExtendedAccordion/ExtendedAccordion';
import Box from 'src/components/core/Box';
import Hidden from 'src/components/core/Hidden';
import Typography from 'src/components/core/Typography';
import { menuLinkStyle } from 'src/features/TopMenu/UserMenu/UserMenu';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => ({
  inverted: {
    transform: 'rotate(180deg)',
  },
  menuItemLink: {
    ...menuLinkStyle(theme.textColors.linkActiveLight),
  },
  notificationSpacing: {
    '& > div:not(:first-child)': {
      margin: `${theme.spacing()} 0`,
      padding: '0 20px',
    },
    marginBottom: theme.spacing(2),
  },
  showMore: {
    '&:hover': {
      textDecoration: 'none',
    },
    alignItems: 'center',
    display: 'flex',
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: theme.spacing(),
  },
}));

export interface NotificationItem {
  id: string;
  body: string | JSX.Element;
  countInTotal: boolean;
}

interface NotificationSectionProps {
  header: string;
  count?: number;
  showMoreText?: string;
  showMoreTarget?: string;
  content: NotificationItem[];
  loading?: boolean;
  emptyMessage?: string;
}

export const NotificationSection = (props: NotificationSectionProps) => {
  const { classes } = useStyles();

  const {
    content,
    count,
    emptyMessage,
    header,
    loading,
    showMoreTarget,
    showMoreText,
  } = props;

  const _count = count ?? 5;
  const _loading = Boolean(loading); // false if not provided

  const innerContent = () => {
    return (
      <ContentBody
        loading={_loading}
        count={_count}
        content={content}
        header={header}
        emptyMessage={emptyMessage}
      />
    );
  };

  const isActualNotificationContainer = header === 'Notifications';

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isActualNotificationContainer && content.length === 0 ? null : (
        <>
          <Hidden smDown>
            <StyledRootContainer
              className={classNames({
                [classes.notificationSpacing]: isActualNotificationContainer,
              })}
            >
              <Box sx={{ width: '100%' }}>
                <StyledHeader>
                  <Typography variant="h3">{header}</Typography>
                  {showMoreTarget && (
                    <strong>
                      <Link
                        to={showMoreTarget}
                        className={classes.menuItemLink}
                        style={{ padding: 0 }}
                      >
                        {showMoreText ?? 'View history'}
                      </Link>
                    </strong>
                  )}
                </StyledHeader>
                <ContentBody
                  loading={_loading}
                  count={_count}
                  content={content}
                  header={header}
                  emptyMessage={emptyMessage}
                />
              </Box>
            </StyledRootContainer>
          </Hidden>

          <Hidden smUp>
            <ExtendedAccordion
              heading={header}
              headingNumberCount={
                content.length > 0 ? content.length : undefined
              }
              renderMainContent={innerContent}
              defaultExpanded={true}
            />
          </Hidden>
        </>
      )}
    </>
  );
};

// =============================================================================
// Body
// =============================================================================
interface BodyProps {
  header: string;
  content: NotificationItem[];
  count: number;
  emptyMessage?: string;
  loading: boolean;
}

const ContentBody = React.memo((props: BodyProps) => {
  const { classes } = useStyles();

  const { content, count, emptyMessage, header, loading } = props;

  const [showAll, setShowAll] = React.useState(false);

  if (loading) {
    return (
      <StyledLoadingContainer>
        <CircleProgress mini />
      </StyledLoadingContainer>
    );
  }

  const _content = showAll ? content : content.slice(0, count);

  return _content.length > 0 ? (
    // eslint-disable-next-line
    <>
      {_content.map((thisItem) => (
        <StyledNotificationItem
          key={`notification-row-${thisItem.id}`}
          {...props}
        >
          {thisItem.body}
        </StyledNotificationItem>
      ))}
      {content.length > count ? (
        <StyledLToggleContainer display="flex" justifyContent="flex-end">
          <StyledLinkButton
            onClick={() => setShowAll(!showAll)}
            aria-label={`Display all ${content.length} items`}
            data-test-id="showMoreButton"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              textDecoration: 'none !important',
            }}
          >
            {showAll ? 'Collapse' : `${content.length - count} more`}
            <StyledCaret
              className={classNames({
                [classes.inverted]: showAll,
              })}
            />
          </StyledLinkButton>
        </StyledLToggleContainer>
      ) : null}
    </>
  ) : header === 'Events' ? (
    <StyledEmptyMessage variant="body1">
      {emptyMessage
        ? emptyMessage
        : `You have no ${header.toLocaleLowerCase()}.`}
    </StyledEmptyMessage>
  ) : null;
});

const StyledRootContainer = styled('div', {
  label: 'StyledRootContainer',
})(() => ({
  alignItems: 'flex-start',
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
}));

const StyledHeader = styled('div', {
  label: 'StyledHeader',
})(({ theme }) => ({
  alignItems: 'center',
  borderBottom: `solid 1px ${theme.borderColors.borderTable}`,
  display: 'flex',
  justifyContent: 'space-between',
  padding: `0 20px ${theme.spacing()}`,
}));

const StyledLoadingContainer = styled('div', {
  label: 'StyledLoadingContainer',
})(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

const StyledLToggleContainer = styled(Box, {
  label: 'StyledLToggleButton',
})(({ theme }) => ({
  padding: `0 16px ${theme.spacing()}`,
}));

const StyledNotificationItem = styled(Box, {
  label: 'StyledNotificationItem',
  shouldForwardProp: (prop) => prop !== 'content',
})<NotificationSectionProps>(({ theme, ...props }) => ({
  '& p': {
    color: theme.textColors.headlineStatic,
    lineHeight: '1.25rem',
  },
  display: 'flex',
  fontSize: '0.875rem',
  justifyContent: 'space-between',
  padding: props.header === 'Notifications' ? `${theme.spacing(1.5)} 20px` : 0,
  width: '100%',
}));

const StyledCaret = styled(KeyboardArrowDown)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(),
}));

const StyledEmptyMessage = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  marginTop: theme.spacing(),
  padding: `0 20px`,
}));
