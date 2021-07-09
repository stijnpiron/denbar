import {
  Accordion,
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Icon,
  IconButton,
  makeStyles,
  Snackbar,
  TextField,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EuroIcon from '@material-ui/icons/Euro';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import firebase from 'firebase';
import { useGetData } from 'hooks/useGetData';
import { OrderStatus } from 'interfaces/order';
import { FirestoreProduct, Product } from 'interfaces/product';
import { Table, TableStatus } from 'interfaces/table';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import ReactCodeInput from 'react-code-input';
import { useHistory } from 'react-router-dom';
import { setAdminAuthAndReload } from 'utils/adminAuth';

interface AdminPageProps {
  adminAuth: boolean;
  handleAdminAuth: (pincode: any) => boolean;
  pincodeLength: number;
}

const Alert = (props: AlertProps) => <MuiAlert elevation={6} variant="filled" {...props} />;

const AccordionSummary = withStyles({
  content: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexFlow: 'column nowrap',
  },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    container: {
      alignItems: 'stretch',
      display: 'flex',
      flexFlow: 'column',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    card: {
      minWidth: 275,
      margin: 15,
    },
    disabledCard: {
      minWidth: 275,
      background: 'lightgrey',
      margin: 15,
      '& > * + *': {
        color: 'grey',
      },
    },
    pinCode: {
      margin: 'auto',
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 200,
    },
    productActions: {
      marginLeft: 50,
    },
    snackbar: {
      width: '100%',
      marginTop: 60,
      '& > * + *': {
        marginTop: 75,
      },
    },
  })
);

const newProductTemplate: Product = { name: '', price: 0.0 };
const editProductTemplate: FirestoreProduct = { id: '', value: { name: '', price: 0.0 } };
const newTableTemplate: Table = { name: '', amount: 0.0, status: TableStatus.OPEN, date: '', note: '' };

const AdminPage: React.FC<AdminPageProps> = ({ adminAuth, handleAdminAuth, pincodeLength }) => {
  const classes = useStyles();
  const db = firebase.firestore();
  let history = useHistory();

  const [pincode, setPincode] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [editProductDialog, setEditProductDialog] = useState(false);
  const [addTableDialog, setAddTableDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>(newProductTemplate);
  const [editProduct, setEditProduct] = useState<FirestoreProduct>(editProductTemplate);
  const [newTable, setNewTable] = useState<Table>(newTableTemplate);
  const [validNewProduct, setValidNewProduct] = useState(false);
  const [validEditProduct, setValidEditProduct] = useState(false);
  const [validNewTable, setValidNewTable] = useState(false);

  const [products] = useGetData('Products');
  const [tables] = useGetData('Tables');
  const [orders] = useGetData('Orders');

  const handlePinCodeChange = (data: any) => setPincode(data);
  const handleAddProductDialogOpen = () => setAddProductDialog(true);
  const handleAddProductDialogClose = () => {
    setNewProduct(newProductTemplate);
    setAddProductDialog(false);
  };
  const handleEditProductDialogOpen = () => setEditProductDialog(true);
  const handleEditProductDialogClose = () => {
    setEditProduct(editProductTemplate);
    setEditProductDialog(false);
  };
  const handleAddTableDialogOpen = () => setAddTableDialog(true);
  const handleAddTableDialogClose = () => {
    setNewTable(newTableTemplate);
    setAddTableDialog(false);
  };
  const handleNewProductPropertyChanged = (key: string, e: React.ChangeEvent<any>): void =>
    setNewProduct({ ...newProduct, [key]: e.target.value });
  const handleEditProductPropertyChanged = (key: string, e: React.ChangeEvent<any>): void =>
    setEditProduct({ ...editProduct, value: { ...editProduct.value, [key]: e.target.value } });
  const handleNewTablePropertyChanged = (key: string, e: React.ChangeEvent<any>): void =>
    setNewTable({ ...newTable, [key]: e.target.value });

  const handleAddProduct = () => {
    db.collection('Products')
      .add({ ...newProduct })
      .then(() => setAdminAuthAndReload())
      .catch((error: any) => console.error('Error writing adding new product: ', error));
    handleAddProductDialogClose();
  };

  const handleAddTable = () => {
    db.collection('Tables')
      .add({ ...newTable, date: moment().format('DD/MM/yyyy').toString() })
      .then(() => setAdminAuthAndReload())
      .catch((error: any) => console.error('Error writing adding new table: ', error));
    handleAddTableDialogClose();
  };

  const handleStartEditProduct = (product: FirestoreProduct) => {
    setEditProduct(product);
    handleEditProductDialogOpen();
  };

  const handleEditProduct = () => {
    db.collection('Products')
      .doc(editProduct.id)
      .update({ name: editProduct.value.name, price: editProduct.value.price })
      .then(() => setAdminAuthAndReload())
      .catch((error: any) => {
        console.error('Error editing document: ', error);
      });
    handleEditProductDialogClose();
  };

  const handleCloseTable = (tableId: string) => {
    db.collection('Tables')
      .doc(tableId)
      .update({ status: 'closed' })
      .then(() => setAdminAuthAndReload());
  };

  const handleRemoveProduct = (productId: string) =>
    db
      .collection('Products')
      .doc(productId)
      .delete()
      .then(() => setAdminAuthAndReload())
      .catch((error: any) => {
        console.error('Error removing document: ', error);
      });

  const handleLogin = () => {
    setFeedbackVisible(true);
    setAuthSuccess(handleAdminAuth(pincode));
    clearPincode();
  };

  const handleFeedbackClose = () => setFeedbackVisible(false);

  const feedbackMessage = authSuccess ? 'Login geslaagd' : 'Verkeerde pincode';

  const codeRef = useRef<any>(null);

  const clearPincode = () => {
    if (codeRef.current.textInput[0]) codeRef.current.textInput[0].focus();
    for (let i = 0; i < pincodeLength; i++) {
      codeRef.current.state.input[i] = '';
    }
    setPincode('');
  };

  useEffect(() => {
    setValidNewProduct(!!newProduct.name && !!newProduct.price);
  }, [newProduct]);

  useEffect(() => {
    setValidEditProduct(!!editProduct.value.name && !!editProduct.value.price);
  }, [editProduct]);

  useEffect(() => {
    setValidNewTable(!!newTable.name);
  }, [newTable]);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2500}
        open={feedbackVisible}
        onClose={handleFeedbackClose}
        key="feedback"
        className={classes.snackbar}
      >
        <Alert severity={authSuccess ? 'success' : 'error'} onClose={handleFeedbackClose}>
          {feedbackMessage}
        </Alert>
      </Snackbar>
      {!adminAuth && (
        <div className={classes.pinCode}>
          <ReactCodeInput
            ref={codeRef}
            name="admin-pin"
            inputMode="numeric"
            type="password"
            fields={pincodeLength}
            onChange={handlePinCodeChange}
            value={pincode}
          />
          <Button disabled={pincode.length < pincodeLength} variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </div>
      )}
      {adminAuth && (
        <>
          <div>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="product-panel-content"
                id="product-panel-header"
              >
                <Typography>Producten</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.addButtonContainer}>
                  <IconButton
                    color="primary"
                    aria-label="add product"
                    component="span"
                    onClick={handleAddProductDialogOpen}
                  >
                    <AddRoundedIcon />
                  </IconButton>
                </div>
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
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
              </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="table-panel-content"
                id="table-panel-header"
              >
                <Typography>Tafels</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.addButtonContainer}>
                  <IconButton
                    color="primary"
                    aria-label="add table"
                    component="span"
                    onClick={handleAddTableDialogOpen}
                  >
                    <AddRoundedIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label="get qr cdes"
                    component="span"
                    onClick={() => history.push('/qr-codes')}
                  >
                    <Icon>qr_code</Icon>
                  </IconButton>
                </div>
                <>
                  {tables
                    .filter((t) => t.value.status !== 'closed')
                    .sort((a, b) => (a.value.name > b.value.name ? 1 : -1))
                    .map((t) => (
                      <Card className={classes.card} key={t.id}>
                        <CardContent>
                          {t.value.status === TableStatus.PAYED && <EuroIcon />}
                          <Typography gutterBottom variant="h5" component="h2">
                            {t.value.name} - {t.value.date}
                          </Typography>
                          <Typography variant="body1" color="textSecondary" component="p">
                            {t.value.note}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            € {parseFloat(t.value.amount.toString()).toFixed(2) || '0'}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          {/* <IconButton aria-label="edit table" color="primary" component="span">
                          <EditIcon />
                        </IconButton> */}
                          <IconButton
                            disabled={
                              orders
                                .filter((o) => o.value.tableId === t.id)
                                .filter(
                                  (o) => o.value.status === OrderStatus.NEW || o.value.status === OrderStatus.OPENED
                                ).length > 0 || t.value.amount > 0
                            }
                            aria-label="remove table"
                            color="secondary"
                            component="span"
                            onClick={() => handleCloseTable(t.id)}
                          >
                            {orders
                              .filter((o) => o.value.tableId === t.id)
                              .filter(
                                (o) => o.value.status === OrderStatus.NEW || o.value.status === OrderStatus.OPENED
                              ).length > 0 ? (
                              <div>Tafel afsluiten gaat niet: openstaande bestelling(en) voor deze tafel</div>
                            ) : t.value.status !== TableStatus.PAYED ? (
                              <div>Tafel afsluiten gaat niet: openstaand saldo voor deze tafel</div>
                            ) : (
                              <CloseIcon />
                            )}
                          </IconButton>
                          {/* <IconButton aria-label="close table" color="secondary" component="span">
                          <CloseIcon />
                        </IconButton>
                        <IconButton aria-label="close table" color="secondary" component="span">
                          <Icon>qr_code</Icon>
                        </IconButton> */}
                        </CardActions>
                      </Card>
                    ))}
                  {tables
                    .filter((t) => t.value.status === 'closed')
                    .sort((a, b) => (a.value.name > b.value.name ? 1 : -1))
                    .map((t) => (
                      <Card className={classes.disabledCard} key={t.id}>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {t.value.name} - {t.value.date}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            € {t.value.amount}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                </>
              </AccordionDetails>
            </Accordion>
          </div>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={addProductDialog}
            onClose={handleAddProductDialogClose}
          >
            <DialogTitle>Nieuw product aanmaken</DialogTitle>
            <DialogContent>
              <form className={classes.container}>
                <FormControl className={classes.formControl}>
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Productnaam"
                    onChange={(e: React.ChangeEvent<any>): void => handleNewProductPropertyChanged('name', e)}
                    value={newProduct?.name}
                  ></TextField>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    variant="outlined"
                    type="number"
                    label="Prijs"
                    onChange={(e: React.ChangeEvent<any>): void => handleNewProductPropertyChanged('price', e)}
                    value={newProduct?.price}
                    InputProps={{
                      inputProps: {
                        max: 50,
                        min: 0.1,
                      },
                    }}
                  ></TextField>
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddProductDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={!validNewProduct} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={editProductDialog}
            onClose={handleEditProductDialogClose}
          >
            <DialogTitle>Product aanpassen</DialogTitle>
            <DialogContent>
              <form className={classes.container}>
                <FormControl className={classes.formControl}>
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Productnaam"
                    onChange={(e: React.ChangeEvent<any>): void => handleEditProductPropertyChanged('name', e)}
                    value={editProduct?.value.name}
                  ></TextField>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    variant="outlined"
                    type="number"
                    label="Prijs"
                    onChange={(e: React.ChangeEvent<any>): void => handleEditProductPropertyChanged('price', e)}
                    value={editProduct?.value.price}
                    InputProps={{
                      inputProps: {
                        max: 50,
                        min: 0.1,
                      },
                    }}
                  ></TextField>
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEditProductDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEditProduct} disabled={!validEditProduct} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          {/* TODO: edit table dialog to add note */}
          <Dialog disableBackdropClick disableEscapeKeyDown open={addTableDialog} onClose={handleAddTableDialogClose}>
            <DialogTitle>Nieuwe tafel</DialogTitle>
            <DialogContent>
              <form className={classes.container}>
                <FormControl className={classes.formControl}>
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Tafel naam"
                    onChange={(e: React.ChangeEvent<any>): void => handleNewTablePropertyChanged('name', e)}
                    value={newTable?.name}
                  ></TextField>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Tafel notitie"
                    onChange={(e: React.ChangeEvent<any>): void => handleNewTablePropertyChanged('note', e)}
                    value={newTable?.note}
                  ></TextField>
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddTableDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddTable} disabled={!validNewTable} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default AdminPage;
