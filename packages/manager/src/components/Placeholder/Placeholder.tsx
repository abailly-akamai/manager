import * as React from 'react';
import LinodeIcon from 'src/assets/addnewmenu/linode.svg';
import Button, { ButtonProps } from 'src/components/Button';
import { styled, useTheme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import { H1Header } from 'src/components/H1Header/H1Header';
import { TransferDisplay } from '../TransferDisplay/TransferDisplay';
import { fadeIn } from 'src/styles/keyframes';

export interface ExtendedButtonProps extends ButtonProps {
  target?: string;
}

export interface PlaceholderProps {
  buttonProps?: ExtendedButtonProps[];
  children?: string | React.ReactNode;
  className?: string;
  dataQAPlaceholder?: string | boolean;
  descriptionMaxWidth?: number;
  icon?: React.ComponentType<any>;
  isEntity?: boolean;
  linksSection?: JSX.Element;
  renderAsSecondary?: boolean;
  showTransferDisplay?: boolean;
  subtitle?: string;
  title: string;
}

export const Placeholder = (props: PlaceholderProps) => {
  const {
    buttonProps,
    dataQAPlaceholder,
    descriptionMaxWidth,
    icon: Icon = LinodeIcon,
    isEntity,
    linksSection,
    renderAsSecondary,
    showTransferDisplay,
    subtitle,
    title,
  } = props;

  const theme = useTheme();
  const hasSubtitle = subtitle !== undefined;

  /**
   * TODO: We should use these styles to create a Styled component THEN
   * pass that into the Placeholder component
   * */
  const IconStyles = {
    '& .bucket.insidePath path': {
      fill: theme.palette.primary.main,
    },
    '& .circle': {
      fill: theme.name === 'light' ? '#fff' : '#000',
    },
    '& .insidePath path': {
      opacity: 0,
      stroke: theme.palette.primary.main,
    },
    '& .outerCircle': {
      fill: theme.name === 'light' ? '#fff' : '#000',
      stroke: theme.bg.offWhite,
    },
    height: '160px',
    padding: theme.spacing(2),
    width: '160px',
  };

  return (
    <>
      <PlaceholderRoot
        className={props.className}
        data-qa-placeholder-container={dataQAPlaceholder || true}
      >
        <StyledIconWrapper isEntity={isEntity}>
          {Icon && <Icon style={IconStyles} />}
        </StyledIconWrapper>

        <H1Header
          title={title}
          renderAsSecondary={renderAsSecondary}
          data-qa-placeholder-title
          sx={{
            gridArea: 'title',
            textAlign: 'center',
          }}
        />
        {hasSubtitle ? (
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.text.primary,
              gridArea: 'subtitle',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </Typography>
        ) : null}

        <StyledCopy descriptionMaxWidth={descriptionMaxWidth}>
          {typeof props.children === 'string' ? (
            <Typography variant="subtitle1">{props.children}</Typography>
          ) : (
            props.children
          )}
        </StyledCopy>
        <StyledButtonWrapper>
          {buttonProps &&
            buttonProps.map((thisButton, index) => (
              <Button
                buttonType="primary"
                {...thisButton}
                data-qa-placeholder-button
                data-testid="placeholder-button"
                key={index}
              />
            ))}
        </StyledButtonWrapper>
        {linksSection !== undefined ? (
          <StyledLinksSection showTransferDisplay={showTransferDisplay}>
            {linksSection}
          </StyledLinksSection>
        ) : null}
      </PlaceholderRoot>
      {showTransferDisplay ? <TransferDisplay spacingTop={0} /> : null}
    </>
  );
};

const StyledIconWrapper = styled('div')<Pick<PlaceholderProps, 'isEntity'>>(
  ({ theme, ...props }) => ({
    gridArea: 'icon',
    padding: theme.spacing(2),
    ...(props.isEntity && {
      alignItems: 'center',
      backgroundColor: theme.bg.bgPaper,
      borderRadius: '50%',
      color: theme.color.green,
      display: 'flex',
      justifyContent: 'center',
    }),
  })
);

const StyledButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  gridArea: 'button',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
  },
}));

const StyledLinksSection = styled('div')<
  Pick<PlaceholderProps, 'showTransferDisplay'>
>(({ theme, ...props }) => ({
  borderTop: `1px solid ${theme.name === 'light' ? '#e3e5e8' : '#2e3238'}`,
  gridArea: 'links',
  paddingTop: '38px',

  ...(props.showTransferDisplay && {
    borderBottom: `1px solid ${theme.name === 'light' ? '#e3e5e8' : '#2e3238'}`,
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(4),
    },
  }),
}));

const StyledCopy = styled('div', {
  label: 'StyledCopy',
})<Pick<PlaceholderProps, 'descriptionMaxWidth'>>(({ theme, ...props }) => ({
  gridArea: 'copy',
  maxWidth: props.descriptionMaxWidth ? props.descriptionMaxWidth : '75%',
  minWidth: 'min-content',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    maxWidth: 'none',
  },
}));

const PlaceholderRoot = styled('div')<Partial<PlaceholderProps>>(
  ({ theme, ...props }) => ({
    '& .bucket.insidePath path': {
      fill: theme.palette.primary.main,
    },
    // @TODO: Check! These were in the root of the makeStyles function...
    '& .insidePath path': {
      animation: `${fadeIn} .2s ease-in-out forwards .3s`,
      opacity: 0,
      stroke: theme.palette.primary.main,
    },
    display: 'grid',
    gridTemplateAreas:
      props.showTransferDisplay && props.linksSection === undefined
        ? `
        ". . . . . icon icon . . . . ."
        ". . . . . . . . . . . ."
        ". . . . . title title . . . . ."
        ". . . . . . . . . . . ."
        ". . . . . subtitle subtitle . . . . ."
        ". . . . . . . . . . . ."
        ". . . . . copy copy . . . . ."
        ". . . . . . . . . . . ."
        ". . . . . button button . . . . ."
      `
        : `
        ". . . . . icon icon . . . . ."
        ". . . . . . . . . . . ."
        ". . . . . title title . . . . ."
        ". . . . . . . . . . . ."
        ". . . . . subtitle subtitle . . . . ."
        ". . . . . . . . . . . ."
        ". . . . . copy copy . . . . ."
        ". . . . . . . . . . . ."
        ". . . . . button button . . . . ."
        ". . . . . . . . . . . ."
        ". . . links links links links links links . . ."
      `,
    gridTemplateColumns: 'repeat(5, 1fr) 35% 35% repeat(5, 1fr)',
    gridTemplateRows:
      props.showTransferDisplay && props.linksSection === undefined
        ? 'max-content 12px max-content 7px max-content 15px max-content 24px max-content 40px'
        : 'max-content 12px max-content 7px max-content 15px max-content 24px max-content 64px min-content',
    justifyItems: 'center',

    padding: props.showTransferDisplay
      ? `${theme.spacing(4)} 0`
      : `${theme.spacing(2)} 0`,
    [theme.breakpoints.up('md')]: {
      padding: props.showTransferDisplay
        ? `${theme.spacing(10)} 0 ${theme.spacing(4)}`
        : `${theme.spacing(10)} 0`,
    },
  })
);
