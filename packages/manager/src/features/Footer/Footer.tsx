import classNames from 'classnames';
import * as React from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import ExternalLink from 'src/components/ExternalLink';
import Grid from '@mui/material/Unstable_Grid2';
import packageJson from '../../../package.json';

interface Props {
  desktopMenuIsOpen: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    backgroundColor: theme.bg.main,
    margin: 0,
    padding: '4px 0px',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: 200,
    },
    width: '100%',
  },
  desktopMenuIsOpen: {
    paddingLeft: 0,
    [theme.breakpoints.up('md')]: {
      paddingLeft: 52,
    },
  },
  feedbackLink: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
    [theme.breakpoints.up('xs')]: {
      '&.MuiGrid-item': {
        paddingRight: 0,
      },
    },
  },
  link: {
    '&:hover, &:focus': {
      color: theme.color.black,
      textDecoration: 'underline',
    },
    color: theme.palette.text.primary,
    fontSize: '90%',
    [theme.breakpoints.down('lg')]: {
      marginRight: theme.spacing(1),
    },
    transition: theme.transitions.create('color'),
  },
  linkContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: '0 8px !important',
    },
  },
  version: {
    '&.MuiGrid-item': {
      paddingLeft: 0,
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(),
    },
  },
}));

const FEEDBACK_LINK = 'https://www.linode.com/feedback/';

export const Footer: React.FC<Props> = (props) => {
  const classes = useStyles();

  const { desktopMenuIsOpen } = props;

  return (
    <footer role="contentinfo">
      <Grid
        container
        spacing={4}
        alignItems="center"
        className={classNames({
          [classes.container]: true,
          [classes.desktopMenuIsOpen]: desktopMenuIsOpen,
        })}
      >
        <Grid className={classes.version}>{renderVersion(classes.link)}</Grid>
        <Grid
          className={classNames({
            [classes.linkContainer]: true,
          })}
        >
          <a
            className={classes.link}
            href="https://developers.linode.com"
            target="_blank"
            aria-describedby="external-site"
            rel="noopener noreferrer"
          >
            API Reference
          </a>
        </Grid>
        <Grid
          className={classNames({
            [classes.feedbackLink]: true,
            [classes.linkContainer]: true,
          })}
        >
          <ExternalLink
            className={classes.link}
            text="Provide Feedback"
            link={FEEDBACK_LINK}
            hideIcon
          />
        </Grid>
      </Grid>
    </footer>
  );
};

const renderVersion = (className: string) => {
  const VERSION = packageJson.version;
  if (!VERSION) {
    return null;
  }

  return (
    <a
      className={className}
      href={`https://github.com/linode/manager/releases/tag/linode-manager@v${VERSION}`}
      target="_blank"
      aria-describedby="external-site"
      rel="noopener noreferrer"
    >
      v{VERSION}
    </a>
  );
};

export default React.memo(Footer);
