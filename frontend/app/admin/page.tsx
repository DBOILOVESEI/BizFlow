"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, Users, BarChart3, Settings, LayoutTemplate, Search, 
  Save, Mail, Smartphone, Calendar, Lock, Eye, EyeOff, Hash, 
  User as UserIcon, CheckCircle2, X, FileText, Printer, Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL, ENDPOINTS } from '../../modules/api/api.config';

import MainLayout from "../../components/MainLayout";  
import { useAuth } from "../../modules/useAuth";

type AdminTab = 'owners' | 'analytics' | 'config';

type Owner = {
  id: string;
  username: string;
  email: string;
  phone: string;
  plan: string;
  joined: string;
  password?: string;
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('owners');
  
  // Data State
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reusable fetch function
  const fetchOwners = useCallback(async () => {
    if (!user?.token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ADMIN_OWNERS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error('Không thể tải danh sách từ máy chủ');

      const data = await response.json();
      // Adjusting based on your server's expected output format
      const owners = data.owners || [];
      
      if (owners.length === 0) {
        // Fallback for demo if DB is empty
        setOwners([
          { id: '1', email: 'owner_a@gmail.com', phone: '0901234567', plan: 'Doanh nghiệp', joined: '2024-01-15', username: 'owner_a'},
        ]);
      } else {
        // Map server keys to local state keys if they differ
        setOwners(owners);
      }
    } catch (error: any) {
      console.error('Error fetching:', error);
      // alert('Lỗi kết nối: Sử dụng dữ liệu tạm thời.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  // Initial load
  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  return (
    <MainLayout title="Quản lý hệ thống" user={user} logout={logout}>
      <div className="flex flex-col h-full gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-4xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cổng Quản trị</h2>
            <p className="text-slate-500 font-medium">Giám sát toàn bộ nền tảng BizFlow.</p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <TabButton active={activeTab === 'owners'} onClick={() => setActiveTab('owners')} icon={<Users size={18} />} label="Chủ sở hữu" />
            <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 size={18} />} label="Phân tích" />
            <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')} icon={<Settings size={18} />} label="Cấu hình" />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar pb-10">
          {activeTab === 'owners' && (
            <OwnersManagement 
              owners={owners} 
              setOwners={setOwners} 
              isLoading={isLoading} 
              refreshData={fetchOwners} 
            />
          )}
          {activeTab === 'analytics' && <SystemAnalytics />}
          {activeTab === 'config' && <SystemConfigAndTemplates />}
        </div>
      </div>
    </MainLayout>
  );
}

// --- Sub-components with Props ---

function OwnersManagement({ owners, setOwners, isLoading, refreshData }: { 
  owners: Owner[], 
  setOwners: React.Dispatch<React.SetStateAction<Owner[]>>,
  isLoading: boolean,
  refreshData: () => void 
}) {
  const [search, setSearch] = useState('');
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const filtered = owners.filter(o => 
    o.username.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOwner) return;

    // Logic for API PUT request would go here
    setOwners(prev => prev.map(o => o.id === editingOwner.id ? editingOwner : o));
    alert(`Đã cập nhật: ${editingOwner.username}`);
    setEditingOwner(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold">Đang tải dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Tìm theo tên hoặc email..."
          />
        </div> 
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(o => (
          <div key={o.id} className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-indigo-600 font-black text-xl border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {o.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{o.username}</h4>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-bold uppercase tracking-wider">{o.plan}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <InfoItem icon={<Mail size={14} />} text={o.email} />
              <InfoItem icon={<Smartphone size={14} />} text={o.phone} />
              <InfoItem icon={<Calendar size={14} />} text={o.joined} />
              <InfoItem icon={<Hash size={14} />} text={o.id || 'N/A'} />
            </div>

            <button 
              onClick={() => setEditingOwner({ ...o, password: '' })}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Settings size={18} /> Quản lý tài khoản
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingOwner && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold flex items-center gap-2">
                <Shield size={20} className="text-indigo-400" /> Sửa: {editingOwner.username}
              </h4>
              <button onClick={() => setEditingOwner(null)} className="text-white/60 hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdateOwner} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      value={editingOwner.username}
                      onChange={(e) => setEditingOwner({...editingOwner, username: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SĐT</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      value={editingOwner.phone}
                      onChange={(e) => setEditingOwner({...editingOwner, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu mới (Để trống nếu không đổi)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={editingOwner.password}
                      onChange={(e) => setEditingOwner({...editingOwner, password: e.target.value})}
                      className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setEditingOwner(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500">Hủy</button>
                <button type="submit" className="flex-2 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Save size={18} /> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
const InfoItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium overflow-hidden">
    <span className="text-slate-300 shrink-0">{icon}</span>
    <span className="truncate">{text}</span>
  </div>
);

// ... (Keep SystemAnalytics, SystemConfigAndTemplates, and small helpers as they were)

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