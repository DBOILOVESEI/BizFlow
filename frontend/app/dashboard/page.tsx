'use client' // PHẢI CÓ DÒNG NÀY Ở ĐẦU FILE

import { fetchDashboardOverview } from '@/modules/api/dashboard.api';
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
import { useAuth } from "../../modules/useAuth";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Định nghĩa kiểu dữ liệu đồng nhất với Backend
type OverviewData = {
  total_revenue: number
  total_customers: number
  total_debt: number
  low_stock_products: number
  weekly_revenue: { date: string; revenue: number }[]
}

// Component con StatCard
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
  const { user, logout } = useAuth();
  
  // Hooks PHẢI nằm trong lòng function component
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchDashboardOverview()
        setOverview(data)
      } catch (err) {
        console.error("Fetch dashboard failed", err)
        setError("Không thể tải dữ liệu từ máy chủ.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Xử lý trạng thái Loading
  if (loading) {
    return (
      <MainLayout title="Tổng quan" user={user} logout={logout}>
        <div className="flex flex-col justify-center items-center h-96 gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
          <p className="text-slate-500 animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </MainLayout>
    )
  }

  // Xử lý khi có dữ liệu
  const totalRevenue = overview?.total_revenue ?? 0
  const totalDebt = overview?.total_debt ?? 0
  const totalCustomers = overview?.total_customers ?? 0
  const lowStockCount = overview?.low_stock_products ?? 0

  // Định dạng lại ngày tháng cho biểu đồ dễ nhìn hơn
  const chartData = overview?.weekly_revenue.map(item => ({
    name: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    revenue: item.revenue
  })) ?? []

  return (
    <MainLayout title="Tổng quan" user={user} logout={logout}>
      <div className="space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Tổng Doanh thu"
            value={`${totalRevenue.toLocaleString()}đ`}
            trend="+12.5%"
            trendUp
            icon={<TrendingUp className="text-emerald-500" />}
          />
          <StatCard
            title="Tổng Khách hàng"
            value={totalCustomers.toString()}
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

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-800 text-lg font-semibold mb-6">Biểu đồ Doanh thu (Tuần này)</h3>
          <div className="h-96 w-full relative min-h-[384px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}