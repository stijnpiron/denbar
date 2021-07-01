export interface Table {
  name: string;
  amount: number;
  status: TableStatus;
}

export enum TableStatus {
  OPEN = 'open',
  PAYED = 'payed',
}
