import { Redirect } from 'react-router-dom';

interface OrdersPageProps {
  adminAuth: boolean;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ adminAuth }) => {
  return <>{!adminAuth && <Redirect to="/admin" />}Orders page</>;
};

export default OrdersPage;
