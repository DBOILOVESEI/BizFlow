'use client'

import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react'
import MainLayout from "../../components/MainLayout";

// Không dùng import types từ bên ngoài, định nghĩa lại cơ bản
type Order = { id: string; totalAmount: number; [key: string]: any };
type Product = { id: string; stockLevel: number; minStock: number; [key: string]: any };
type Customer = { id: string; debt: number; [key: string]: any };

// Giả lập MainLayout vì không có file MainLayout
const MockMainLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-6">{title}</h1>
    {children}
  </div>
);

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// =================================================================
// CHUYỂN ĐỔI THÀNH FUNCTION CƠ BẢN KHÔNG DÙNG INTERFACE HOẶC PROPS
// =================================================================

// Component con StatCard (không dùng interface)
const StatCard = ({ title, value, trend, trendUp, icon }: { title: string; value: string; trend: string; trendUp: boolean; icon: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <h4 className="text-slate-900 text-sm font-medium">{title}</h4>
    <p className="text-slate-900 text-2xl font-bold mt-1">{value}</p>
  </div>
);


export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  // Hàm mô phỏng tải dữ liệu (thay thế loadDashboardData và mock data)
  useEffect(() => {
    // Giả lập độ trễ
    setTimeout(() => {
      const mockOrders: Order[] = [
        { id: '1', totalAmount: 500000 },
        { id: '2', totalAmount: 300000 },
        { id: '3', totalAmount: 750000 },
        { id: '4', totalAmount: 120000 },
      ]

      const mockProducts: Product[] = [
        { id: '1', stockLevel: 3, minStock: 5 }, // Low stock
        { id: '2', stockLevel: 10, minStock: 3 },
        { id: '3', stockLevel: 1, minStock: 2 }, // Low stock
        { id: '4', stockLevel: 50, minStock: 10 },
      ]

      const mockCustomers: Customer[] = [
        { id: 'c1', debt: 200000 },
        { id: 'c2', debt: 0 },
        { id: 'c3', debt: 450000 },
        { id: 'c4', debt: 0 },
        { id: 'c5', debt: 0 },
      ]

      setOrders(mockOrders)
      setProducts(mockProducts)
      setCustomers(mockCustomers)
      setLoading(false)
    }, 1000)
  }, [])

  // Các hàm API fetchOrders, fetchProducts, fetchCustomers và loadDashboardData gốc đã bị loại bỏ/comment
  // và thay thế bằng mock data trong useEffect để đảm bảo tính độc lập của component.

  if (loading) {
    return (
      <MockMainLayout title="Tổng quan">
        <div className="flex items-center justify-center h-48 bg-white rounded-xl border shadow-sm">
          <Loader2 className="animate-spin text-indigo-500 mr-2" size={24} />
          <span className="text-slate-600">Đang tải dữ liệu...</span>
        </div>
      </MockMainLayout>
    )
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalDebt = customers.reduce((sum, c) => sum + c.debt, 0)
  const lowStockCount = products.filter(p => p.stockLevel <= p.minStock).length

  const chartData = [
    { name: 'T2', revenue: 400000 },
    { name: 'T3', revenue: 300000 },
    { name: 'T4', revenue: 500000 },
    { name: 'T5', revenue: 278000 },
    { name: 'T6', revenue: 189000 },
    { name: 'T7', revenue: 239000 },
    { name: 'CN', revenue: 349000 },
  ]

  return (
    <MainLayout title="Tổng quan"> 
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng Doanh thu"
            value={`${totalRevenue.toLocaleString()}đ`}
            trend="+12.5%"
            trendUp
            icon={<TrendingUp className="text-emerald-500" />}
          />

          {/* ... (Các StatCard khác) ... */}
           <StatCard
            title="Tổng Khách hàng"
            value={customers.length.toString()}
            trend="+3"
            trendUp
            icon={<Users className="text-blue-500" />}
          />

          <StatCard
            title="Tổng Nợ phải thu"
            value={`${totalDebt.toLocaleString()}đ`}
            trend="-2.4%"
            trendUp={false}
            icon={<AlertCircle className="text-amber-500" />}
          />

          <StatCard
            title="Sản phẩm sắp hết"
            value={lowStockCount.toString()}
            trend={lowStockCount > 0 ? 'Cần nhập hàng' : 'Ổn định'}
            trendUp={lowStockCount === 0}
            icon={<Package className="text-rose-500" />}
          />
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Biểu đồ Doanh thu (Tuần này)</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}