export enum TableStatus {
  OPEN = 'open',
  PAYED = 'payed',
}
export interface Table {
  name: string;
  amount: number;
  status: TableStatus;
}

export interface FirestoreTable {
  id: string;
  value: Table;
}
