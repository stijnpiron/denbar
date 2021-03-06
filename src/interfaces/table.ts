export enum TableStatus {
  OPEN = 'open',
  PAYED = 'payed',
  CLOSED = 'closed',
}
export interface Table {
  name: string;
  amount: number;
  status: TableStatus;
  date: string;
  note: string;
}

export interface FirestoreTable {
  id: string;
  value: Table;
}

export interface SelectedTable {
  id: string;
  name: string;
  scanned?: string;
  amount?: number;
}
