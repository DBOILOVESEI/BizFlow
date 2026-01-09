'use client'
import { useState } from 'react'
import { Search, Phone, CreditCard } from 'lucide-react'
import MainLayout from "../../components/MainLayout";
import { useAuth } from "../../modules/useAuth";

// Dữ liệu mẫu ban đầu
const initialCustomers = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', debt: 0 },
  { id: 2, name: 'Trần Thị B', phone: '0912345678', debt: 300000 },
  { id: 3, name: 'Lê Văn C', phone: '0987654321', debt: 800000 }
]

export default function Customers() {
  const { user, logout } = useAuth();
  const [customers, setCustomers] = useState<any[]>(initialCustomers);
  const [search, setSearch] = useState('');

  // FUNCTION THU NỢ & XÓA KHỎI DANH SÁCH NẾU HẾT NỢ
  const handleCollectDebt = async (customer: any) => {
    if (customer.debt <= 0) return;

    const amountInput = prompt(`Nhập số tiền khách ${customer.name} thanh toán:`, customer.debt);
    if (amountInput === null || amountInput.trim() === "") return;
    
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      alert("Số tiền không hợp lệ!");
      return;
    }

    try {
      // Gửi request lên server
      const response = await fetch('/api/debts/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer.id,
          paid_amount: amount,
          updated_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert("Cập nhật thành công!");
        
        // LOGIC XỬ LÝ GIAO DIỆN:
        // Nếu số tiền trả bằng hoặc lớn hơn số nợ hiện tại -> Xóa khỏi danh sách
        if (amount >= customer.debt) {
          setCustomers(prev => prev.filter(c => c.id !== customer.id));
        } else {
          // Nếu vẫn còn nợ (trả một phần) -> Cập nhật lại số nợ hiển thị
          setCustomers(prev => prev.map(c => 
            c.id === customer.id ? { ...c, debt: c.debt - amount } : c
          ));
        }
      } else {
        alert("Lỗi server, không thể cập nhật.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  };

  // Chỉ hiển thị những khách còn nợ (debt > 0) và khớp với ô tìm kiếm
  const filtered = customers.filter(c =>
    c.debt > 0 && (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    )
  )

  return (
    <MainLayout title="Quản lí thu nợ" user={user} logout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Danh sách nợ cần thu</h2>
          <p className="text-slate-500">Khách hàng sẽ tự động biến mất khỏi danh sách sau khi hoàn thành nợ.</p>
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

        {/* Customer list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {c.name.charAt(0)}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${c.debt > 500000 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                    NỢ: {c.debt.toLocaleString()}đ
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-900">{c.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                  <Phone size={14} /> {c.phone}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50">
                  <button 
                    onClick={() => handleCollectDebt(c)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm active:scale-95 transition-all"
                  >
                    <CreditCard size={18} />
                    Thu nợ ngay
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-slate-400">
              Không còn khách hàng nào nợ tiền.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}