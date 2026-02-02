'use client'
import React, { useState, useEffect } from 'react'
import { Search, Phone, CreditCard, Loader2, RefreshCw } from 'lucide-react'
import MainLayout from "../../components/MainLayout";
import { useAuth } from "../../modules/useAuth";
import { API_BASE_URL } from '../../modules/api/api.config'; // Nhớ import file config

export default function Customers() {
  const { user, logout } = useAuth();
  
  // State lưu danh sách khách hàng từ API
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // --- 1. HÀM TẢI DỮ LIỆU TỪ SERVER ---
  const fetchCustomers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Gọi API lấy danh sách khách hàng
      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: {
            'Content-Type': 'application/json',
             'Authorization': `Bearer ${user.token}` // Bật lên nếu cần token
        }
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        // Lọc chỉ lấy những người CÓ NỢ (> 0) để hiển thị
        // (Hoặc nếu Backend đã có API /customers/debtors thì gọi cái đó tốt hơn)
        const debtors = result.data.filter((c: any) => c.total_debt > 0);
        setCustomers(debtors);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi mới vào trang
  useEffect(() => {
    fetchCustomers();
  }, [user]);

  // --- 2. HÀM THU NỢ NGAY (XÓA SẠCH NỢ) ---
  const handleSettleDebt = async (customer: any) => {
    // Hỏi lại cho chắc để tránh bấm nhầm
    const confirmSettle = window.confirm(
      `Xác nhận: Khách hàng [${customer.full_name}] đã trả hết ${customer.total_debt.toLocaleString()}đ?\n\nHành động này sẽ xóa nợ khỏi hệ thống nhưng KHÔNG cộng vào doanh thu mới.`
    );

    if (!confirmSettle) return;

    try {
      // Gọi API Backend xóa nợ
      const response = await fetch(`${API_BASE_URL}/customers/${customer.customer_id}/settle-debt`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
        }
      });

      const result = await response.json();

      if (response.ok || result.status === 'success') {
        alert("Đã thu nợ thành công!");
        
        // CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC
        // Loại bỏ khách hàng này khỏi danh sách đang hiển thị (Client-side)
        setCustomers(prev => prev.filter(c => c.customer_id !== customer.customer_id));
        
      } else {
        alert("Lỗi: " + (result.message || "Không thể cập nhật"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  // Logic tìm kiếm (Client-side search)
  const filtered = customers.filter(c =>
    (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  // --- RENDER ---
  return (
    <MainLayout title="Quản lí thu nợ" user={user} logout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Danh sách nợ cần thu</h2>
            <p className="text-slate-500">Khách hàng sẽ biến mất khỏi danh sách này sau khi bấm "Thu nợ ngay".</p>
          </div>
          <button 
            onClick={fetchCustomers} 
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            title="Tải lại dữ liệu"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khách nợ theo tên hoặc SĐT..."
            className="text-slate-800 w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Loading State */}
        {loading ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        ) : (
            /* Customer list */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
                filtered.map(c => (
                <div key={c.customer_id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl uppercase">
                        {(c.full_name || '?').charAt(0)}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${c.total_debt > 500000 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                        NỢ: {c.total_debt?.toLocaleString()}đ
                    </div>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900">{c.full_name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <Phone size={14} /> {c.phone || 'Không có SĐT'}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-50">
                    <button 
                        onClick={() => handleSettleDebt(c)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm active:scale-95 transition-all"
                    >
                        <CreditCard size={18} />
                        Thu nợ ngay
                    </button>
                    </div>
                </div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                   Tuyệt vời! Hiện tại không có khách hàng nào nợ tiền.
                </div>
            )}
            </div>
        )}
      </div>
    </MainLayout>
  )
}