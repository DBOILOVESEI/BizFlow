"use client";

import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Zap, User as UserIcon, ShieldCheck, ShoppingCart, ArrowRight, Mail, Lock, Building, Hash, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface SignUpProps {
  onSignUp: (user: User) => void;
  onToggle: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onToggle }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    inviteCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onSignUp({
        id: `u-${Date.now()}`,
        name: formData.name,
        email: selectedRole === UserRole.OWNER ? formData.email : `${formData.name.toLowerCase().replace(/\s/g, '')}@store.local`,
        role: selectedRole || UserRole.EMPLOYEE
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]" />

      <div className="max-w-5xl w-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative z-10 min-h-[600px] flex flex-col">
        
        <div className="p-8 lg:px-12 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">BizFlow</span>
          </div>
          <button onClick={onToggle} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            Đã có tài khoản? <span className="text-indigo-400 ml-1">Đăng nhập</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-white">
          
          {step === 1 ? (
            <div className="w-full max-w-2xl text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">Chào mừng bạn đến với tương lai của <span className="text-indigo-600 italic">bán lẻ.</span></h2>
              <p className="text-slate-500 mb-12 text-lg">Hãy cho chúng tôi biết bạn sẽ sử dụng BizFlow như thế nào.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => handleRoleSelect(UserRole.OWNER)}
                  className="group p-8 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-left relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                    <Building size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Chủ cửa hàng</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Tạo không gian làm việc mới, quản lý nhân sự và xem báo cáo chi tiết.</p>
                  <ArrowRight className="absolute bottom-8 right-8 text-indigo-300 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" size={24} />
                </button>

                <button 
                  onClick={() => handleRoleSelect(UserRole.EMPLOYEE)}
                  className="group p-8 rounded-[2rem] border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 text-left relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Nhân viên</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">Tham gia cửa hàng hiện có bằng mã mời để quản lý bán hàng và kho.</p>
                  <ArrowRight className="absolute bottom-8 right-8 text-blue-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Quay lại
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {selectedRole === UserRole.OWNER ? 'Thiết lập cửa hàng' : 'Tham gia đội ngũ'}
                </h2>
                <p className="text-slate-500">Điền thông tin của bạn để tạo tài khoản.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Tên đăng nhập
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="text-slate-700 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder={selectedRole === UserRole.OWNER ? "VD: chutiem_01" : "VD: nhanvien_01"}
                      />
                    </div>
                  </div>

                  {selectedRole === UserRole.OWNER && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Địa chỉ Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="text-slate-700 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="email@store.com"
                        />
                      </div>
                    </div>
                  )}

                  {selectedRole === UserRole.OWNER ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tên Doanh nghiệp</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text"
                          required
                          placeholder="VD: Tiệm Tạp Hóa A"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          className="text-slate-700 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mã Mời Từ Chủ Tiệm</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text"
                          required
                          placeholder="STORE-12345"
                          value={formData.inviteCode}
                          onChange={(e) => setFormData({...formData, inviteCode: e.target.value})}
                          className="text-slate-700 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mật khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="text-slate-700 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 mt-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${selectedRole === UserRole.OWNER ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Hoàn tất Đăng ký <CheckCircle2 size={18} /></>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SignUp;
