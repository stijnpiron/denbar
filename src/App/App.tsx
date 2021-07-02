import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import { MenuItem } from 'interfaces/menu';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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

const App: React.FC<AppProps> = ({ title, version, adminPincode }) => {
  let history = useHistory();
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [adminAuth, setAdminAuth] = useState(false);

  const handleDrawerOpen = () => {
    setMenuOpen(true);
  };

  const handleDrawerClose = () => {
    setMenuOpen(false);
  };

  const handleScanTable = (data: string) => {
    setSelectedTable(data);
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
    tablePageProps: { scanTable: handleScanTable, selectedTable },
    scanPageProps: { scanTable: handleScanTable },
    adminPageProps: { adminAuth, handleAdminAuth, pincodeLength: adminPincode.length },
    ordersPageProps: { adminAuth },
    checkoutPageProps: { adminAuth },
    qrCodesPageProps: { adminAuth },
  };

  return (
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
  );
};

export default App;
