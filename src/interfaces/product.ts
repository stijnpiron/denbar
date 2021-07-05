export interface Product {
  name: string;
  price: number;
  note?: string;
}

export interface FirestoreProduct {
  id: string;
  value: Product;
}
