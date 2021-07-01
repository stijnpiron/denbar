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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import firebase from 'firebase';
import { useGetData } from 'hooks/useGetData';
import { FirestoreProduct, Product } from 'interfaces/product';
import { Table, TableStatus } from 'interfaces/table';
import { useEffect, useRef, useState } from 'react';
import ReactCodeInput from 'react-code-input';

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
const newTableTemplate: Table = { name: '', amount: 0.0, status: TableStatus.OPEN };

const AdminPage: React.FC<AdminPageProps> = ({ adminAuth, handleAdminAuth, pincodeLength }) => {
  const classes = useStyles();
  const db = firebase.firestore();

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
      .catch((error: any) => console.error('Error writing adding new product: ', error));
    handleAddProductDialogClose();
  };

  const handleAddTable = () => {
    db.collection('Tables')
      .add({ ...newTable })
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
      .catch((error: any) => {
        console.error('Error editing document: ', error);
      });
    handleEditProductDialogClose();
  };

  const handleRemoveProduct = (productId: string) =>
    db
      .collection('Products')
      .doc(productId)
      .delete()
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
                    <Card className={classes.card}>
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
                </div>
                {tables
                  .sort((a, b) => (a.value.name > b.value.name ? 1 : -1))
                  .map((t) => (
                    <Card className={classes.card}>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {t.value.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          € {t.value.amount}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton aria-label="edit table" color="primary" component="span">
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="remove table" color="secondary" component="span">
                          <DeleteIcon />
                        </IconButton>
                        <IconButton aria-label="close table" color="secondary" component="span">
                          <CloseIcon />
                        </IconButton>
                        <IconButton aria-label="close table" color="secondary" component="span">
                          <Icon>qr_code</Icon>
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
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
          <Dialog disableBackdropClick disableEscapeKeyDown open={addTableDialog} onClose={handleAddTableDialogClose}>
            <DialogTitle>Nieuwe tafel</DialogTitle>
            <DialogContent>
              <form className={classes.container}>
                <FormControl className={classes.formControl}>
                  <TextField
                    variant="outlined"
                    type="text"
                    label="TableName"
                    onChange={(e: React.ChangeEvent<any>): void => handleNewTablePropertyChanged('name', e)}
                    value={newTable?.name}
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
