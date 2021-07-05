import { Product } from './product';

export enum OrderStatus {
  NEW = 'new',
  OPENED = 'opened',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

export interface OrderProduct extends Product {
  id: string;
  count: number;
}

export interface OrderProducts {
  [key: string]: OrderProduct;
}

export interface Order {
  tableId: string;
  tableName: string;
  date: string;
  products: OrderProduct[];
  amount: number;
  status: OrderStatus;
}
 
