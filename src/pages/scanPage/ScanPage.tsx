import { createStyles, makeStyles, Snackbar, Theme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useGetData } from 'hooks/useGetData';
import { SelectedTable, TableStatus } from 'interfaces/table';
import { useState } from 'react';
// import QrReader from 'react-qr-reader';
import { useParams } from 'react-router-dom';

// TODO: check if webcam is enabled or not
interface ScanPageProps {
  scanTable: (scanData: SelectedTable) => void;
}

interface ScanPageParams {
  tableId: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    snackbar: {
      width: '100%',
      marginTop: 60,
      '& > * + *': {
        marginTop: 75,
      },
    },
  })
);

const ScanPage: React.FC<ScanPageProps> = ({ scanTable }) => {
  const classes = useStyles();

  const [tables] = useGetData('Tables');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  let { tableId } = useParams<ScanPageParams>();

  const handleScan = (data: string | null) => {
    if (!scanSuccess && data && tables.length > 0) {
      const scannedId = data.replace(`${window.location.origin}/#/table/`, '');
      const scannedTable = tables.filter((t) => t.id === scannedId)[0];
      if (scannedTable) {
        const { name, amount, status } = scannedTable.value;

        if (status !== TableStatus.OPEN) {
          setFeedbackMessage('foutieve tafelcode gescand, vraag hulp aan het bar team');
          setScanSuccess(false);
          setFeedbackVisible(true);
          localStorage.removeItem('selectedTable');
        } else {
          setFeedbackMessage('Tafel gescand, start met bestellen');
          setScanSuccess(true);
          setFeedbackVisible(true);
          scanTable({ id: scannedTable.id, name, amount, scanned: new Date().toString() });
        }
      } else {
        setFeedbackMessage('foutieve tafelcode gescand, vraag hulp aan het bar team');
        setScanSuccess(false);
        setFeedbackVisible(true);
        localStorage.removeItem('selectedTable');
      }
    }
  };

  if (tableId) {
    handleScan(tableId);
  }

  const handleError = (err: any) => console.error(err);

  const handleFeedbackClose = () => setFeedbackVisible(false);

  const previewStyle = {
    margin: 'auto',
    maxWidth: '400px',
    maxHeight: '320px',
  };

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
        <Alert severity={scanSuccess ? 'success' : 'error'} onClose={handleFeedbackClose}>
          {feedbackMessage}
        </Alert>
      </Snackbar>
      {/* <QrReader delay={100} resolution={1000} style={previewStyle} onError={handleError} onScan={handleScan} /> */}
    </>
  );
};

export default ScanPage;
