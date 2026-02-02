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
import { useAuth } from "../../modules/useAuth";
// Import cấu hình API (Đảm bảo đường dẫn này đúng với project của bạn)
import { API_BASE_URL } from '../../modules/api/api.config'; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// =================================================================
// COMPONENT CON: STAT CARD
// =================================================================
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

// =================================================================
// MAIN DASHBOARD COMPONENT
// =================================================================
export default function Dashboard() {
  const { user, logout } = useAuth();
  
  // State lưu dữ liệu thống kê từ API
  const [stats, setStats] = useState({
    revenue: 0,
    customers: 0,
    debt: 0,
    low_stock: 0,
    revenue_growth: 0, // % tăng trưởng (nếu backend trả về)
    chart_data: []
  });

  const [loading, setLoading] = useState(true);

  // --- GỌI API THẬT ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Chỉ gọi khi user đã đăng nhập
      if (!user) return; 

      try {
        setLoading(true);
        // Gọi tới endpoint API Backend bạn vừa tạo
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Nếu backend cần token xác thực, gửi kèm ở đây:
            // 'Authorization': `Bearer ${user.token}` 
          }
        });

        const result = await response.json();

        if (result.status === 'success') {
          setStats(result.data);
        } else {
          console.error("Lỗi tải dữ liệu:", result.message);
        }
      } catch (error) {
        console.error("Lỗi kết nối server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]); // Chạy lại khi user thay đổi (login)

  // --- RENDER LOADING ---
  if (loading) {
    return (
      <MainLayout title="Tổng quan" user={user} logout={logout}>
        <div className="flex items-center justify-center h-64 bg-white rounded-xl border shadow-sm">
          <Loader2 className="animate-spin text-indigo-500 mr-2" size={24} />
          <span className="text-slate-600">Đang tải dữ liệu từ hệ thống...</span>
        </div>
      </MainLayout>
    )
  }

  // --- RENDER GIAO DIỆN CHÍNH ---
  return (
    <MainLayout title="Tổng quan" user={user} logout={logout}>
      <div className="space-y-6">
        {/* GRID THẺ SỐ LIỆU */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. DOANH THU */}
          <StatCard
            title="Tổng Doanh thu"
            // ✅ ĐÚNG: Đổi thành stats.revenue
            value={`${(stats.revenue || 0).toLocaleString()}đ`} 
            trend="+12.5%" 
            trendUp={true}
            icon={<TrendingUp className="text-emerald-500" />}
          />
          {/* 2. KHÁCH HÀNG */}
           <StatCard
            title="Tổng Khách hàng"
            value={stats.customers.toString()}
            trend="+3"
            trendUp={true}
            icon={<Users className="text-blue-500" />}
          />

          {/* 3. CÔNG NỢ */}
          <StatCard
            title="Tổng Nợ phải thu"
            value={`${stats.debt.toLocaleString()}đ`}
            trend="-2.4%"
            trendUp={false} // Nợ giảm là tốt (màu đỏ ở đây nghĩa là giảm, tùy logic hiển thị)
            icon={<AlertCircle className="text-amber-500" />}
          />

          {/* 4. SẢN PHẨM SẮP HẾT */}
          <StatCard
            title="Sản phẩm sắp hết"
            value={stats.low_stock.toString()}
            trend={stats.low_stock > 0 ? 'Cần nhập hàng' : 'Ổn định'}
            trendUp={stats.low_stock === 0} // Nếu = 0 là tốt (xanh), > 0 là xấu (đỏ)
            icon={<Package className="text-rose-500" />}
          />
        </div>

        {/* BIỂU ĐỒ */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-slate-800 text-lg font-semibold mb-6">Biểu đồ Doanh thu (7 ngày gần nhất)</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chart_data && stats.chart_data.length > 0 ? stats.chart_data : []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()}đ`} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={0.2} fill="#6366f1" />
              </AreaChart>
            </ResponsiveContainer>
            {(!stats.chart_data || stats.chart_data.length === 0) && (
                <div className="text-center text-gray-400 mt-[-100px]">Chưa có dữ liệu tuần này</div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}