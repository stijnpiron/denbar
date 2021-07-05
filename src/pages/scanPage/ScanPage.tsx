import { useGetData } from 'hooks/useGetData';
import { SelectedTable } from 'interfaces/table';
import QrReader from 'react-qr-reader';
import { useParams } from 'react-router-dom';

// TODO: check if webcam is enabled or not
interface ScanPageProps {
  scanTable: (scanData: SelectedTable) => void;
}

interface ScanPageParams {
  tableId: string;
}

const ScanPage: React.FC<ScanPageProps> = ({ scanTable }) => {
  const [tables] = useGetData('Tables');
  let { tableId } = useParams<ScanPageParams>();

  const handleScan = (data: string | null) => {
    if (data) {
      const scannedId = data.replace(`${window.location.origin}/#/table/`, '');
      const scannedTable = tables.filter((t) => t.id === scannedId)[0];
      const { name, amount } = scannedTable.value;
      scanTable({ id: scannedTable.id, name, amount, scanned: new Date().toString() });
    }
  };

  if (tableId) {
    handleScan(tableId);
  }

  const handleError = (err: any) => console.error(err);

  const previewStyle = {
    margin: 'auto',
    maxWidth: '400px',
    maxHeight: '320px',
  };

  return <QrReader delay={100} resolution={1000} style={previewStyle} onError={handleError} onScan={handleScan} />;
};

export default ScanPage;
