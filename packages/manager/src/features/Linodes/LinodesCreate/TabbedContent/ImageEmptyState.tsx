import * as React from 'react';
import Paper from 'src/components/core/Paper';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import { Notice } from 'src/components/Notice/Notice';

const useStyles = makeStyles((theme: Theme) => ({
  emptyImagePanelText: {
    marginTop: theme.spacing(1),
    padding: `${theme.spacing(1)} 0`,
  },
}));

interface Props {
  errorText: string | undefined;
  className?: string;
}

export const ImageEmptyState: React.FC<Props> = (props) => {
  const { className, errorText } = props;
  const classes = useStyles();

  return (
    <Paper className={className}>
      {errorText ? <Notice error text={errorText} /> : null}
      <Typography variant="h2" data-qa-tp="Select Image">
        Select Image
      </Typography>
      <Typography
        variant="body1"
        className={classes.emptyImagePanelText}
        data-qa-no-compatible-images
      >
        No Compatible Images Available
      </Typography>
    </Paper>
  );
};

export default ImageEmptyState;
