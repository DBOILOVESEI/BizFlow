"use client";
import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { useAuth } from "../../modules/useAuth";
import { updateProductOnServer, addProductToServer, deleteProductOnServer } from "../../modules/api/inventory.api"
import { API_BASE_URL, ENDPOINTS } from '../../modules/api/api.config';
import MainLayout from "../../components/MainLayout";

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
  
  const [products, setProducts] = useState<Product[]>([]); 
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stockLevel: '',
    baseUnit: '',
  });

  const onUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const onNotify = (notif: { title: string; message: string; type: 'info' | 'success' | 'error' }) => {
    console.log(`[${notif.type.toUpperCase()}] ${notif.title}: ${notif.message}`);
  };

  const filteredProducts = useMemo(() => {
    const filterText = filter.toLowerCase();
    return products.filter(p =>
      (p.name || "").toLowerCase().includes(filterText) ||
      (p.category || "").toLowerCase().includes(filterText)
    );
  }, [products, filter]);

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVENTORY}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm');

      const data = await response.json(); 
      const products_data = data.products_data;

      // Cập nhật state với dữ liệu thực từ server, nếu rỗng thì trả về mảng trống
      if (products_data && Array.isArray(products_data)) {
        setProducts(products_data);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      onNotify({ title: 'Lỗi API', message: error.message, type: 'error' });
      setProducts([]); // Xóa sạch dữ liệu cũ/mẫu nếu lỗi
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    } else {
      setProducts([]); // Clear khi logout
    }
  }, [user]);

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', stockLevel: '', baseUnit: '' });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', stockLevel: '0', baseUnit: 'Cái' });
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.units[0]?.price.toString() || "0",
      stockLevel: product.stockLevel.toString(),
      baseUnit: product.baseUnit,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!user) return;
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProductOnServer(user, id);
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Đã xóa thành công');
      } catch (error) {
        onNotify({ title: 'Lỗi', message: 'Không thể xóa sản phẩm.', type: 'error' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name || !formData.price || !formData.baseUnit) return;

    const dataToSend = {
      product_id: editingProduct?.id || "",
      name: formData.name,
      category: formData.category || 'Chưa phân loại',
      baseUnit: formData.baseUnit,
      stockLevel: parseInt(formData.stockLevel) || 0,
      price: parseInt(formData.price) || 0,
    };

    try {
      if (editingProduct) {
        await updateProductOnServer(user, [dataToSend]);
        const updated = products.map(p => 
          p.id === editingProduct.id 
          ? { ...p, ...dataToSend, units: [{ name: dataToSend.baseUnit, price: dataToSend.price }] } 
          : p
        );
        onUpdateProducts(updated);
      } else {
        const newProd = await addProductToServer(user, dataToSend);
        const productToAdd: Product = {
          ...newProd,
          id: newProd.product_id || `p-${Date.now()}`,
          sku: newProd.sku || 'N/A',
          minStock: 10,
          units: [{ name: dataToSend.baseUnit, price: dataToSend.price }]
        };
        onUpdateProducts([productToAdd, ...products]);
      }
      resetForm();
    } catch (error: any) {
      onNotify({ title: 'Lỗi', message: error.message, type: 'error' });
    }
  };

  if (!user) return null;

  return (
    <MainLayout title="Quản lý kho" user={user} logout={logout}>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Danh mục Sản phẩm</h2>
            <p className="text-slate-500">Quản lý kho hàng của riêng bạn.</p>
          </div>
          <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg font-bold">
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
                placeholder="Tìm kiếm sản phẩm..."
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
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-sm text-slate-900">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {p.units[0]?.price.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800">
                      {p.stockLevel} {p.baseUnit}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(p)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Không có dữ liệu hiển thị.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                <h4 className="font-bold flex items-center gap-2 text-lg">
                  <Box size={24} className="text-indigo-400" />
                  {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h4>
                <button onClick={resetForm} className="text-white/60 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên sản phẩm</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-indigo-600 font-bold outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh mục</label>
                      <input
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá bán</label>
                      <input
                        required type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-indigo-600 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tồn kho</label>
                      <input
                        type="number"
                        value={formData.stockLevel}
                        onChange={(e) => setFormData({...formData, stockLevel: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị</label>
                      <input
                        required
                        value={formData.baseUnit}
                        onChange={(e) => setFormData({...formData, baseUnit: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={resetForm} className="flex-1 px-4 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-500">Hủy</button>
                  <button type="submit" className="flex-[2] px-4 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2">
                    <Save size={20} /> {editingProduct ? 'Cập nhật' : 'Lưu'}
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