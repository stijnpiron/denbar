import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminPage from '../../pages/admin/AdminPage';
import CheckoutPage from '../../pages/checkout/CheckoutPage';
import OrdersPage from '../../pages/orders/OrdersPage';
import QrCodesPage from '../../pages/qr-codes/QrCodesPage';
import ScanPage from '../../pages/scanPage/ScanPage';
import TablePage from '../../pages/table/TablePage';

interface RouterProps {
  tablePageProps: { scanTable: (data: string) => void; selectedTable: string };
  scanPageProps: { scanTable: (data: string) => void };
  adminPageProps: { adminAuth: boolean; handleAdminAuth: (pincode: any) => boolean; pincodeLength: number };
  ordersPageProps: { adminAuth: boolean };
  checkoutPageProps: { adminAuth: boolean };
  qrCodesPageProps: { adminAuth: boolean };
}

const Router: React.FC<RouterProps> = ({
  adminPageProps,
  checkoutPageProps,
  ordersPageProps,
  scanPageProps,
  tablePageProps,
  qrCodesPageProps,
}) => (
  <Switch>
    <Route exact path={['/', '/scan']} render={(): React.ReactElement => <ScanPage {...scanPageProps} />} />
    <Route
      exact
      path={['/table', '/table/:tableId']}
      render={(): React.ReactElement => <TablePage {...tablePageProps} />}
    />
    <Route exact path="/admin" render={(): React.ReactElement => <AdminPage {...adminPageProps} />} />
    <Route exact path="/orders" render={(): React.ReactElement => <OrdersPage {...ordersPageProps} />} />
    <Route exact path="/checkout" render={(): React.ReactElement => <CheckoutPage {...checkoutPageProps} />} />
    <Route exact path="/qr-codes" render={(): React.ReactElement => <QrCodesPage {...qrCodesPageProps} />} />
  </Switch>
);

export default Router;
