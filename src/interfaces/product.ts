export interface Product {
  name: string;
  price: number;
}

export interface FirestoreProduct {
  id: string;
  value: Product;
}
