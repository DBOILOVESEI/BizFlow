"use client";

import { useAuth } from "../../modules/useAuth";
import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, DollarSign, Users, AlertCircle, FileText, 
  Download, Calendar, ChevronRight, ShoppingBag, CreditCard, CheckCircle2
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

// --- 1. TYPES ---
type Order = {
  id: string;
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  createdAt: string; 
  items: { productName: string; quantity: number }[];
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  debt: number;
};

// --- 2. COMPONENT: KPI CARD ---
const KPICard = ({ title, value, icon, color, trend, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 ${color} rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="p-1 bg-slate-50 rounded-lg group-hover:bg-slate-100"><ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" /></div>
    </div>
    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
    <h4 className="text-2xl font-black text-slate-900 mb-1">{value}</h4>
    <p className="text-[10px] font-bold text-indigo-500">{trend}</p>
  </div>
);

export default function AnalyticsDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter(); 
  
  // 1. Initialize State with empty arrays (Mock data removed)
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('30d');
  const [loading, setLoading] = useState(true);
  
  // 2. Fetch Real Data from Backend
  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://127.0.0.1:5000/analytics/dashboard', {
           headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
          if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
        }
      } catch (err) {
        console.error("Connection error: Backend is offline.");
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, []);

  const COLORS = ['#6366f1', '#f43f5e', '#fbbf24', '#2dd4bf'];

  // --- LOGIC: FILTER BY TIME ---
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : 30;
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);

    return orders.filter(o => new Date(o.createdAt) >= pastDate);
  }, [orders, timeRange]);

  // --- LOGIC: KPI CALCULATIONS ---
  const totalRevenue = useMemo(() => filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0), [filteredOrders]);
  const totalDebt = useMemo(() => customers.reduce((sum, c) => sum + c.debt, 0), [customers]);
  const orderCount = filteredOrders.length;
  const avgOrderValue = useMemo(() => filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0, [filteredOrders, totalRevenue]);

  // --- LOGIC: CHARTS ---
  const revenueTrendData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : 30;
    const dailyMap: Record<string, number> = {};
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      dailyMap[key] = 0;
    }

    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      if (dailyMap[key] !== undefined) dailyMap[key] += order.totalAmount;
    });
    return Object.entries(dailyMap).map(([name, revenue]) => ({ name, revenue }));
  }, [filteredOrders, timeRange]);

  const bestSellersData = useMemo(() => {
    const productSalesMap: Record<string, number> = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        productSalesMap[item.productName] = (productSalesMap[item.productName] || 0) + item.quantity;
      });
    });
    return Object.entries(productSalesMap)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [filteredOrders]);

  const topDebtors = useMemo(() => {
    return [...customers].filter(c => c.debt > 0).sort((a, b) => b.debt - a.debt).slice(0, 5);
  }, [customers]);

  const paymentMethodData = useMemo(() => {
    let cash = 0;
    let debt = 0;
    filteredOrders.forEach(o => {
      cash += o.paidAmount;
      debt += o.debtAmount;
    });
    return [ { name: 'Tiền mặt/Thẻ', value: cash }, { name: 'Ghi nợ', value: debt } ];
  }, [filteredOrders]);

  const goToOrders = () => router.push('/orders');
  const goToCustomers = () => router.push('/customers');

  return (
    <MainLayout title="Báo Cáo" user={user} logout={logout}>
    <div className="space-y-8 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-black text-slate-900">Báo cáo & Phân tích</h2>
           <p className="text-slate-500 font-medium">Dữ liệu từ hệ thống BizFlow</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
            <button 
                onClick={() => setTimeRange('7d')} 
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === '7d' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                7 ngày
            </button>
            <button 
                onClick={() => setTimeRange('30d')} 
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === '30d' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                30 ngày
            </button>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
             <Download size={18} /> Xuất PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
            title="Tổng Doanh thu" 
            value={`${totalRevenue.toLocaleString()}đ`} 
            icon={<DollarSign className="text-emerald-600"/>} 
            color="bg-emerald-50" 
            trend={`Trong ${timeRange === '7d' ? '7' : '30'} ngày qua`} 
            onClick={goToOrders} 
        />
        <KPICard 
            title="Tổng Nợ phải thu" 
            value={`${totalDebt.toLocaleString()}đ`} 
            icon={<AlertCircle className="text-rose-600"/>} 
            color="bg-rose-50" 
            trend={`${topDebtors.length} khách đang nợ`} 
            onClick={goToCustomers} 
        />
        <KPICard 
            title="Tổng Đơn hàng" 
            value={orderCount.toLocaleString()} 
            icon={<FileText className="text-blue-600"/>} 
            color="bg-blue-50" 
            trend="Đơn đã hoàn thành" 
            onClick={goToOrders} 
        />
        <KPICard 
            title="Giá trị đơn TB" 
            value={`${Math.round(avgOrderValue).toLocaleString()}đ`} 
            icon={<TrendingUp className="text-indigo-600"/>} 
            color="bg-indigo-50" 
            trend="Trung bình mỗi đơn" 
            onClick={goToOrders} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-[400px]">
           <h3 className="font-black text-xl mb-4 flex gap-2 items-center"><Calendar size={20} className="text-indigo-600"/> Xu hướng Doanh thu</h3>
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} tick={{fontSize: 11, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#colorRev)" />
              </AreaChart>
           </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-[400px]">
           <h3 className="font-black text-xl mb-4 flex gap-2 items-center"><CreditCard size={20} className="text-indigo-600"/> Thanh toán</h3>
           <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" cornerRadius={6}>
                  {paymentMethodData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
           </ResponsiveContainer>
           <div className="flex justify-center gap-4 text-xs font-bold text-slate-600">
              {paymentMethodData.map((d, i) => <div key={i} className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{background: COLORS[i]}}/>{d.name}</div>)}
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-black text-xl mb-6 flex gap-2 items-center"><ShoppingBag size={20} className="text-indigo-600"/> Top Sản phẩm</h3>
            <div className="space-y-5">
               {bestSellersData.length > 0 ? bestSellersData.map((p, i) => (
                 <div key={i} className="flex items-center gap-4 border-b border-slate-50 pb-3 last:border-0">
                    <span className="text-lg font-black text-indigo-600 w-6">{i+1}.</span>
                    <div className="flex-1">
                       <div className="flex justify-between font-bold text-slate-800 mb-1"><p>{p.name}</p><p>{p.sales} <span className="text-[10px] text-slate-400">ĐV</span></p></div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{width: `${(p.sales/Math.max(...bestSellersData.map(x => x.sales)))*100}%`}}/>
                       </div>
                    </div>
                 </div>
               )) : <p className="text-slate-400 italic py-4">Chưa có dữ liệu sản phẩm.</p>}
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xl flex gap-2 items-center"><Users size={20} className="text-rose-600"/> Khách nợ cao</h3>
                <button 
                    onClick={goToCustomers}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                    Xem tất cả
                </button>
            </div>
            
            <div className="space-y-4">
               {topDebtors.length > 0 ? topDebtors.map((c, i) => (
                 <div key={i} className="flex justify-between items-center p-3 bg-rose-50/50 rounded-xl border border-rose-100 hover:shadow-md transition-all cursor-pointer" onClick={goToCustomers}>
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-lg bg-rose-200 flex items-center justify-center text-rose-700 font-black text-sm">{c.name ? c.name.charAt(0) : '?'}</div>
                       <div><p className="font-bold text-slate-900 text-sm">{c.name}</p><p className="text-[10px] text-slate-500 font-bold">{c.phone}</p></div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-rose-600 text-sm">{c.debt.toLocaleString()}đ</p>
                       <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Nhắc nợ</span>
                    </div>
                 </div>
               )) : <div className="text-center py-6 text-slate-400 italic flex flex-col items-center"><CheckCircle2 className="mb-2 text-emerald-400"/>Không có khách nợ</div>}
            </div>
         </div>
      </div>

    </div>
    </MainLayout>
  );
}