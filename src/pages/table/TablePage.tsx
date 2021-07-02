import { useGetData } from 'hooks/useGetData';
import { Redirect, useParams } from 'react-router-dom';

interface TablePageProps {
  scanTable: (scanData: string) => void;
  selectedTable: string;
}

interface TablePageParams {
  tableId: string;
}

const TablePage: React.FC<TablePageProps> = ({ scanTable, selectedTable }) => {
  const [products] = useGetData('Products');

  let { tableId } = useParams<TablePageParams>();
  if (tableId) {
    scanTable(tableId);
  }
  if (!selectedTable && !tableId) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <div>Table page for: {selectedTable}</div>
      <div>
        {products.map((p) => (
          <div key={p.id}>
            {p.value.name}: €{p.value.price}
          </div>
        ))}
      </div>
    </>
  );
};

export default TablePage;
