// modules/api/auth.api.ts
import { User } from '../../types' // Đảm bảo đường dẫn đúng

import {API_BASE_URL, ENDPOINTS} from "./api.config"

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
  
  // expected backend return
  // return jsonify({
  //    "user_id": str(user.user_id),
  //    "username": user.username,
  //    "email": user.email,
  //    "role_name": role,
  //    "token": token, --> need
  // }), 200
  return {
    id: userData.user_id,
    name: userData.username, 
    email: userData.email,
    role: userData.role_name,
    token: userData.token,

  } as User // Ép kiểu, đảm bảo cấu trúc khớp với type User
}