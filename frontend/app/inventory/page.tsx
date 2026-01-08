"use client";
import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  X,
  Save,
  Box,
  Tag,
  DollarSign,
  Layers,
  Trash2,
  AlertCircle,
  History // Vẫn giữ import History dù không dùng trong code gốc
} from 'lucide-react';
import { useAuth } from "../../modules/useAuth";
import { API_BASE_URL, ENDPOINTS } from '../../modules/api/api.config';

import MainLayout from "../../components/MainLayout";

// Định nghĩa lại Types cơ bản (thay thế import)
type UnitOfMeasure = {
  name: string;
  price: number;
};

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  baseUnit: string;
  stockLevel: number;
  minStock: number;
  units: UnitOfMeasure[];
};

export default function Inventory() {
  const { user, logout } = useAuth();
  // Dữ liệu mẫu (thay thế props)
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'p1',
      name: 'Nước Khoáng Lavie',
      sku: 'NK001',
      category: 'Đồ uống',
      baseUnit: 'Chai',
      stockLevel: 150,
      minStock: 50,
      units: [{ name: 'Chai', price: 5000 }],
    },
  ]);

  // Hàm giả lập thay thế onUpdateProducts
  const onUpdateProducts = (updatedProducts: Product[]) => {
    console.log('Updating products (mock):', updatedProducts);
    setProducts(updatedProducts);
  };

  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '', // string
    stockLevel: '', // string
    baseUnit: '',
  });

  const onNotify = (notif: { title: string; message: string; type: 'info' | 'success' | 'error' }) => {
    console.log(`Notification (${notif.type}): ${notif.title} - ${notif.message}`);
    alert(`${notif.title}: ${notif.message}`); // Dùng alert để demo
  };

  const fetchProducts = async () => {
      // Giả định endpoint API đã được tạo
      try {
        if (!user) {
          return null;
        }
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
            {
              id: 'p1',
              name: 'Nước Khoáng Lavie 400ml',
              sku: 'NK001',
              category: 'Đồ uống',
              baseUnit: 'Chai',
              stockLevel: 150,
              minStock: 50,
              units: [
                { name: 'Chai', price: 5000 }
              ],
            }
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
          {
            id: 'p1',
            name: 'Nước Khoáng Lavie 500ml',
            sku: 'NK001',
            category: 'Đồ uống',
            baseUnit: 'Chai',
            stockLevel: 1500000,
            minStock: 50,
            units: [
              { name: 'Chai', price: 5000 }
            ],
          },
          {
            id: 'p2',
            name: 'Gạo Tẻ Thơm ST25 (5kg)',
            sku: 'GT002',
            category: 'Thực phẩm',
            baseUnit: 'Bao(5kg)',
            stockLevel: 80,
            minStock: 20,
            units: [
              { name: 'Bao(5kg)', price: 120000 }
            ],
          },
          {
            id: 'p3',
            name: 'Mì Tôm Hảo Hảo (Thùng)',
            sku: 'MT003',
            category: 'Thực phẩm',
            baseUnit: 'Gói',
            stockLevel: 30,
            minStock: 10,
            units: [
              { name: 'Thùng(30)', price: 150000 },
              { name: 'Gói', price: 5000 },
            ],
          },
          {
            id: 'p4',
            name: 'Sữa Tươi Vinamilk 1L',
            sku: 'ST004',
            category: 'Đồ uống',
            baseUnit: 'Hộp',
            stockLevel: 220,
            minStock: 100,
            units: [
              { name: 'Hộp', price: 35000 },
              { name: 'Thùng(12)', price: 380000 },
            ],
          },
        ];

        setProducts(sampleData);
      }
    };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.category.toLowerCase().includes(filter.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', stockLevel: '', baseUnit: '' });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    // Thiết lập giá trị mặc định cho form thêm
    setFormData({ name: '', category: '', price: '', stockLevel: '0', baseUnit: 'Cái' });
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    // Lưu ý: Code gốc chỉ lấy đơn vị đầu tiên (units[0])
    setFormData({
      name: product.name,
      category: product.category,
      price: product.units[0].price.toString(),
      stockLevel: product.stockLevel.toString(),
      baseUnit: product.baseUnit,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi kho hàng?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
      alert('Đã xóa sản phẩm thành công (Demo).');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.baseUnit) return;

    if (editingProduct) {
      // Cập nhật sản phẩm cũ
      const updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formData.name,
            category: formData.category || 'Chưa phân loại',
            baseUnit: formData.baseUnit,
            stockLevel: parseInt(formData.stockLevel) || 0,
            units: [
              { ...p.units[0], name: formData.baseUnit, price: parseInt(formData.price) || 0 }
            ]
          };
        }
        return p;
      });
      onUpdateProducts(updatedProducts);
      alert(`Đã cập nhật sản phẩm "${formData.name}" (Demo).`);
    } else {
      // Thêm sản phẩm mới
      const productToAdd: Product = {
        id: `p-${Date.now()}`,
        name: formData.name,
        sku: `PROD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        category: formData.category || 'Chưa phân loại',
        baseUnit: formData.baseUnit,
        stockLevel: parseInt(formData.stockLevel) || 0,
        minStock: 10,
        units: [
          { name: formData.baseUnit, price: parseInt(formData.price) || 0 }
        ]
      };
      onUpdateProducts([productToAdd, ...products]);
      alert(`Đã thêm sản phẩm "${formData.name}" mới (Demo).`);
    }

    resetForm();
  };

  useEffect(() => {
      if (user) {
        fetchProducts();
      }
    }, [user]);
  
    if (!user) {
      return null;
    }

  return (
    <MainLayout title="Quản lý kho" user={user} logout={logout}>
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Danh mục Sản phẩm (Kho hàng)</h2>
          <p className="text-slate-500">Quản lý kho hàng và thông tin sản phẩm.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold"
        >
          <Plus size={20} /> Thêm Sản phẩm mới
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Lọc theo tên sản phẩm hoặc danh mục..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-800 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4">Tồn kho</th>
                <th className="px-6 py-4">Đơn vị</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{p.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="text-slate-800 px-6 py-4 text-sm font-medium">
                    {p.units[0].price.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.stockLevel <= p.minStock ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <span className={`text-sm font-medium ${p.stockLevel <= p.minStock ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                        {p.stockLevel} {p.baseUnit}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {p.baseUnit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold flex items-center gap-2 text-lg">
                <Box size={24} className="text-indigo-400" />
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h4>
              <button onClick={resetForm} className="text-white/60 hover:text-white transition-colors p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên sản phẩm</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      autoFocus
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="text-indigo-600 font-bold w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="Nhập tên sản phẩm..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh mục</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="text-indigo-600 font-bold w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Đồ uống, Thực phẩm..."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá bán (VNĐ)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-indigo-600"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số lượng tồn kho</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        value={formData.stockLevel}
                        onChange={(e) => setFormData({...formData, stockLevel: e.target.value})}
                        className="text-indigo-600 font-bold w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị tính</label>
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        value={formData.baseUnit}
                        onChange={(e) => setFormData({...formData, baseUnit: e.target.value})}
                        className="text-indigo-600 font-bold w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Cái, Chai, Túi..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {editingProduct && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                    Bạn đang cập nhật trực tiếp giá bán và số lượng tồn kho cho sản phẩm này. Hãy kiểm tra kỹ trước khi lưu.
                  </p>
                </div>
              )}

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-4 py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingProduct ? 'Cập nhật thay đổi' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </MainLayout>
  );
}