"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  LayoutTemplate,
  Search,
  Save,
  Building,
  Mail,
  Smartphone,
  Calendar,
  Zap,
  FileText,
  Printer,
  X,
  Lock,
  Eye,
  EyeOff,
  Hash,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MainLayout from "../../components/MainLayout";  

type AdminTab = 'owners' | 'analytics' | 'config';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('owners');

  return (
    <MainLayout title="Quản lý hệ thống">
    <div className="flex flex-col h-full gap-8">
      {/* Header tập trung */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-4xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cổng Quản trị Hệ thống</h2>
          <p className="text-slate-500 font-medium">Giám sát và cấu hình toàn bộ nền tảng BizFlow.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <TabButton active={activeTab === 'owners'} onClick={() => setActiveTab('owners')} icon={<Users size={18} />} label="Chủ sở hữu" />
          <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 size={18} />} label="Phân tích Hệ thống" />
          <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon={<Settings size={18} />} label="Cấu hình & Biểu mẫu" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar pb-10">
        {activeTab === 'owners' && <OwnersManagement />}
        {activeTab === 'analytics' && <SystemAnalytics />}
        {activeTab === 'config' && <SystemConfigAndTemplates />}
      </div>
    </div>
    </MainLayout>
  );
};

function OwnersManagement() {
  const [search, setSearch] = useState('');
  const [editingOwner, setEditingOwner] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [owners, setOwners] = useState([
    { id: '1', name: 'Nguyễn Văn A', email: 'owner_a@gmail.com', phone: '0901234567', store: 'Gara Ô tô A', plan: 'Doanh nghiệp', joined: '2024-01-15', username: 'owner_a', businessCode: 'BIZ-001', password: 'password123' },
    { id: '2', name: 'Trần Thị B', email: 'owner_b@gmail.com', phone: '0902345678', store: 'Tiệm cà phê B', plan: 'Chuyên nghiệp', joined: '2024-02-10', username: 'owner_b', businessCode: 'BIZ-002', password: 'password123' },
    { id: '3', name: 'Lê Văn C', email: 'owner_c@gmail.com', phone: '0903456789', store: 'Cửa hàng Bán lẻ C', plan: 'Doanh nghiệp', joined: '2024-03-01', username: 'owner_c', businessCode: 'BIZ-003', password: 'password123' },
    { id: '4', name: 'Phạm Văn D', email: 'owner_d@gmail.com', phone: '0904567890', store: 'Hóa chất D', plan: 'Cơ bản', joined: '2023-11-20', username: 'owner_d', businessCode: 'BIZ-004', password: 'password123' },
  ]);

  const filtered = owners.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.store.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateOwner = (e: React.FormEvent) => {
    e.preventDefault();
    setOwners(prev => prev.map(o => o.id === editingOwner.id ? editingOwner : o));
    alert(`Đã cập nhật thông tin thành công cho ${editingOwner.name}`);
    setEditingOwner(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Tìm theo tên chủ sở hữu hoặc cửa hàng..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(o => (
          <div key={o.id} className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-indigo-600 font-black text-xl border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {o.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{o.name}</h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Building size={12} /> {o.store}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium overflow-hidden">
                <Mail size={14} className="text-slate-300 shrink-0" /> <span className="truncate">{o.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Smartphone size={14} className="text-slate-300 shrink-0" /> {o.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Calendar size={14} className="text-slate-300 shrink-0" /> {o.joined}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Hash size={14} className="text-indigo-400 shrink-0" /> {o.businessCode}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button 
                onClick={() => setEditingOwner({ ...o })}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                <Settings size={18} /> Quản lý thông tin
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Quản lý thông tin */}
      {editingOwner && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold flex items-center gap-2">
                <Shield size={20} className="text-indigo-400" /> Quản lý tài khoản: {editingOwner.name}
              </h4>
              <button onClick={() => setEditingOwner(null)} className="text-white/60 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateOwner} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và Tên</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      value={editingOwner.name}
                      onChange={(e) => setEditingOwner({...editingOwner, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      value={editingOwner.phone}
                      onChange={(e) => setEditingOwner({...editingOwner, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã Doanh nghiệp</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      value={editingOwner.businessCode}
                      onChange={(e) => setEditingOwner({...editingOwner, businessCode: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tham gia</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="date"
                      required
                      value={editingOwner.joined}
                      onChange={(e) => setEditingOwner({...editingOwner, joined: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={editingOwner.password}
                      onChange={(e) => setEditingOwner({...editingOwner, password: e.target.value})}
                      className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingOwner(null)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-2 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Lưu toàn bộ thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function SystemAnalytics() {
  const data = [
    { name: 'Th1', revenue: 120, stores: 45 },
    { name: 'Th2', revenue: 155, stores: 52 },
    { name: 'Th3', revenue: 182, stores: 61 },
    { name: 'Th4', revenue: 245, stores: 78 },
    { name: 'Th5', revenue: 310, stores: 92 },
    { name: 'Th6', revenue: 388, stores: 105 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlatformStat label="Tổng doanh thu đăng ký gói" value="425.8M VNĐ" />
        <PlatformStat label="Tổng số Cửa hàng" value="1,420" />
      </div>

      <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-xl text-slate-800">Tăng trưởng Doanh thu Nền tảng</h3>
            <p className="text-sm text-slate-500 font-medium">Dữ liệu doanh thu biểu diễn theo tháng dạng cột.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <BarChart3 className="text-indigo-600" />
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `${val}M`} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)'}}
                //formatter={(val: number) => [`${val} Triệu VNĐ`, 'Doanh thu']}
              />
              <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

function SystemConfigAndTemplates() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Cấu hình chung */}
      <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <Settings size={24} />
          </div>
          <h3 className="font-black text-xl text-slate-800">Cấu hình Toàn cục</h3>
        </div>
        
        <div className="space-y-6">
          <ConfigField label="Tên Hệ thống" value="BizFlow Intelligent ERP" />
          <ConfigField label="Domain Chính" value="https://app.bizflow.io" />
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-slate-800">Chế độ Bảo trì Toàn hệ thống</p>
              <p className="text-xs text-slate-500">Khi bật, tất cả người dùng sẽ không thể truy cập.</p>
            </div>
            <div className="w-14 h-7 bg-slate-200 rounded-full relative p-1 cursor-pointer transition-colors hover:bg-slate-300">
              <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-slate-800">Đăng ký người dùng mới</p>
              <p className="text-xs text-slate-500">Cho phép chủ sở hữu mới đăng ký tài khoản.</p>
            </div>
            <div className="w-14 h-7 bg-indigo-600 rounded-full relative p-1 cursor-pointer flex justify-end">
              <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
        
        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
          <Save size={20} /> Lưu Tất cả Cấu hình
        </button>
      </div>

      {/* Mẫu báo cáo */}
      <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <LayoutTemplate size={24} />
          </div>
          <h3 className="font-black text-xl text-slate-800">Mẫu Báo cáo & Hóa đơn</h3>
        </div>
        
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Tùy chỉnh định dạng mặc định cho tất cả các cửa hàng trên hệ thống. 
          Các chủ tiệm có thể tùy biến logo riêng dựa trên khung mẫu này.
        </p>

        <div className="space-y-4">
          <TemplateOption icon={<FileText />} label="Hóa đơn Bán lẻ (Khổ A4/A5)" active />
          <TemplateOption icon={<Printer />} label="Hóa đơn In nhiệt (80mm/58mm)" />
          <TemplateOption icon={<Shield />} label="Báo cáo Công nợ Định kỳ" />
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ghi chú mặc định dưới hóa đơn</label>
          <textarea 
            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] shadow-inner"
            placeholder="Ví dụ: Cảm ơn quý khách đã mua sắm! Hẹn gặp lại..."
          />
        </div>

        <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl">
          <Save size={20} /> Cập nhật Mẫu Hệ thống
        </button>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
      active 
        ? 'bg-white text-indigo-600 shadow-md scale-105' 
        : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon} {label}
  </button>
);

const PlatformStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-2xl font-black text-slate-900">{value}</h4>
    </div>
  </div>
);

const ConfigField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      defaultValue={value} 
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
    />
  </div>
);

const TemplateOption: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
    active ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-slate-50 bg-white hover:border-slate-200'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <span className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
    </div>
    {active && <CheckCircle2 className="text-indigo-600" size={18} />}
  </div>
);