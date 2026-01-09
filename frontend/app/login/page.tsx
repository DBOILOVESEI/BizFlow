"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, ENDPOINTS } from '../../modules/api/api.config';

// Helper
import { User, UserRole } from '../../types';
import { 
  Zap, 
  User as UserIcon, 
  ShieldCheck, 
  ShoppingCart, 
  ArrowRight, 
  Mail, 
  Lock, 
  ArrowLeft, 
  KeyRound, 
  Send,
  CheckCircle2
} from 'lucide-react';
import { MOCK_USERS } from "../constants";

export default function Login() {
  const router = useRouter();

  const [view, setView] = useState<'login' | 'forgot-password'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotSubmitted, setIsForgotSubmitted] = useState(false);

  function goToSignup(): void {
    router.push('/signup');
  }
  
  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Gửi lên server để kiểm tra
    const loginData = {
      username: identifier, // username để server tìm
      password: password
    };
    
    try {
      // Gửi Yêu cầu Đăng nhập đến backend
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('accessToken', data.access_token);

        // Gọi hàm onLogin với thông tin người dùng từ response (nếu server trả về)
        // Nếu server không trả về object user, bạn cần fetch thêm hoặc parse token.
        // Dựa trên code backend sửa, server trả về user:
        const loggedInUser: User = data.user

        // optional redirect by role
        if (loggedInUser.role === 'OWNER') {
          router.push(ENDPOINTS.DASHBOARD)
        } else if (loggedInUser.role === 'EMPLOYEE') {
          router.push(ENDPOINTS.POS)
        }

        
      } else {
        // Đăng nhập thất bại (Status 401, 400, v.v...)
        // Hiển thị thông báo lỗi từ server
        alert(data.msg || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      console.error("Lỗi kết nối server:", error);
      alert("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Giả lập gửi yêu cầu khôi phục
    setTimeout(() => {
      setIsLoading(false);
      setIsForgotSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative z-10">
        
        {/* Cột bên trái: Branding & Intro */}
        <div className="p-12 lg:p-16 flex flex-col justify-between bg-linear-to-br from-indigo-600/20 to-transparent border-r border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
                <Zap size={28} className="text-white fill-white" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">BizFlow</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6">
              Nâng tầm kinh doanh với <span className="text-indigo-400 italic font-medium">trí tuệ nhân tạo.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
              Giải pháp ERP thế hệ mới cho bán lẻ hiện đại. Đồng bộ kho, tự động hóa sổ sách và mở rộng quy mô.
            </p>
          </div>
          
          <div className="mt-12 hidden lg:block">
            <p className="text-slate-500 text-sm mb-6 uppercase tracking-widest font-bold">Truy cập nhanh (Demo)</p>
            <div className="flex flex-wrap gap-3">
              <button 
                //onClick={() => handleQuickLogin(UserRole.OWNER)} 
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
              >
                 <UserIcon size={14} className="text-indigo-400" /> Chủ tiệm
              </button>
              <button 
                //onClick={() => handleQuickLogin(UserRole.EMPLOYEE)} 
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
              >
                 <ShoppingCart size={14} className="text-blue-400" /> Nhân viên
              </button>
              <button 
                //onClick={() => handleQuickLogin(UserRole.ADMIN)} 
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
              >
                 <ShieldCheck size={14} className="text-amber-400" /> Admin
              </button>
            </div>
          </div>
        </div>

        {/* Cột bên phải: Forms */}
        <div className="p-12 lg:p-16 bg-white flex flex-col justify-center">
          
          {view === 'login' ? (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Đăng nhập</h2>
                <p className="text-slate-500">Chào mừng trở lại! Vui lòng điền thông tin.</p>
              </div>
              
              <form onSubmit={login} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Tên đăng nhập / Email</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Nhập tên đăng nhập hoặc email"
                      className="text-slate-700 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
                    <button 
                      type="button"
                      onClick={() => { setView('forgot-password'); setIsForgotSubmitted(false); }}
                      className="text-xs text-indigo-600 hover:underline font-bold"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="text-slate-700 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Đăng nhập <ArrowRight size={20} /></>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-slate-500">
                  Chưa có tài khoản? {' '}
                  {/* PHẦN CODE ĐÃ ĐƯỢC SỬA TẠI ĐÂY */}
                  <button 
                    onClick={goToSignup} 
                    className="text-indigo-600 font-bold hover:underline">
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 group font-bold text-sm"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Quay lại đăng nhập
              </button>

              <div className="mb-10">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <KeyRound size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Quên mật khẩu?</h2>
                <p className="text-slate-500">Đừng lo lắng, chúng tôi sẽ hỗ trợ bạn khôi phục quyền truy cập.</p>
              </div>

              {!isForgotSubmitted ? (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nhập tên đăng nhập hoặc Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="email@store.com hoặc tên đăng nhập"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Gửi yêu cầu khôi phục <Send size={18} /></>
                    )}
                  </button>
                  
                  <p className="text-xs text-center text-slate-400 leading-relaxed px-4">
                    Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu đến địa chỉ email đã đăng ký hoặc thông báo cho chủ cửa hàng để hỗ trợ bạn.
                  </p>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">Đã gửi yêu cầu!</h3>
                  <p className="text-emerald-700 text-sm leading-relaxed mb-6">
                    Vui lòng kiểm tra email của bạn hoặc liên hệ với Chủ cửa hàng để nhận mật khẩu mới.
                  </p>
                  <button 
                    onClick={() => setView('login')}
                    className="text-emerald-800 font-bold hover:underline text-sm"
                  >
                    Quay lại màn hình đăng nhập
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};