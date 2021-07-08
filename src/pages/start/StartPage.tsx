import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Title: {
      fontSize: 24,
      fontWeight: 900,
    },
  })
);

const StartPage: React.FC = () => {
  const classes = useStyles();

  return <div className={classes.Title}>Scan een QR Code om een bestelling te kunnen plaatsen</div>;
};

export default StartPage;
