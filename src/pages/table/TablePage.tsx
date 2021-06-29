import { Redirect } from 'react-router-dom';

interface TablePageProps {
  selectedTable: string;
}

const TablePage: React.FC<TablePageProps> = ({ selectedTable }) => {
  if (!selectedTable) {
    return <Redirect to="/" />;
  }
  return <>Table page for: {selectedTable}</>;
};

export default TablePage;
