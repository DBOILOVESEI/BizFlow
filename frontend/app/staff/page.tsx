'use client'

// @ts-nocheck
import { API_BASE_URL, ENDPOINTS } from '../../modules/api/api.config';
import { useAuth } from "../../modules/useAuth";
import MainLayout from "../../components/MainLayout";
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, ShieldCheck, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';

export default function StaffPage() {
  const { user, logout } = useAuth();
  
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');

  // --- FETCH DATA TỪ SERVER (Duy nhất một khai báo fetchStaff) ---
  const fetchStaff = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setErrorMsg('');
      
      // Lấy token từ user object hoặc localStorage
      const token = user.token || localStorage.getItem('token') || localStorage.getItem('access_token'); 

      if (!token) {
        setErrorMsg("Vui lòng đăng nhập lại để xác thực tài khoản.");
        setLoading(false);
        return;
      }

      // Sử dụng API_BASE_URL và ENDPOINTS từ config (ép kiểu staff nếu chưa có trong config)
      const staffEndpoint = (ENDPOINTS as any).STAFF || '/staff';
      const response = await fetch(`${API_BASE_URL}${staffEndpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log("Dữ liệu nhân viên nhận được:", data);

      if (response.ok) {
        // Backend trả về mảng trực tiếp hoặc data.staff_data
        const staff_data = Array.isArray(data) ? data : (data.staff_data || []);
        
        if (staff_data.length === 0) {
          // Dữ liệu mẫu dự phòng để test UI nếu database trống
          const sampleData = [
            { id: 's1', username: 'NV_Bao_An', email: 'an.bao@shop.vn', status: 'active', role: 'EMPLOYEE' },
            { id: 's2', username: 'NV_Minh_Khoa', email: 'khoa.m@shop.vn', status: 'active', role: 'EMPLOYEE' }
          ];
          setStaff(sampleData);
          console.log("Database trống, hiển thị dữ liệu mẫu.");
        } else {
          setStaff(staff_data);
        }
      } else {
        throw new Error(data.msg || "Lỗi không xác định từ Server");
      }
    } catch (error: any) {
      console.error("Lỗi kết nối:", error);
      setErrorMsg(error.message === "Failed to fetch" 
        ? "Không thể kết nối tới Backend (Kiểm tra Flask đang chạy chưa?)" 
        : error.message);
      
      // Hiển thị dữ liệu mẫu khi lỗi kết nối hoàn toàn để không hỏng UI
      setStaff([
        { id: 's1', username: 'NV_Diem_My', email: 'my.diem@shop.vn', status: 'active', role: 'EMPLOYEE' }
      ]);
    } finally {
      setLoading(false);
      }
  }, [user]);

  // Gọi fetch lần đầu khi component mount hoặc user thay đổi
  useEffect(() => {
    if (user) {
      fetchStaff();
    }
  }, [user, fetchStaff]);

  // Tìm kiếm cục bộ theo username
  const filteredStaff = staff.filter((s) => 
    s.username?.toLowerCase().includes(search.toLowerCase())
  );

  // Nếu chưa đăng nhập, hiển thị màn hình loading chờ xác thực
  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <MainLayout title="Nhân viên" user={user} logout={logout}>
      <div className="p-8 bg-slate-50 min-h-screen space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Nhân sự</h2>
            <p className="text-slate-500 font-medium italic">
              Đang quản lý danh sách Owner ID: <span className="text-indigo-600 font-bold">#{user.id}</span>
            </p>
          </div>
          <button 
            onClick={fetchStaff} 
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl font-bold text-slate-600 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>

        {/* Cảnh báo lỗi nếu có */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{errorMsg}</span>
          </div>
        )}

        {/* Thanh tìm kiếm */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            placeholder="Tìm theo tên đăng nhập nhân viên..."
          />
        </div>

        {/* Nội dung Danh sách */}
        {loading ? (
          <div className="flex flex-col items-center py-24">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Đang đồng bộ từ hệ thống...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.length > 0 ? filteredStaff.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border transition-all ${
                    member.status === 'active' 
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white' 
                      : 'bg-slate-50 text-slate-400'
                  }`}>
                    {member.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-black text-slate-900 text-lg leading-tight truncate">{member.username}</h4>
                    <p className="text-xs text-slate-400 font-medium truncate">{member.email || "Chưa cập nhật email"}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-indigo-500" /> 
                    {member.role || "EMPLOYEE"}
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                    member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {member.status || 'active'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <Users className="mx-auto text-slate-100 mb-4" size={80} />
                <p className="text-slate-400 font-black text-lg">Hệ thống nhân sự trống</p>
                <p className="text-slate-300 text-sm font-medium italic">Không có nhân viên nào thuộc Owner ID #{user.id}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}