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
import { TableStatus } from 'interfaces/table';
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
  })
);

const QrCodesPage: React.FC<QrCodesPageProps> = ({ adminAuth }) => {
  const classes = useStyles();

  const [tables] = useGetData('Tables');
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [showQrCodes, setQrCodes] = useState(false);

  const handleSelectTable = (id: string) => () => {
    const currentIndex = selectedTables.indexOf(id);
    const newChecked = [...selectedTables];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
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
                        checked={selectedTables.indexOf(t.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': t.id }}
                      />
                    </ListItemIcon>
                    <ListItemText id={t.id} primary={`Tafel: ${t.value.name}`} />
                  </ListItem>
                ))}
            </List>
            <Button disabled={!!!selectedTables.length} variant="contained" color="primary">
              Toon QR Codes
            </Button>
          </>
        )) ||
          (showQrCodes && (
            <>
              list
              <div>Tafel: t.value.name</div>
              <QRCode value="t.id" />
            </>
          ))}
      </>
    )
  );
};

export default QrCodesPage;
