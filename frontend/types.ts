
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
}

export interface UnitOfMeasure {
  name: string;
  multiplier: number; // relative to base unit
  price: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  baseUnit: string;
  units: UnitOfMeasure[];
  stockLevel: number;
  minStock: number;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  debt: number;
  purchaseHistory: string[]; // Order IDs
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitName: string;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  status: OrderStatus;
  createdAt: string;
  createdBy: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  orderId?: string;
  timestamp: string;
  read: boolean;
}

export interface StoreAnalytics {
  dailyRevenue: number[];
  monthlyRevenue: number[];
  bestSellers: { name: string; sales: number }[];
  outstandingDebt: number;
}
