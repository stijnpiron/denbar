import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Icon,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import firebase from 'firebase';
import { useGetData } from 'hooks/useGetData';
import { FirestoreQueryOperators } from 'interfaces/firestore';
import { OrderProduct, OrderStatus } from 'interfaces/order';
import { useState } from 'react';
import { setAdminAuth, setAdminAuthAndReload } from 'utils/adminAuth';

interface OrdersPageProps {
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

const OrdersPage: React.FC<OrdersPageProps> = ({ adminAuth }) => {
  const classes = useStyles();

  const db = firebase.firestore();

  const [cancelOrderTableId, setCancelOrderTableId] = useState('');

  const [orders] = useGetData('Orders', {
    queryParams: {
      field: 'status',
      operator: FirestoreQueryOperators.EQUAL_TO,
      value: OrderStatus.NEW,
    },
  });
  const [tables] = useGetData('Tables', { docId: cancelOrderTableId });

  // Reload every 30 seconds to refresh to check if there are new orders
  setTimeout(() => {
    setAdminAuth();
    console.log('reload');

    window.location.reload();
  }, 30000);

  const handleDeliverOrder = (orderId: string) => {
    db.collection('Orders')
      .doc(orderId)
      .update({ status: OrderStatus.DELIVERED })
      .then(() => setAdminAuthAndReload());
  };

  const handleCancelOrder = async (orderId: string, tableId: string, orderAmount: number) => {
    setCancelOrderTableId(tableId);
    db.collection('Orders')
      .doc(orderId)
      .update({ status: OrderStatus.CANCELED })
      .then(() => {
        const tableAmount = tables.filter((t) => t.id === tableId)[0].value.amount;
        db.collection('Tables')
          .doc(tableId)
          .update({ amount: tableAmount - orderAmount })
          .then(() => setAdminAuthAndReload());
      });
  };

  return (
    <>
      <h1>Overzicht bestellingen</h1>
      {orders.length === 0 && 'Bestelling aan het laden of geen nieuwe bestellingen'}
      {orders
        .filter((o) => o.value.status !== OrderStatus.CANCELED)
        .sort((a, b) => b.value.date - a.value.date)
        .map((o) => (
          <Card className={classes.card} key={o.id}>
            <CardContent>
              {o.value.status === OrderStatus.NEW && <NewReleasesIcon />}
              {o.value.status === OrderStatus.DELIVERED && <CheckIcon />}
              <Typography gutterBottom variant="h5" component="h2">
                Tafel: {o.value.tableName}
              </Typography>
              <Typography>??? {o.value.amount}</Typography>
              <Typography variant="body2" color="textSecondary" component="ul">
                {o.value.products.map((p: OrderProduct) => (
                  <li key={p.id}>
                    {p.name}: {p.count}
                  </li>
                ))}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                disabled={o.value.status === OrderStatus.DELIVERED}
                aria-label="edit product"
                color="primary"
                component="span"
                onClick={() => handleDeliverOrder(o.id)}
              >
                <Icon>delivery_dining</Icon>
              </IconButton>
              <IconButton
                disabled={o.value.status === OrderStatus.DELIVERED}
                aria-label="remove product"
                color="secondary"
                component="span"
                onClick={() => handleCancelOrder(o.id, o.value.tableId, o.value.amount)}
              >
                <CancelIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
    </>
  );
};

export default OrdersPage;
