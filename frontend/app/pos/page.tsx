"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  User as UserIcon,
  Bot,
  CreditCard,
  CheckCircle,
  Send,
  Package,
  Plus,
  Minus,
  UserPlus,
  X,
  ChevronDown,
} from 'lucide-react';
import { API_BASE_URL, ENDPOINTS } from '../../modules/api/api.config';
import { useAuth } from "../../modules/useAuth";

import MainLayout from "../../components/MainLayout";

// ... [Giữ nguyên các Type và Enum] ...
type Product = {
  id: string;
  name: string;
  sku: string;
  stockLevel: number;
  minStock: number;
  units: { name: string; price: number }[];
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  debt: number;
  purchaseHistory: any[];
};

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitName: string;
  unitPrice: number;
  total: number;
};

type Order = {
  id: string;
  customerId?: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  status: OrderStatus;
  createdAt: string;
  createdBy: string;
};

enum OrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

const Smartphone = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

export default function POS() {
  const { user, logout } = useAuth();

  // --- STATE DỮ LIỆU CHÍNH ---
  const [products, setProducts] = useState<Product[]>([]); // Sẽ fetch từ server
  const [customers, setCustomers] = useState<Customer[]>([ // Dữ liệu khách hàng mẫu
    { id: 'c1', name: 'Nguyễn Văn An', phone: '0901234567', debt: 500000, purchaseHistory: [] },
    { id: 'c2', name: 'Trần Thị Bình', phone: '0987654321', debt: 0, purchaseHistory: [] },
    { id: 'c3', name: 'Lê Văn Cường', phone: '0777888999', debt: 150000, purchaseHistory: [] },
  ]);

  // --- STATE NGHIỆP VỤ POS ---
  const [search, setSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'DEBT'>('CASH');

  // State cho thông tin khách hàng nhập nhanh
  const [quickCustomerInfo, setQuickCustomerInfo] = useState({ name: '', phone: '' });

  // State cho form thêm khách hàng nhanh vào DB
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  
  const [aiInput, setAiInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // --- MOCK API CALLS & NOTIFICATION ---
  const onOrderCreated = (order: Order) => {
    console.log('Order created (mock):', order);
    // Cập nhật nợ giả
    if (order.debtAmount > 0 && order.customerId) {
      setCustomers(prev => prev.map(c => 
        c.id === order.customerId ? { ...c, debt: c.debt + order.debtAmount } : c
      ));
    }
  };

  const onNotify = (notif: { title: string; message: string; type: 'info' | 'success' | 'error' }) => {
    console.log(`Notification (${notif.type}): ${notif.title} - ${notif.message}`);
    alert(`${notif.title}: ${notif.message}`); // Dùng alert để demo
  };

  // --- FETCH DATA TỪ SERVER ---
  const fetchProducts = async () => {
    // Giả định endpoint API đã được tạo
    try {      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVENTORY}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Thêm token Auth nếu cần thiết
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách sản phẩm');
      }

      // Mô phỏng dữ liệu trả về từ server (thay thế bằng response.json() thực tế)
      const data = await response.json(); 
      const products_data = data.products_data

      console.log(data.msg);

      // Nếu không gọi được API, dùng dữ liệu mẫu thay thế để test UI
      if (products_data.length === 0) {
        // Dữ liệu mẫu thay thế (Nếu API fail/chưa setup)
        const sampleData: Product[] = [
          { id: 'p1', name: 'Nước Khoáng Lavie 500ml', sku: 'NK001', stockLevel: 150, minStock: 50, units: [{ name: 'Chai', price: 5000 }, { name: 'Thùng(24)', price: 100000 }] },
          { id: 'p2', name: 'Gạo Tẻ Thơm ST25 (5kg)', sku: 'GT002', stockLevel: 80, minStock: 20, units: [{ name: 'Bao(5kg)', price: 120000 }] },
          { id: 'p3', name: 'Mì Tôm Hảo Hảo (Thùng)', sku: 'MT003', stockLevel: 30, minStock: 10, units: [{ name: 'Thùng(30)', price: 150000 }, { name: 'Gói', price: 5000 }] },
          { id: 'p4', name: 'Sữa Tươi Vinamilk 1L', sku: 'ST004', stockLevel: 220, minStock: 100, units: [{ name: 'Hộp', price: 35000 }, { name: 'Thùng(12)', price: 380000 }] },
        ];
        onNotify({ title: 'Cảnh báo', message: 'Dùng dữ liệu mẫu do không thể kết nối Inventory API.', type: 'info' });
        setProducts(sampleData);
      } else {
        setProducts(products_data);
      }

    } catch (error: any) {
      console.error('Error fetching products:', error);
      onNotify({ title: 'Lỗi API', message: error.message || 'Không thể tải dữ liệu sản phẩm.', type: 'error' });
      // Thêm data mẫu dự phòng
      const sampleData: Product[] = [
        { id: 'p1', name: 'Nước Khoáng Lavie 500ml', sku: 'NK001', stockLevel: 150, minStock: 50, units: [{ name: 'Chai', price: 5000 }, { name: 'Thùng(24)', price: 100000 }] },
        { id: 'p2', name: 'Gạo Tẻ Thơm ST25 (5kg)', sku: 'GT002', stockLevel: 80, minStock: 20, units: [{ name: 'Bao(5kg)', price: 120000 }] },
      ];
      setProducts(sampleData);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  // --- LOGIC TÍNH TOÁN INLINE (thay cho useMemo) ---
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCustomers = customerSearch.length > 0
    ? customers.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
    )
    : [];
    
  const total = cart.reduce((sum, item) => sum + item.total, 0);

  // --- LOGIC GIỎ HÀNG ---
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      const defaultUnit = product.units[0];
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitName: defaultUnit.name,
        unitPrice: defaultUnit.price,
        total: defaultUnit.price
      }]);
    }
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(cart.map(item =>
      item.productId === id
        ? { ...item, quantity: newQty, total: newQty * item.unitPrice }
        : item
    ));
  };

  const changeUnit = (productId: string, unitName: string) => {
    const product = products.find(p => p.id === productId);
    const unit = product?.units.find(u => u.name === unitName);
    if (unit) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, unitName: unit.name, unitPrice: unit.price, total: item.quantity * unit.price }
          : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.productId !== id));
  };

  const clearCart = () => {
    if (confirm('Xác nhận xóa toàn bộ giỏ hàng?')) {
      setCart([]);
    }
  };
 
  // --- LOGIC XỬ LÝ KHÁCH HÀNG ---
  const handleQuickAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
        onNotify({ title: "Lỗi", message: "Vui lòng nhập đủ tên và số điện thoại", type: "error" });
        return;
    }

    const created: Customer = {
      id: `c-${Date.now()}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
      debt: 0,
      purchaseHistory: []
    };

    // Thêm vào danh sách khách hàng (Mô phỏng lưu DB)
    setCustomers(prev => [...prev, created]);

    setSelectedCustomer(created);
    setShowAddCustomer(false);
    setNewCustomer({ name: '', phone: '' });
    onNotify({ title: "Thành công", message: "Đã thêm khách hàng mới", type: "success" });
  };

  // --- LOGIC THANH TOÁN ---
  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!selectedCustomer && (!quickCustomerInfo.name || !quickCustomerInfo.phone)) {
      onNotify({ title: "Thiếu thông tin", message: "Vui lòng nhập Họ tên và Số điện thoại khách hàng.", type: "info" });
      return;
    }

    setIsProcessing(true);
    const finalCustomerName = selectedCustomer?.name || quickCustomerInfo.name;
    const finalCustomerId = selectedCustomer?.id;

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerId: finalCustomerId,
      customerName: finalCustomerName,
      items: cart,
      totalAmount: total,
      paidAmount: paymentMode === 'CASH' ? total : 0,
      debtAmount: paymentMode === 'DEBT' ? total : 0,
      status: OrderStatus.CONFIRMED,
      createdAt: new Date().toISOString(),
      createdBy: user.name
    };

    // Mô phỏng gửi order lên server
    setTimeout(() => {
      onOrderCreated(newOrder); // Dùng hàm mô phỏng
      setCart([]);
      setSelectedCustomer(null);
      setQuickCustomerInfo({ name: '', phone: '' });
      setIsProcessing(false);
      onNotify({ // Dùng hàm mô phỏng
        title: "Đơn hàng hoàn tất",
        message: `Đơn hàng ${newOrder.id} đã được xử lý thành công.`,
        type: 'success'
      });
    }, 1000);
  };

  return (
    <MainLayout title="Bán hàng/POS" user={user} logout={logout}>
    <div className="h-full flex flex-col gap-6 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          
          {/* AI BAR (Giữ nguyên) */}
          <div className="bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-200">
                <Bot className="text-white" size={18} />
              </div>
              <span className="font-bold text-indigo-900 text-sm">Trợ lý Đơn hàng AI</span>
              <span className="text-[10px] bg-white text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-100 font-bold uppercase tracking-wider">Mới</span>
            </div>
            <div className="flex gap-2">
              <input 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                //onKeyDown={(e) => e.key === 'Enter' && handleAiParsing()}
                placeholder="Nhập yêu cầu: '2 chai nước khoáng và 1 túi gạo cho anh A'..."
                className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />
              <button 
                //onClick={handleAiParsing}
                disabled={isAiProcessing}
                className="bg-indigo-600 text-white px-5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center min-w-[50px]"
              >
                {isAiProcessing ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Send size={18} />}
              </button>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col min-h-0 shadow-sm">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm nhanh theo tên..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pr-2 custom-scrollbar">
              {products.length === 0 ? (
                <div className="col-span-4 text-center py-10 text-slate-400">Đang tải sản phẩm hoặc chưa có dữ liệu...</div>
              ) : (
                filteredProducts.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all text-left group relative overflow-hidden"
                  >
                    <div className="h-28 bg-slate-50 rounded-xl mb-3 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 transition-colors">
                      <Package size={40} className="group-hover:text-indigo-200 transition-colors" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[40px] leading-tight mb-2">{p.name}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-600 font-black text-base">{p.units[0].price.toLocaleString()}đ</span>
                      <div className={`w-2 h-2 rounded-full ${p.stockLevel > p.minStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">
                        <Plus size={14} />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: GIỎ HÀNG VÀ THANH TOÁN (Giữ nguyên logic cũ) */}
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <ShoppingCart size={20} className="text-indigo-600" /> Giỏ hàng
            </h3>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-slate-400 hover:text-rose-500 transition-colors">
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {/* CUSTOMER SECTION */}
          <div className="p-5 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng hệ thống</p>
              <button 
                onClick={() => setShowAddCustomer(true)}
                className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <UserPlus size={12} /> Đăng ký mới
              </button>
            </div>
            
            <div className="relative">
              {!selectedCustomer ? (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="Tìm tên hoặc số điện thoại..."
                    className="text-slate-800 w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto">
                      {filteredCustomers.map(c => (
                        <button 
                          key={c.id}
                          onClick={() => {
                            setSelectedCustomer(c);
                            setShowCustomerDropdown(false);
                            setCustomerSearch('');
                          }}
                          className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-800">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.phone}</p>
                          </div>
                          {c.debt > 0 && <span className="text-[10px] font-bold text-rose-500">Nợ: {c.debt.toLocaleString()}đ</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none mb-1">{selectedCustomer.name}</p>
                      <p className="text-[10px] text-indigo-600 font-medium">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedCustomer(null); }} className="text-slate-400 hover:text-rose-500">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CART ITEMS */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-30 grayscale">
                <ShoppingCart size={64} strokeWidth={1} className="mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Giỏ hàng trống</p>
              </div>
            ) : (
              cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{item.productName}</p>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <select 
                              value={item.unitName}
                              onChange={(e) => changeUnit(item.productId, e.target.value)}
                              className="appearance-none bg-indigo-100 text-indigo-700 text-[10px] font-bold py-1 px-3 pr-6 rounded-lg outline-none cursor-pointer hover:bg-indigo-200 transition-colors"
                            >
                              {product?.units.map(u => (
                                <option key={u.name} value={u.name}>{u.name}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={10} />
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">@{item.unitPrice.toLocaleString()}đ</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1 pt-2 border-t border-slate-200/50">
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-slate-800 hover:text-indigo-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="text-slate-700 w-10 text-center text-xs font-bold bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-slate-800 hover:text-indigo-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-black text-slate-900 text-sm">{item.total.toLocaleString()}đ</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* TOTAL & ACTIONS */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
            
            {/* Form thông tin khách hàng nhập nhanh */}
            {!selectedCustomer && (
              <div className={`p-4 border rounded-2xl space-y-3 animate-in slide-in-from-bottom-2 duration-300 transition-all ${
                paymentMode === 'DEBT' ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'
              }`}>
                <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  paymentMode === 'DEBT' ? 'text-rose-600' : 'text-indigo-600'
                }`}>
                  <UserPlus size={12} /> {paymentMode === 'DEBT' ? 'Thông tin khách ghi nợ' : 'Thông tin khách hàng'}
                </p>
                <div className="space-y-2">
                  <div className="relative">
                    <UserIcon className={`absolute left-3 top-1/2 -translate-y-1/2 ${paymentMode === 'DEBT' ? 'text-rose-300' : 'text-indigo-300'}`} size={14} />
                    <input 
                      required
                      placeholder="Họ và tên khách hàng..."
                      value={quickCustomerInfo.name}
                      onChange={(e) => setQuickCustomerInfo({...quickCustomerInfo, name: e.target.value})}
                      className={`text-slate-900 w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 transition-all shadow-sm ${
                        paymentMode === 'DEBT' ? 'border-rose-100 focus:ring-rose-500 placeholder:text-rose-200' : 'border-indigo-100 focus:ring-indigo-500 placeholder:text-indigo-300'
                      }`}
                    />
                  </div>
                  <div className="relative">
                    <Smartphone className={`absolute left-3 top-1/2 -translate-y-1/2 ${paymentMode === 'DEBT' ? 'text-rose-300' : 'text-indigo-300'}`} size={14} />
                    <input 
                      required
                      type="tel"
                      placeholder="Số điện thoại..."
                      value={quickCustomerInfo.phone}
                      onChange={(e) => setQuickCustomerInfo({...quickCustomerInfo, phone: e.target.value})}
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-sm outline-none focus:ring-2 transition-all shadow-sm ${
                        paymentMode === 'DEBT' ? 'border-rose-100 focus:ring-rose-500 placeholder:text-rose-200' : 'border-indigo-100 focus:ring-indigo-500 placeholder:text-indigo-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-500 text-xs">
                <span>Tạm tính ({cart.length} mặt hàng)</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">Tổng cộng</span>
                <span className="text-2xl font-black text-indigo-600">{total.toLocaleString()}đ</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setPaymentMode('CASH')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border-2 flex flex-col items-center gap-1 transition-all ${paymentMode === 'CASH' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
              >
                <CreditCard size={18} /> Tiền mặt/Thẻ
              </button>
              <button 
                onClick={() => setPaymentMode('DEBT')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border-2 flex flex-col items-center gap-1 transition-all ${paymentMode === 'DEBT' ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
              >
                <Bot size={18} /> Ghi nợ
              </button>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isProcessing}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-30 shadow-xl"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-white" />
              ) : (
                <>
                  <CheckCircle size={20} /> HOÀN TẤT & IN HÓA ĐƠN
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ADD CUSTOMER MODAL (Giữ nguyên) */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold flex items-center gap-2">
                <UserPlus size={20} /> Đăng ký khách hàng mới
              </h4>
              <button onClick={() => setShowAddCustomer(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleQuickAddCustomer} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ tên khách hàng</label>
                <input 
                  autoFocus
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nhập tên..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                <input 
                  required
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nhập số điện thoại..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
              >
                Lưu vào hệ thống
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  </MainLayout>
  );
}