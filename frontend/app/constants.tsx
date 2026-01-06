
import { Product, Customer, User, UserRole } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Nước khoáng 500ml',
    sku: 'WAT-001',
    category: 'Đồ uống',
    baseUnit: 'Chai',
    stockLevel: 150,
    minStock: 20,
    units: [
      { name: 'Chai', multiplier: 1, price: 10000 }
    ]
  },
  {
    id: 'p2',
    name: 'Gạo hữu cơ 5kg',
    sku: 'RIC-005',
    category: 'Nông sản',
    baseUnit: 'Túi',
    stockLevel: 45,
    minStock: 10,
    units: [
      { name: 'Túi', multiplier: 1, price: 150000 }
    ]
  },
  {
    id: 'p3',
    name: 'Sữa tươi 1L',
    sku: 'MLK-001',
    category: 'Sữa & Bánh',
    baseUnit: 'Hộp',
    stockLevel: 80,
    minStock: 15,
    units: [
      { name: 'Hộp', multiplier: 1, price: 35000 }
    ]
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Nguyễn Văn A', phone: '0901-234-567', debt: 250000, purchaseHistory: [] },
  { id: 'c2', name: 'Trần Thị B', phone: '0902-345-678', debt: 0, purchaseHistory: [] },
  { id: 'c3', name: 'Lê Văn C', phone: '0903-456-789', debt: 1500000, purchaseHistory: [] }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nhân viên Alice', email: 'alice@store.com', role: UserRole.EMPLOYEE },
  { id: 'u2', name: 'Chủ tiệm Bob', email: 'bob@store.com', role: UserRole.OWNER },
  { id: 'u3', name: 'Quản trị viên', email: 'admin@system.com', role: UserRole.ADMIN }
];
