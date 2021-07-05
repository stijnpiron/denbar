import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import firebase from 'firebase';
import { useGetData } from 'hooks/useGetData';
import { OrderProducts, OrderStatus } from 'interfaces/order';
import { SelectedTable } from 'interfaces/table';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

interface TablePageProps {
  selectedTable: SelectedTable;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 275,
      margin: 15,
    },
    overflow: {
      overflowY: 'scroll',
    },
  })
);

const db = firebase.firestore();

const TablePage: React.FC<TablePageProps> = ({ selectedTable }) => {
  const classes = useStyles();

  const [selectedProducts, setSelectedProducts] = useState<OrderProducts>({});
  const [showOrderOverview, setShowOrderOverview] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0.0);

  const [products] = useGetData('Products');
  const [tables] = useGetData('Tables');

  const handleAddProduct = (productId: string) => {
    const product = products.filter((p) => p.id === productId)[0].value;
    setTotalAmount(totalAmount + +product.price);
    setSelectedProducts({
      ...selectedProducts,
      [productId]: {
        ...product,
        id: productId,
        count: selectedProducts[productId]?.count + 1 || 1,
      },
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setTotalAmount(totalAmount - products.filter((p) => p.id === productId)[0].value.price);
    if (selectedProducts[productId]?.count === 1) {
      const { [productId]: _, ...newSelectedProducts } = selectedProducts;
      setSelectedProducts({ ...newSelectedProducts });
    } else {
      setSelectedProducts({
        ...selectedProducts,
        [productId]: { ...selectedProducts[productId], count: selectedProducts[productId].count - 1 },
      });
    }
  };

  if (!selectedTable.id) {
    return <Redirect to="/" />;
  }

  const clearOrder = () => {
    // setSelectedProducts({});
    // setShowOrderOverview(false);
    // setTotalAmount(0);
    window.location.reload();
  };

  const handlePlaceOrder = () => {
    db.collection('Orders')
      .add({
        tableId: selectedTable.id,
        tableName: selectedTable.name,
        date: new Date(),
        products: Object.values(selectedProducts),
        amount: totalAmount,
        status: OrderStatus.NEW,
      })
      .then(() => clearOrder())
      .catch((error: any) => console.error('Error writing new order: ', error));
    db.collection('Tables')
      .doc(selectedTable.id)
      .update({ amount: (selectedTable.amount || 0) + totalAmount });
  };

  return !showOrderOverview ? (
    <>
      <div>Plaats een bestelling voor tafel {selectedTable.name}</div>
      <div>Totaal reeds geplaatste bestellingen: € {selectedTable?.amount?.toFixed(2) || 0}</div>
      <div>Totaal voor deze bestelling: € {totalAmount.toFixed(2)}</div>
      <div className={classes.overflow}>
        {products
          .sort((a, b) => (a.value.name > b.value.name ? 1 : -1))
          .map((p) => (
            <Card className={classes.card} key={p.id}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {p.value.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  € {p.value.price}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  aria-label="edit product"
                  color="primary"
                  component="span"
                  onClick={() => handleAddProduct(p.id)}
                >
                  <AddIcon />
                </IconButton>
                <div>{selectedProducts[p.id]?.count || 0}</div>
                <IconButton
                  aria-label="remove product"
                  color="secondary"
                  component="span"
                  disabled={!(selectedProducts[p.id]?.count > 0)}
                  onClick={() => handleRemoveProduct(p.id)}
                >
                  <RemoveIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
      </div>
      <Button variant="contained" color="primary" onClick={() => setShowOrderOverview(true)}>
        Bestellen
      </Button>
    </>
  ) : (
    <>
      <div>Overzicht bestelling</div>
      <div>Totaal voor deze bestelling: € {totalAmount.toFixed(2)}</div>
      <div>
        {Object.values(selectedProducts)
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((p) => (
            <Card className={classes.card} key={p.id}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {p.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  € {p.price}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  aria-label="edit product"
                  color="primary"
                  component="span"
                  onClick={() => handleAddProduct(p.id)}
                >
                  <AddIcon />
                </IconButton>
                <div>{selectedProducts[p.id]?.count || 0}</div>
                <IconButton
                  aria-label="remove product"
                  color="secondary"
                  component="span"
                  disabled={!(selectedProducts[p.id]?.count > 0)}
                  onClick={() => handleRemoveProduct(p.id)}
                >
                  <RemoveIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
      </div>
      <Button color="secondary" onClick={() => setShowOrderOverview(false)}>
        terug
      </Button>
      <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
        Bestellen
      </Button>
    </>
  );
};

export default TablePage;
