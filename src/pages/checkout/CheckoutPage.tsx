import { Redirect } from 'react-router-dom';

interface CheckoutPageProps {
  adminAuth: boolean;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ adminAuth }) => (
  <>{!adminAuth && <Redirect to="/admin" />}Checkout page</>
);

export default CheckoutPage;
