import classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

type ClassNames = 'link' | 'noCount' | 'count' | 'countNumber';

interface Props {
  text: string;
  link: string;
  count?: number;
  external?: boolean;
  className?: any;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const styles = (theme: Theme) =>
  createStyles({
    count: {
      marginRight: theme.spacing(0.5),
    },
    countNumber: {
      fontFamily: theme.font.bold,
    },
    link: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    noCount: {
      marginLeft: theme.spacing(1),
    },
  });

const ViewAllLink: React.FC<CombinedProps> = (props) => {
  const { className, classes, count, external, link, text } = props;
  return (
    <>
      {count && (
        <span className={classes.count}>
          (
          <span className={classes.countNumber} data-qa-entity-count={count}>
            {count}
          </span>
          )
        </span>
      )}
      {!external ? (
        <Link
          to={link}
          className={classNames(
            {
              [classes.link]: true,
              [classes.noCount]: !count,
            },
            className
          )}
          data-qa-view-all-link
        >
          {text}
        </Link>
      ) : (
        <a
          href={link}
          className={classNames({
            [classes.link]: true,
            [classes.noCount]: !count,
          })}
          data-qa-view-all-link
          target="_blank"
          aria-describedby="external-site"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      )}
    </>
  );
};

const styled = withStyles(styles);

export default styled(ViewAllLink);
