import { Snackbar } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { Alert, AlertTitle } from '@material-ui/lab';
import clsx from 'clsx';
import { MenuItem } from 'interfaces/menu';
import { SelectedTable } from 'interfaces/table';
import moment from 'moment';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { onMessageListener } from 'utils/firebase';
import Menu from './components/Menu';
import Router from './components/Router';

type AppProps = {
  title: string;
  version: string;
  adminPincode: string;
};

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      background: '#7aad55',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    hide: {
      display: 'none',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    root: {
      display: 'flex',
    },
    snackbar: {
      width: '100%',
      marginTop: 60,
      '& > * + *': {
        marginTop: 75,
      },
    },
    title: {
      alignItems: 'baseline',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    version: {
      fontSize: '12px',
    },
  })
);

const getSelectedTableData = (): SelectedTable => {
  const localStorageTable: SelectedTable = JSON.parse(localStorage.getItem('selectedTable') || '{}');
  if (moment(localStorageTable.scanned) < moment().subtract(2, 'hours')) {
    localStorage.removeItem('selectedTable');
    return { id: '', name: '' };
  }
  return localStorageTable;
};

const App: React.FC<AppProps> = ({ title, version, adminPincode }) => {
  let history = useHistory();
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<SelectedTable>(getSelectedTableData());
  const [adminAuth, setAdminAuth] = useState(moment(localStorage.getItem('admin')) > moment().subtract(1, 'second'));
  // const db = firebase.firestore();
  // const [newOrders, setNewOrders] = useState<string[]>([]);

  // TODO: fix new order notification
  // if (adminAuth) {
  // db.collection('Orders').onSnapshot((s) => {
  //   // let arr: any[] = [];
  //   s.docs.forEach((o) => {
  //     if (o.data().status === 'new') {
  //       if (!newOrders.includes(o.id)) {
  //         setNotification({ title: 'Nieuwe bestelling', body: `Bestelling ontvangen` });
  //         setShow(true);
  //       }
  //       setNewOrders([...newOrders, o.id]);
  //     }
  //   });
  // const newOrders = arr.filter((o) => o.value.status === 'new').length;

  // console.log(newOrders);
  // if (orders.filter((o) => o.value.status === 'new').length) {
  // });
  // }

  const [show, setShow] = useState(false);
  const [notification] = useState({ title: '', body: '' });

  onMessageListener()
    .then((payload: any) => {
      setShow(true);
      console.log(payload);
    })
    .catch((err) => console.log('failed: ', err));

  const handleDrawerOpen = () => {
    setMenuOpen(true);
  };

  const handleDrawerClose = () => {
    setMenuOpen(false);
  };

  const handleScanTable = (data: SelectedTable) => {
    console.log({ data });

    setSelectedTable(data);
    localStorage.setItem('selectedTable', JSON.stringify(data));
    history.push('/table');
  };

  const handleAdminAuth = (pincode: any) => {
    if (pincode === adminPincode) {
      setAdminAuth(true);
      return true;
    }
    return false;
  };

  const parts: MenuItem[][] = [
    [
      {
        alwaysEnabled: true,
        icon: 'qr_code_scanner',
        key: 'TafelScannen',
        route: 'scan',
        text: 'Tafel scannen',
      },
    ],
    [{ icon: 'local_bar', key: 'Bestellen', route: 'table', text: 'Bestel' }],
    [
      {
        alwaysEnabled: true,
        icon: 'receipt',
        key: 'Bestellingen',
        route: 'orders',
        text: 'Bestellingen',
        hide: !adminAuth,
      },
      {
        alwaysEnabled: true,
        icon: 'euro',
        key: 'Afrekenen',
        route: 'checkout',
        text: 'Afrekenen',
        hide: !adminAuth,
      },
      {
        alwaysEnabled: true,
        icon: 'playlist_add_check',
        key: 'Admin',
        route: 'admin',
        text: 'Admin',
      },
    ],
  ];

  const menuProps = { parts, selectedTable: !!selectedTable, handleDrawerClose, menuOpen };
  const routerProps = {
    tablePageProps: { selectedTable },
    scanPageProps: { scanTable: handleScanTable },
    adminPageProps: { adminAuth, handleAdminAuth, pincodeLength: adminPincode.length },
    ordersPageProps: { adminAuth },
    checkoutPageProps: { adminAuth },
    qrCodesPageProps: { adminAuth },
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2500}
        open={show}
        onClose={() => setShow(false)}
        key="feedback"
        className={classes.snackbar}
      >
        <Alert severity="info" onClose={() => setShow(false)}>
          <AlertTitle>{notification.title}</AlertTitle>
          {notification.body}
        </Alert>
      </Snackbar>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: menuOpen,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, menuOpen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              <span>{title}</span>
              {!menuOpen && <span className={classes.version}>v{version}</span>}
            </Typography>
          </Toolbar>
        </AppBar>
        <Menu {...menuProps} />
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: menuOpen,
          })}
        >
          <Toolbar />
          <Router {...routerProps} />
        </main>
      </div>
    </>
  );
};

export default App;
