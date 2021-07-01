import QrReader from 'react-qr-reader';

interface ScanPageProps {
  scanTable: (scanData: string) => void;
}

const ScanPage: React.FC<ScanPageProps> = ({ scanTable }) => {
  const handleScan = (data: string | null) => {
    if (data) {
      scanTable(data);
    }
  };
  const handleError = (err: any) => console.error(err);

  const previewStyle = {
    margin: 'auto',
    maxWidth: '400px',
    maxHeight: '320px',
  };

  return <QrReader delay={100} resolution={1000} style={previewStyle} onError={handleError} onScan={handleScan} />;
};

export default ScanPage;
