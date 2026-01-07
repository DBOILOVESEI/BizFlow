// modules/useAuth.tsx (Phiên bản mới)
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User, UserRole } from '../types'
import { fetchUserProfile } from './api/auth.api' // <-- IMPORT API MỚI

// Loại bỏ hàm decodeUserFromToken không cần thiết

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => void
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null) 
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // 1. Hàm Đăng xuất
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    setUser(null)
    router.push('/login')
  }, [router])

  // 2. Logic kiểm tra và tải thông tin người dùng
  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    async function loadUser() {
      if (!token) {
        setUser(null)
        setLoading(false)
        if (pathname !== '/login' && pathname !== '/signup') {
          router.push('/login')
        }
        return
      }

      try {
        // GỌI API LẤY USER PROFILE TỪ SERVER
        const userData = await fetchUserProfile(token) 
        setUser(userData)
      } catch (error) {
        console.error("Authentication check failed:", error)
        // Nếu API lỗi (token hết hạn/không hợp lệ), đăng xuất
        logout() 
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [logout, router, pathname]) 

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  }
}