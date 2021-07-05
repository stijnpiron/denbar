import { Card, CardActions, CardContent, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import { useGetData } from 'hooks/useGetData';
import { OrderProduct } from 'interfaces/order';

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

  const [orders] = useGetData('Orders');

  // Reload every 10 seconds to refresh to check if there are new orders
  setTimeout(() => {
    localStorage.setItem('admin', new Date().toString());
    console.log('reload');

    window.location.reload();
  }, 10000);

  return (
    <>
      {orders
        .sort((a, b) => b.value.date - a.value.date)
        .map((o) => (
          <Card className={classes.card} key={o.id}>
            <CardContent>
              {o.value.status === 'new' && <NewReleasesIcon />}
              <Typography gutterBottom variant="h5" component="h2">
                Tafel: {o.value.tableName}
              </Typography>
              <Typography>€ {o.value.amount}</Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                <ul>
                  {o.value.products.map((p: OrderProduct) => (
                    <li>
                      {p.name}: {p.count}
                    </li>
                  ))}
                </ul>
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

export default OrdersPage;
