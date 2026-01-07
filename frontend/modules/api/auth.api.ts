// modules/api/auth.api.ts
import { User } from '../../types' // Đảm bảo đường dẫn đúng

import {API_BASE_URL, ENDPOINTS} from "./api.config"
/**
 * Lấy thông tin người dùng hiện tại từ server bằng cách sử dụng Access Token
 * @param token Access Token đã lưu
 * @returns Promise<User>
 */
export async function fetchUserProfile(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Gửi token trong Header
    },
  })

  if (!response.ok) {
    // Nếu token hết hạn hoặc không hợp lệ, server sẽ trả về lỗi (ví dụ: 401 Unauthorized)
    throw new Error('Failed to fetch user profile or token expired')
  }

  const userData = await response.json()
  
  // Bạn cần ánh xạ dữ liệu nhận được từ server vào type User của frontend
  return {
    id: userData.user_id, // Giả sử server trả về user_id
    name: userData.username, 
    email: userData.email,
    role: userData.role_name, // Giả sử server trả về role_name
    // ... các trường khác
  } as User // Ép kiểu, đảm bảo cấu trúc khớp với type User
}