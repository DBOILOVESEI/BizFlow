'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User, UserRole } from '../types'
import { fetchUserProfile } from './api/auth.api' // <-- IMPORT API MỚI

// Loại bỏ hàm decodeUserFromToken không cần thiết

interface AuthContextType {
  user: User | null
  logout: () => void
}

export function useAuth(): AuthContextType {
  // expected backend return
  // return jsonify({
  //    "user_id": str(user.user_id),
  //    "username": user.username,
  //    "email": user.email,
  //    "role_name": role,
  //    "token": token, --> need
  // }), 200

  const [user, setUser] = useState<User | null>(null) 
  const router = useRouter()
  const pathname = usePathname()

  // logout
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    setUser(null)
    router.push('/login')
  }, [router])

  // check user info
  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    async function loadUser() {
      if (!token) {
        setUser(null)
        if (pathname !== '/login' && pathname !== '/signup') {
          router.push('/login')
        }
        return
      }

      try {
        // GỌI API LẤY USER PROFILE TỪ SERVER
        const userData = await fetchUserProfile(token) // cái này sẽ lưu vào, check script auth.api.ts function xem return cái gì nha

        setUser(userData)
      } catch (error) {
        console.error("Authentication check failed:", error)
        // Nếu API lỗi (token hết hạn/không hợp lệ), đăng xuất
        logout() 
      } finally {
      }
    }

    loadUser()
  }, [logout, router, pathname]) 

  // minimalist :v
  // trả nhiều banh server
  // dieeeeeeee
  return {
    user,
    logout,
  }
}