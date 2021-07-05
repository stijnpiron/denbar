import {
  Button,
  Checkbox,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useGetData } from 'hooks/useGetData';
import { SelectedTable, TableStatus } from 'interfaces/table';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Redirect } from 'react-router-dom';

interface QrCodesPageProps {
  adminAuth: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    qrCode: {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
    },
    qrCodes: {
      display: 'flex',
      flexFlow: 'row wrap',
    },
    qrCodeTitle: {
      fontSize: 24,
      fontWeight: 900,
      marginBottom: 25,
    },
  })
);

const QrCodesPage: React.FC<QrCodesPageProps> = ({ adminAuth }) => {
  const classes = useStyles();

  const [tables] = useGetData('Tables');
  const [selectedTables, setSelectedTables] = useState<SelectedTable[]>([]);
  const [showQrCodes, setShowQrCodes] = useState(false);

  const toggleShowQrCodes = () => setShowQrCodes(!showQrCodes);

  function findWithAttr(array: any[], attr: string, value: any): number {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }

  const handleSelectTable = (id: string) => () => {
    const currentSelectedTableItemIndex = findWithAttr(selectedTables, 'id', id);
    const currentTableItemIndex = findWithAttr(tables, 'id', id);
    const newChecked = [...selectedTables];

    if (currentSelectedTableItemIndex === -1) {
      newChecked.push({ id: tables[currentTableItemIndex].id, name: tables[currentTableItemIndex].value.name });
    } else {
      newChecked.splice(currentSelectedTableItemIndex, 1);
    }

    setSelectedTables(newChecked);
  };

  return (
    (!adminAuth && <Redirect to="/admin" />) || (
      <>
        {(!showQrCodes && (
          <>
            <List className={classes.list}>
              {tables
                .filter((t) => t.value.status === TableStatus.OPEN)
                .map((t) => (
                  <ListItem key={t.id} role={undefined} dense button onClick={handleSelectTable(t.id)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={findWithAttr(selectedTables, 'id', t.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': t.id }}
                      />
                    </ListItemIcon>
                    <ListItemText id={t.id} primary={`Tafel: ${t.value.name}`} />
                  </ListItem>
                ))}
            </List>
            <Button disabled={!!!selectedTables.length} variant="contained" color="primary" onClick={toggleShowQrCodes}>
              Toon QR Codes
            </Button>
          </>
        )) ||
          (showQrCodes && (
            <div className={classes.qrCodes}>
              {selectedTables.map((t) => (
                <div className={classes.qrCode} key={t.id}>
                  <div className={classes.qrCodeTitle}>Tafel: {t.name}</div>
                  {/* TODO: toggle next lines if not in development and for livee testing, remove second line for productino */}
                  <QRCode value={`${window.location.origin}/#/table/${t.id}`} />
                  {/* <QRCode size={200} value={`https://localhost:3000/#/table/${t.id}`} /> */}
                </div>
              ))}
            </div>
          ))}
      </>
    )
  );
};

export default QrCodesPage;
