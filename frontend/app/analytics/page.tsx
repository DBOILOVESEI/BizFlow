"use client";

import { useAuth } from "../../modules/useAuth";
import React, { useMemo, useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertCircle, 
  FileText, 
  Download,
  Calendar,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

// Định nghĩa kiểu dữ liệu cơ bản (không dùng interface, dùng type)
// NOTE: Việc giữ lại các 'type' này là cần thiết để code TypeScript hoạt động đúng
// và an toàn. Nếu bỏ hoàn toàn, code sẽ trở thành JavaScript thuần.

type Order = {
  id: string;
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  createdAt: string; // ISO date string
  items: { productName: string; quantity: number }[];
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  debt: number;
};

type Product = {
  id: string;
  name: string;
};

// Component con KPICard (giữ nguyên để tách biệt logic hiển thị)
const KPICard = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string; 
  trend: string 
}) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 ${color} rounded-2xl shadow-sm`}>{icon}</div>
      <div className="p-1 bg-slate-50 rounded-lg"><ChevronRight size={14} className="text-slate-300" /></div>
    </div>
    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
    <h4 className="text-2xl font-black text-slate-900 mb-1">{value}</h4>
    <p className="text-[10px] font-bold text-indigo-500">{trend}</p>
  </div>
);

// --- MOCK DATA ---
const mockProducts: Product[] = [
    { id: 'p1', name: 'Bánh mì thịt nướng' },
    { id: 'p2', name: 'Trà sữa trân châu' },
    { id: 'p3', name: 'Phở bò tái' },
    { id: 'p4', name: 'Cà phê đá' },
    { id: 'p5', name: 'Nước cam ép' },
];

const mockCustomers: Customer[] = [
    { id: 'c1', name: 'Nguyễn Văn A', phone: '0901234567', debt: 1500000 },
    { id: 'c2', name: 'Trần Thị B', phone: '0912345678', debt: 750000 },
    { id: 'c3', name: 'Lê Đình C', phone: '0987654321', debt: 0 },
    { id: 'c4', name: 'Phạm Văn D', phone: '0945678901', debt: 4000000 },
    { id: 'c5', name: 'Hoàng Minh E', phone: '0933221100', debt: 100000 },
    { id: 'c6', name: 'Vũ Quốc F', phone: '0977889900', debt: 2500000 },
    { id: 'c7', name: 'Đặng Thị G', phone: '0966554433', debt: 0 },
];

// Tạo ngày ngẫu nhiên trong 7 ngày qua
const createRecentDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
};

const mockOrders: Order[] = [
    // Ngày 0 (Hôm nay)
    { id: 'o1', totalAmount: 150000, paidAmount: 150000, debtAmount: 0, createdAt: createRecentDate(0), items: [{ productName: mockProducts[0].name, quantity: 2 }, { productName: mockProducts[3].name, quantity: 1 }] },
    { id: 'o2', totalAmount: 500000, paidAmount: 350000, debtAmount: 150000, createdAt: createRecentDate(0), items: [{ productName: mockProducts[2].name, quantity: 5 }] },
    // Ngày 1
    { id: 'o3', totalAmount: 80000, paidAmount: 80000, debtAmount: 0, createdAt: createRecentDate(1), items: [{ productName: mockProducts[1].name, quantity: 3 }] },
    { id: 'o4', totalAmount: 2000000, paidAmount: 0, debtAmount: 2000000, createdAt: createRecentDate(1), items: [{ productName: mockProducts[0].name, quantity: 10 }, { productName: mockProducts[2].name, quantity: 5 }] },
    // Ngày 2
    { id: 'o5', totalAmount: 300000, paidAmount: 300000, debtAmount: 0, createdAt: createRecentDate(2), items: [{ productName: mockProducts[3].name, quantity: 4 }] },
    { id: 'o6', totalAmount: 120000, paidAmount: 120000, debtAmount: 0, createdAt: createRecentDate(2), items: [{ productName: mockProducts[4].name, quantity: 6 }] },
    // Ngày 3
    { id: 'o7', totalAmount: 950000, paidAmount: 950000, debtAmount: 0, createdAt: createRecentDate(3), items: [{ productName: mockProducts[0].name, quantity: 5 }, { productName: mockProducts[1].name, quantity: 10 }] },
    // Ngày 4
    { id: 'o8', totalAmount: 450000, paidAmount: 450000, debtAmount: 0, createdAt: createRecentDate(4), items: [{ productName: mockProducts[2].name, quantity: 3 }, { productName: mockProducts[4].name, quantity: 5 }] },
    // Ngày 5
    { id: 'o9', totalAmount: 150000, paidAmount: 150000, debtAmount: 0, createdAt: createRecentDate(5), items: [{ productName: mockProducts[3].name, quantity: 2 }] },
    // Ngày 6
    { id: 'o10', totalAmount: 600000, paidAmount: 600000, debtAmount: 0, createdAt: createRecentDate(6), items: [{ productName: mockProducts[0].name, quantity: 8 }] },
];

// Function component chính đã refactor
export default function AnalyticsDashboard() {
  const { user, logout } = useAuth();
  const orders = mockOrders;
  const customers = mockCustomers;
  const products = mockProducts;

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'month'>('30d');
  const COLORS = ['#6366f1', '#f43f5e', '#fbbf24', '#2dd4bf'];

  // --- LOGIC TÍNH TOÁN ---

  // 1. Tính toán KPI tổng quan
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.totalAmount, 0), [orders]);
  const totalDebt = useMemo(() => customers.reduce((sum, c) => sum + c.debt, 0), [customers]);
  const orderCount = orders.length;
  const avgOrderValue = useMemo(() => orders.length > 0 ? totalRevenue / orders.length : 0, [orders, totalRevenue]);

  // 2. Dữ liệu Doanh thu hàng ngày (chỉ lấy 7 ngày gần nhất như trong code gốc)
  const revenueTrendData = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      dailyMap[key] = 0;
    }
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      if (dailyMap[key] !== undefined) dailyMap[key] += order.totalAmount;
    });
    return Object.entries(dailyMap).map(([name, revenue]) => ({ name, revenue }));
  }, [orders]);

  // 3. Phân tích Sản phẩm Bán chạy (Top 5)
  const bestSellersData = useMemo(() => {
    const productSalesMap: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productSalesMap[item.productName] = (productSalesMap[item.productName] || 0) + item.quantity;
      });
    });

    return Object.entries(productSalesMap)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Lấy Top 5
  }, [orders]);

  // 4. Phân tích nợ khách hàng (Top 5)
  const topDebtors = useMemo(() => {
    return [...customers]
      .filter(c => c.debt > 0)
      .sort((a, b) => b.debt - a.debt)
      .slice(0, 5);
  }, [customers]);

  // 5. Cấu trúc thanh toán
  const paymentMethodData = useMemo(() => {
    let cash = 0;
    let debt = 0;
    orders.forEach(o => {
      cash += o.paidAmount;
      debt += o.debtAmount;
    });
    return [
      { name: 'Tiền mặt/Thẻ', value: cash },
      { name: 'Ghi nợ', value: debt },
    ];
  }, [orders]);

  // --- HIỂN THỊ (RETURN JSX) ---
  return (
    <MainLayout title="Báo Cáo" user={user} logout={logout}>
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Báo cáo & Phân tích</h2>
          <p className="text-slate-500 font-medium">Trung tâm điều hành dữ liệu cửa hàng.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
            <button onClick={() => setTimeRange('7d')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === '7d' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>7 ngày</button>
            <button onClick={() => setTimeRange('30d')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === '30d' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>30 ngày</button>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            <Download size={18} /> Xuất PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Tổng Doanh thu" 
          value={`${totalRevenue.toLocaleString()}đ`} 
          icon={<DollarSign className="text-emerald-600" />} 
          color="bg-emerald-50" 
          trend="+12.5% ↑" 
        />
        <KPICard 
          title="Tổng Nợ phải thu" 
          value={`${totalDebt.toLocaleString()}đ`} 
          icon={<AlertCircle className="text-rose-600" />} 
          color="bg-rose-50" 
          trend={`${customers.filter(c => c.debt > 0).length} khách nợ`} 
        />
        <KPICard 
          title="Tổng Đơn hàng" 
          value={orderCount.toLocaleString()} 
          icon={<FileText className="text-blue-600" />} 
          color="bg-blue-50" 
          trend="Đang tăng trưởng" 
        />
        <KPICard 
          title="Giá trị đơn TB" 
          value={`${Math.round(avgOrderValue).toLocaleString()}đ`} 
          icon={<TrendingUp className="text-indigo-600" />} 
          color="bg-indigo-50" 
          trend="Ổn định" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doanh thu xu hướng */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Calendar className="text-indigo-600" size={20} /> Xu hướng Doanh thu
            </h3>
          </div>
          {/*  */}
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cấu trúc thanh toán */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-black text-xl text-slate-800 mb-8 flex items-center gap-2">
            <CreditCard className="text-indigo-600" size={20} /> Phương thức Thanh toán
          </h3>
          {/*  */}
          <div className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" cornerRadius={8}>
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {paymentMethodData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.value.toLocaleString()}đ</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 5 Sản phẩm Bán chạy */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <ShoppingBag className="text-indigo-600" size={20} /> Top 5 Sản phẩm Bán chạy
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xếp hạng thực tế</span>
          </div>
          
          <div className="space-y-4">
            {bestSellersData.length > 0 ? (
              bestSellersData.map((p, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                  <span className="text-lg font-black text-indigo-600 w-6">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-sm font-black text-slate-900">{p.sales.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold uppercase">đơn vị</span></p>
                    </div>
                    {/* Thanh progress bar nhỏ để API visual tốt hơn */}
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(p.sales / bestSellersData[0].sales) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-400 font-medium italic">Đang đồng bộ dữ liệu API...</p>
                <div className="mt-4 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nợ khách hàng */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Users className="text-rose-600" size={20} /> Top 5 Khách hàng còn nợ
            </h3>
            <button className="text-xs font-bold text-indigo-600 hover:underline">Xem tất cả</button>
          </div>
          {/*  */}
          <div className="space-y-4">
            {topDebtors.length > 0 ? (
              topDebtors.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-rose-50/30 rounded-2xl border border-rose-100/50 hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-black text-sm uppercase">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{c.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-rose-600 text-base">{c.debt.toLocaleString()}đ</p>
                    <button className="text-[10px] font-bold text-rose-400 uppercase tracking-widest hover:text-rose-600">Nhắc nợ ngay</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 opacity-40">
                <CheckCircle2 size={48} className="text-emerald-500 mb-2" />
                <p className="text-slate-500 font-bold">Không có dư nợ khách hàng.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}