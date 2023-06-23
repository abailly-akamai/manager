import * as React from 'react';
import { Link } from 'react-router-dom';
import HeavenlyBucketIcon from 'src/assets/icons/promotionalOffers/heavenly-bucket.svg';
import Button from 'src/components/core/Button';
import Paper from 'src/components/core/Paper';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import { PromotionalOffer } from 'src/featureFlags';
import { useWindowDimensions } from 'src/hooks/useWindowDimensions';
import {
  offSiteURL,
  onSiteURL,
} from 'src/utilities/sanitize-html/sanitizeHTML';

const useStyles = makeStyles()((theme: Theme) => ({
  alignLeft: {
    alignItems: 'flex-start',
  },
  button: {
    '&:hover, &:focus': {
      backgroundColor: '#3f8a4e',
      color: 'white',
    },
    backgroundColor: '#4FAD62',
    color: 'white',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    textAlign: 'center',
  },
  buttonSecondary: {
    '&:hover, &:focus': {
      backgroundColor: 'inherit',
      borderColor: '#72BD81',
      color: '#72BD81',
    },
    backgroundColor: 'inherit',
    border: '1px solid transparent',
    borderColor: '#4FAD62',
    color: '#4FAD62',
    transition: theme.transitions.create(['color', 'border-color']),
  },
  buttonSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  capMaxWidth: {
    maxWidth: 400,
  },
  centerText: {
    textAlign: 'center',
  },
  copy: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  footnote: {
    marginTop: theme.spacing(1),
  },
  fullWidth: {
    '& p:last-child': {
      marginTop: theme.spacing(1),
    },
    '& svg': {
      marginBottom: `calc(${theme.spacing(1)} - 2)`,
      marginRight: theme.spacing(2),
    },
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  logo: {
    marginBottom: theme.spacing(2),
  },
  root: {
    alignItems: 'center',
    backgroundColor: theme.bg.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 4,
  },
}));

export interface PromotionalOfferCardProps extends PromotionalOffer {
  fullWidth?: boolean;
  className?: string;
}

export const PromotionalOfferCard = (props: PromotionalOfferCardProps) => {
  const { classes, cx } = useStyles();

  const { fullWidth, ...promotionalOfferAttributes } = props;

  const offer = promotionalOfferOrDefaults({
    ...promotionalOfferAttributes,
  });

  const Logo = logoMap[offer.logo];

  const { width } = useWindowDimensions();

  const iconSize = width < 960 || fullWidth ? 80 : 110;

  return (
    <Paper
      className={cx({
        [classes.fullWidth]: props.fullWidth,
        [classes.root]: true,
        // Inject the className if given as as prop.
        [props.className ?? '']: Boolean(props.className),
      })}
    >
      {Logo && (
        <Logo className={classes.logo} width={iconSize} height={iconSize} />
      )}
      <div
        className={cx({
          [classes.alignLeft]: fullWidth,
          [classes.copy]: true,
        })}
      >
        <Typography
          variant="subtitle2"
          className={cx({
            [classes.capMaxWidth]: !fullWidth,
            [classes.centerText]: !fullWidth,
          })}
        >
          {offer.body}
        </Typography>
        {/* Don't display buttons on full-width promotional banners. */}
        {!props.fullWidth && offer.buttons.length >= 1 && (
          <div className={classes.buttonSection}>
            {/* Only display the first two buttons. Any offer containing more
            than two buttons is a mistake. */}
            {offer.buttons.slice(0, 2).map((button) => (
              <Button
                key={button.text}
                className={cx({
                  [classes.button]: true,
                  [classes.buttonSecondary]: button.type === 'secondary',
                })}
                {...buttonProps(button.href)}
              >
                {button.text}
              </Button>
            ))}
          </div>
        )}

        {offer.footnote && (
          <Typography
            variant="body1"
            className={cx({
              [classes.capMaxWidth]: !fullWidth,
              [classes.centerText]: !fullWidth,
              [classes.footnote]: true,
            })}
          >
            {offer.footnote}
          </Typography>
        )}
      </div>
    </Paper>
  );
};

// Be extra-cautious when accessing fields on promotionalOffers, since they are
// sourced from our external feature flag service. This function ensures that
// each field is the type consumers are expecting, subbing defaults if they
// aren't defined.
export const promotionalOfferOrDefaults = (
  offer: PromotionalOffer
): PromotionalOffer => ({
  alt: checkStringOrDefault(offer.alt),
  body: checkStringOrDefault(offer.body),
  buttons: offer.buttons ?? [],
  displayOnDashboard: offer.displayOnDashboard ?? false,
  features: offer.features ?? ['None'],
  footnote: checkStringOrDefault(offer.footnote),
  logo: checkStringOrDefault(offer.logo),
  name: checkStringOrDefault(offer.name),
});

export const checkStringOrDefault = (maybeString: any, defaultVal?: string) => {
  if (typeof maybeString === 'string') {
    return maybeString;
  } else if (defaultVal) {
    return defaultVal;
  }
  return '';
};

export const logoMap: Record<PromotionalOffer['logo'], any> = {
  'heavenly-bucket.svg': HeavenlyBucketIcon,
};

/**
 *
 * Given a URL:
 *
 * If it is a valid onsite (relative) URL, use the React Router Link component
 * so the app isn't reloaded.
 *
 * If it is a valid offsite (absolute) URL, use a regular anchor node with an
 * href and open in a new tab.
 *
 * If neither of the above conditions match, the URL is not considered safe, so
 * we don't include a link at all.
 */
const buttonProps = (url: string) => {
  let linkProps;

  if (onSiteURL.test(url)) {
    linkProps = {
      component: Link,
      to: url,
    };
  } else if (offSiteURL.test(url)) {
    linkProps = {
      href: url,
      rel: 'noopener noreferrer',
      target: '_blank',
    };
  }
  return linkProps;
};
