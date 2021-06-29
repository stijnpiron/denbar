import {
  createStyles,
  Divider,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { MenuItem } from 'interfaces/menu';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type MenuPageProps = {
  handleDrawerClose: () => void;
  parts: MenuItem[][];
  selectedTable: boolean;
  menuOpen: boolean;
};

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      flexShrink: 0,
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    drawerPaper: {
      width: drawerWidth,
    },
    linkButton: {
      color: '#000000',
    },
  })
);

const Menu: React.FC<MenuPageProps> = ({ parts, selectedTable, handleDrawerClose, menuOpen }) => {
  const classes = useStyles();
  const theme = useTheme();

  const menuParts = parts
    .map((part, i) => (i < parts.length - 1 ? [part, <Divider key={i} />] : [part]))
    .reduce((res, curr) => [...res, ...curr]);

  const currentRoute = useLocation().pathname.replace('/', '');

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={menuOpen}
      variant="persistent"
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <div className={classes.drawerContainer}>
        {menuParts.map((part, i) =>
          Array.isArray(part) ? (
            <List key={`list-${i}`}>
              {part
                .filter((mi) => !mi.hide)
                .map((mi) => (
                  <ListItem
                    button
                    selected={currentRoute.includes(mi.route || 'no-route')}
                    key={mi.key}
                    component={mi.disabled || (!selectedTable && !mi.alwaysEnabled) || !mi.route ? 'li' : Link}
                    onClick={handleDrawerClose}
                    to={mi.route ? `/${mi.route}` : undefined}
                    disabled={!mi.alwaysEnabled && (mi.disabled || !selectedTable)}
                    className={classes.linkButton}
                  >
                    <ListItemIcon>
                      <Icon>{mi.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={mi.text} />
                  </ListItem>
                ))}
            </List>
          ) : (
            part
          )
        )}
      </div>
    </Drawer>
  );
};

export default Menu;
