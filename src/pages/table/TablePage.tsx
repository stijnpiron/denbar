import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
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
import { Product } from 'interfaces/product';
import { SelectedTable, TableStatus } from 'interfaces/table';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import scrollToTop from 'utils/scrollToTop';

interface TablePageProps {
  selectedTable: SelectedTable;
}

const orderButtonHeight = 50;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 275,
      margin: 15,
    },
    cardContent: {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 0,
    },
    cardHeader: {
      paddingBottom: 0,
    },
    cardActions: {
      padding: 0,
    },
    cardActionButton: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    overflow: {
      overflowY: 'scroll',
    },
    productList: {
      height: `calc(100% - ${orderButtonHeight}px)`,
    },
    orderButton: {
      height: orderButtonHeight,
      width: 'calc(100% - 48px)',
      backgroundColor: '#FAFAFA',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
    },
  })
);

const db = firebase.firestore();

const TablePage: React.FC<TablePageProps> = ({ selectedTable }) => {
  const classes = useStyles();

  const [selectedProducts, setSelectedProducts] = useState<OrderProducts>({});
  const [showOrderOverview, setShowOrderOverview] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0.0);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [products] = useGetData('Products');
  const [tables] = useGetData('Tables');

  const handleShowOrderOverview = () => {
    setShowOrderOverview(true);
    scrollToTop();
  };

  const handleBackToPlaceOrder = () => {
    setShowOrderOverview(false);
    scrollToTop();
  };

  const handleAddProduct = (productId: string) => {
    const product: Product = products.filter((p) => p.id === productId)[0].value;
    const newTotalAmount = totalAmount + +parseFloat(product.price.toString()).toFixed(2);
    setTotalAmount(newTotalAmount);
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
    window.location.reload();
  };

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    const table = tables.filter((t) => t.id === selectedTable.id)[0];
    const newTableAmount = (parseFloat(table.value.amount) || 0) + totalAmount;
    db.collection('Orders')
      .add({
        tableId: selectedTable.id,
        tableName: selectedTable.name,
        date: new Date(),
        products: Object.values(selectedProducts),
        amount: totalAmount,
        status: OrderStatus.NEW,
      })
      .then(() =>
        db
          .collection('Tables')
          .doc(selectedTable.id)
          .update({ amount: parseFloat(newTableAmount.toString()).toFixed(2) })
          .then(() => {
            localStorage.setItem('selectedTable', JSON.stringify({ ...selectedTable, amount: newTableAmount }));
            clearOrder();
          })
          .catch((error: any) => {
            console.error('Error editing table: ', error);
          })
      )
      .catch((error: any) => console.error('Error writing new order: ', error));
  };

  return tables.length ? (
    tables.filter((t) => t.id === selectedTable.id).filter((t) => t.value.status === TableStatus.OPEN).length === 0 ? (
      <Redirect to="/scan" />
    ) : !showOrderOverview ? (
      <>
        <Box component="div" className={classes.productList}>
          <div>Plaats een bestelling voor tafel {selectedTable.name}</div>
          <div>
            Totaal reeds geplaatste bestellingen: €{' '}
            {parseFloat(selectedTable?.amount?.toString() || '0').toFixed(2) || 0}
          </div>
          <div>Totaal voor deze bestelling: € {parseFloat(totalAmount.toString()).toFixed(2) || 0}</div>
          <div className={classes.overflow}>
            {products
              .sort((a, b) => (a.value.name > b.value.name ? 1 : -1))
              .map((p) => (
                <Card className={classes.card} key={p.id}>
                  <CardHeader className={classes.cardHeader} title={p.value.name} />
                  <CardContent className={classes.cardContent}>
                    <Typography variant="body2" color="textSecondary" component="p">
                      € {p.value.price}
                    </Typography>
                    <CardActions className={classes.cardActions}>
                      <IconButton
                        className={classes.cardActionButton}
                        aria-label="remove product"
                        color="secondary"
                        component="span"
                        disabled={!(selectedProducts[p.id]?.count > 0)}
                        onClick={() => handleRemoveProduct(p.id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <div>{selectedProducts[p.id]?.count || 0}</div>
                      <IconButton
                        className={classes.cardActionButton}
                        aria-label="add product"
                        color="primary"
                        component="span"
                        onClick={() => handleAddProduct(p.id)}
                      >
                        <AddIcon />
                      </IconButton>
                    </CardActions>
                  </CardContent>
                </Card>
              ))}
          </div>
        </Box>
        <div className={classes.orderButton}>
          <Button
            disabled={!Object.keys(selectedProducts).length}
            variant="outlined"
            color="primary"
            onClick={handleShowOrderOverview}
          >
            Bestellen
          </Button>
        </div>
      </>
    ) : (
      <>
        <Box component="div" className={classes.productList}>
          <div>Overzicht bestelling</div>
          <div>Totaal voor deze bestelling: € {totalAmount.toFixed(2)}</div>
          <div>
            {Object.values(selectedProducts)
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((p) => (
                <Card className={classes.card} key={p.id}>
                  <CardHeader className={classes.cardHeader} title={p.name} />
                  <CardContent className={classes.cardContent}>
                    <Typography variant="body2" color="textSecondary" component="p">
                      € {p.price}
                    </Typography>
                    <CardActions className={classes.cardActions}>
                      <IconButton
                        className={classes.cardActionButton}
                        aria-label="remove product"
                        color="secondary"
                        component="span"
                        disabled={!(selectedProducts[p.id]?.count > 0)}
                        onClick={() => handleRemoveProduct(p.id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <div>{selectedProducts[p.id]?.count || 0}</div>
                      <IconButton
                        className={classes.cardActionButton}
                        aria-label="edit product"
                        color="primary"
                        component="span"
                        onClick={() => handleAddProduct(p.id)}
                      >
                        <AddIcon />
                      </IconButton>
                    </CardActions>
                  </CardContent>
                </Card>
              ))}
          </div>
        </Box>
        <div className={classes.orderButton}>
          <Button color="secondary" onClick={handleBackToPlaceOrder}>
            terug
          </Button>
          <Button variant="outlined" color="primary" onClick={handlePlaceOrder} disabled={placingOrder}>
            {placingOrder && <CircularProgress size={20} />}&nbsp;Bestellen
          </Button>
        </div>
      </>
    )
  ) : (
    <div>Loading table data</div>
  );
};

export default TablePage;
