import { Card, CardActions, CardContent, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { useGetData } from 'hooks/useGetData';
import { Redirect } from 'react-router-dom';

interface CheckoutPageProps {
  adminAuth: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 275,
      margin: 15,
    },
  })
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({ adminAuth }) => {
  const classes = useStyles();

  const [tables] = useGetData('Tables');

  return (
    <>
      {!adminAuth && <Redirect to="/admin" />}
      <div>Afrekenen</div>
      {tables.map((t) => (
        <Card className={classes.card} key={t.id}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {t.value.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              € {t.value.amount}
            </Typography>
          </CardContent>
          <CardActions>
            {/* <IconButton
              aria-label="edit product"
              color="primary"
              component="span"
              onClick={() => handleStartEditProduct(p)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="remove product"
              color="secondary"
              component="span"
              onClick={() => handleRemoveProduct(p.id)}
            >
              <DeleteIcon />
            </IconButton> */}
          </CardActions>
        </Card>
      ))}
    </>
  );
};

export default CheckoutPage;
