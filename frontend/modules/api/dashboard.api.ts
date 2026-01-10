import { Order, Product, Customer } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAuthHeader() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE_URL}/customers`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}
