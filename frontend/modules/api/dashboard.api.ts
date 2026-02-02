import { User, UserRole } from '../../types'
import { API_BASE_URL, ENDPOINTS } from '../../modules/api/api.config';

function getAuthHeader(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

export type DashboardOverview = {
  total_revenue: number;
  total_customers: number;
  total_debt: number;
  low_stock_products: number;
  weekly_revenue: {
    date: string;
    revenue: number;
  }[];
};

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const url = `${API_BASE_URL}${ENDPOINTS.DASHBOARD}`;
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeader(),
      // Quan trọng: Tắt cache để Dashboard luôn lấy số mới nhất từ DB
      cache: 'no-store', 
    });

    if (!res.ok) {
      // Xử lý lỗi 401, 403, 404, 500
      const errorBody = await res.json().catch(() => ({ message: "Lỗi không xác định từ Server" }));
      console.error(`Lỗi API (${res.status}):`, errorBody);
      throw new Error(errorBody.message || `Server trả về lỗi ${res.status}`);
    }

    const data = await res.json();
    
    // Kiểm tra sơ bộ tính toàn vẹn của dữ liệu
    if (!data || typeof data.total_revenue === 'undefined') {
      throw new Error("Dữ liệu trả về không đúng cấu trúc DashboardOverview");
    }

    return data;
  } catch (error) {
    console.error("Lỗi kết nối API Dashboard:", error);
    throw error; 
  }
};