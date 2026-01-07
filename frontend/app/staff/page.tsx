'use client'

// @ts-nocheck
import MainLayout from "../../components/MainLayout";
import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, ShieldCheck, Trash2, 
  Ban, CheckCircle2, Calendar, X, Lock, 
  User as UserIcon, Briefcase 
} from 'lucide-react';

export default function POS() {
  // 1. Khởi tạo dữ liệu mẫu
  const [staff, setStaff] = useState([
    { id: '1', name: 'Nguyễn Văn Nhân', role: 'EMPLOYEE', status: 'active', joinedDate: '20/12/2023' },
    { id: '2', name: 'Trần Thị Thu', role: 'EMPLOYEE', status: 'active', joinedDate: '05/01/2024' },
    { id: '3', name: 'Lê Quản Lý', role: 'OWNER', status: 'active', joinedDate: '15/11/2023' },
    { id: '4', name: 'Phạm Văn Nghỉ', role: 'EMPLOYEE', status: 'inactive', joinedDate: '10/10/2023' },
  ]);

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', password: '', role: 'EMPLOYEE' });

  // 2. Logic xử lý
  const filteredStaff = staff.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: any) => {
    setStaff(staff.map((s: any) => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    ));
  };

  const removeStaff = (id: any) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setStaff(staff.filter((s: any) => s.id !== id));
    }
  };

  const handleAddStaff = (e: any) => {
    e.preventDefault();
    const created = {
      id: Date.now().toString(),
      name: newStaff.name,
      role: newStaff.role,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('vi-VN')
    };
    setStaff([created, ...staff]);
    setShowAddModal(false);
    setNewStaff({ name: '', password: '', role: 'EMPLOYEE' });
  };

  return (
    <MainLayout title="Quản lí nhân viên">
      <div className="p-8 bg-slate-50 min-h-screen space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý Nhân sự</h2>
            <p className="text-slate-500 font-medium">Cấp quyền và giám sát hoạt động đội ngũ cửa hàng.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <UserPlus size={20} /> Thêm Nhân viên mới
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Tìm theo tên nhân viên..."
          />
        </div>

        {/* Grid Danh sách */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member: any) => (
            <div key={member.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border transition-colors ${
                    member.status === 'active' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight">{member.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                      <ShieldCheck size={12} className={member.role === 'OWNER' ? 'text-indigo-500' : 'text-slate-400'} />
                      {member.role === 'OWNER' ? 'Quản lý/Chủ' : 'Nhân viên'}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {member.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Calendar size={14} className="text-slate-300" /> Gia nhập: {member.joinedDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Lock size={14} className="text-slate-300" /> User: <span className="text-indigo-600 font-bold">{member.name}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={() => toggleStatus(member.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                    member.status === 'active' 
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  {member.status === 'active' ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                  {member.status === 'active' ? 'Tạm khóa' : 'Mở khóa'}
                </button>
                <button 
                  onClick={() => removeStaff(member.id)}
                  className="bg-slate-50 text-slate-400 p-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Thêm nhân viên */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <h4 className="font-bold flex items-center gap-2">
                  <UserPlus size={20} /> Tạo tài khoản nhân viên
                </h4>
                <button onClick={() => setShowAddModal(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddStaff} className="p-8 space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ tên nhân viên</label>
                  <div className="relative mt-1.5">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required 
                      value={newStaff.name}
                      onChange={(e: any) => setNewStaff({...newStaff, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required 
                      type="password"
                      value={newStaff.password}
                      onChange={(e: any) => setNewStaff({...newStaff, password: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò</label>
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    <button 
                      type="button"
                      onClick={() => setNewStaff({...newStaff, role: 'EMPLOYEE'})}
                      className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                        newStaff.role === 'EMPLOYEE' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'
                      }`}
                    >
                      <Briefcase size={16} /> Nhân viên
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewStaff({...newStaff, role: 'OWNER'})}
                      className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                        newStaff.role === 'OWNER' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'
                      }`}
                    >
                      <ShieldCheck size={16} /> Quản lý
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all"
                >
                  Xác nhận tạo tài khoản
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}