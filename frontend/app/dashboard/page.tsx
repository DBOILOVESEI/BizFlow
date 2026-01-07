'use client'

import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

import { Order, Product, Customer } from '../../types'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import MainLayout from '../../components/MainLayout'

import {
  fetchOrders,
  fetchProducts,
  fetchCustomers
} from '../../modules/api/dashboard.api'

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    //loadDashboardData()
    const mockOrders: Order[] = [
      { id: '1', totalAmount: 500000 } as Order,
      { id: '2', totalAmount: 300000 } as Order,
    ]

    const mockProducts: Product[] = [
      { id: '1', stockLevel: 3, minStock: 5 } as Product,
      { id: '2', stockLevel: 10, minStock: 3 } as Product,
    ]

    const mockCustomers: Customer[] = [
      { id: '1', debt: 200000 } as Customer,
      { id: '2', debt: 0 } as Customer,
    ]

    setOrders(mockOrders)
    setProducts(mockProducts)
    setCustomers(mockCustomers)
    setLoading(false)
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        fetchOrders(),
        fetchProducts(),
        fetchCustomers()
      ])

      setOrders(ordersRes)
      setProducts(productsRes)
      setCustomers(customersRes)
    } catch (err) {
      console.error('Dashboard load error:', err)
      alert('Không thể tải dữ liệu dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Đang tải dữ liệu...</div>
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalDebt = customers.reduce((sum, c) => sum + c.debt, 0)
  const lowStockCount = products.filter(p => p.stockLevel <= p.minStock).length

  const chartData = [
    { name: 'T2', revenue: 4000 },
    { name: 'T3', revenue: 3000 },
    { name: 'T4', revenue: 5000 },
    { name: 'T5', revenue: 2780 },
    { name: 'T6', revenue: 1890 },
    { name: 'T7', revenue: 2390 },
    { name: 'CN', revenue: 3490 },
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

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon }) => (
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


export default Dashboard
