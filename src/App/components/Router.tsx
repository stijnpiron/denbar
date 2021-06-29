import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminPage from '../../pages/admin/AdminPage';
import CheckoutPage from '../../pages/checkout/CheckoutPage';
import OrdersPage from '../../pages/orders/OrdersPage';
import ScanPage from '../../pages/scanPage/ScanPage';
import TablePage from '../../pages/table/TablePage';

interface RouterProps {
  tablePageProps: { selectedTable: string };
  scanPageProps: { scanTable: (data: string) => void };
  adminPageProps: { adminAuth: boolean; handleAdminAuth: (pincode: any) => boolean };
}

const Router: React.FC<RouterProps> = ({ tablePageProps, scanPageProps, adminPageProps }) => (
  <Switch>
    <Route exact path={['/', '/scan']} render={(): React.ReactElement => <ScanPage {...scanPageProps} />} />
    <Route exact path={'/table'} render={(): React.ReactElement => <TablePage {...tablePageProps} />} />
    <Route exact path="/admin" render={(): React.ReactElement => <AdminPage {...adminPageProps} />} />
    <Route exact path="/orders" render={(): React.ReactElement => <OrdersPage />} />
    <Route exact path="/checkout" render={(): React.ReactElement => <CheckoutPage />} />
  </Switch>
);

export default Router;
