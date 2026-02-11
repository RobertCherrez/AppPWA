export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  totalAmount: number;
  orderDate: string;
  status: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
