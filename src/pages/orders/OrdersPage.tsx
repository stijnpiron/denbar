import { Button, ButtonGroup, createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import firebase from 'firebase';
import { useGetData } from 'hooks/useGetData';
import { Redirect } from 'react-router-dom';

interface OrdersPageProps {
  [key: string]: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    li: {
      margin: 'auto',
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
    },
  })
);

// TODO: remove POC code when implementing real functionality
const makeid = (length: number = 10) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const makePrice = () => (Math.floor(Math.random() * 250) + 1) / 100;

const OrdersPage: React.FC<OrdersPageProps> = ({ adminAuth }) => {
  const classes = useStyles();

  const [products] = useGetData('Products');
  const db = firebase.firestore();

  // TOOD: figure out how to auto refresh the data displayed on screen when adding an item
  const handleAddItem = () => {
    console.log(db.collection('Products').get());
    db.collection('Products')
      .add({
        name: makeid(),
        price: makePrice(),
      })
      .then(function () {
        console.log('Value successfully written!');
      })
      .catch(function (error) {
        console.error('Error writing Value: ', error);
      });
  };

  return (
    <>
      {!adminAuth && <Redirect to="/admin" />}
      <Button onClick={handleAddItem}>Add item</Button>
      <ul>
        {products.map((p) => (
          <li className={classes.li}>
            <div>
              {p.value.name}: €{p.value.price}
            </div>
            <ButtonGroup variant="outlined" aria-label="outlined primary button group">
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
              <IconButton color="secondary">
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          </li>
        ))}
      </ul>
    </>
  );
};

export default OrdersPage;
