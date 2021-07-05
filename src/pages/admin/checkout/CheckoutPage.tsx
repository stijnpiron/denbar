import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import EuroIcon from '@material-ui/icons/Euro';
import firebase from 'firebase';
import { useGetData } from 'hooks/useGetData';
import { OrderStatus } from 'interfaces/order';
import { TableStatus } from 'interfaces/table';
import { Redirect } from 'react-router-dom';
import { setAdminAuthAndReload } from 'utils/adminAuth';

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

  const db = firebase.firestore();

  const [tables] = useGetData('Tables');
  const [orders] = useGetData('Orders');

  const handleCheckoutTable = (tableId: string) =>
    db
      .collection('Tables')
      .doc(tableId)
      .update({ status: TableStatus.PAYED })
      .then(() => setAdminAuthAndReload());

  return (
    <>
      {!adminAuth && <Redirect to="/admin" />}
      <div>Afrekenen</div>
      {tables
        .filter(
          (t) => t.value.status !== TableStatus.CLOSED && t.value.status !== TableStatus.PAYED && t.value.amount > 0
        )
        .map((t) => (
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
              <IconButton
                disabled={
                  orders
                    .filter((o) => o.value.tableId === t.id)
                    .filter((o) => o.value.status === OrderStatus.NEW || o.value.status === OrderStatus.OPENED).length >
                  0
                }
                aria-label="checkout table"
                color="primary"
                component="span"
                onClick={() => handleCheckoutTable(t.id)}
              >
                {orders
                  .filter((o) => o.value.tableId === t.id)
                  .filter((o) => o.value.status === OrderStatus.NEW || o.value.status === OrderStatus.OPENED).length >
                0 ? (
                  <div>Tafel afrekenen gaat niet: openstaande bestelling(en) voor deze tafel</div>
                ) : (
                  <EuroIcon />
                )}
              </IconButton>
              {/* 
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
