// components/MainLayout.tsx
'use client'

import React, { useState } from 'react'
import Sidebar from './Sidebar' // Import Sidebar
import { Menu, Bell } from 'lucide-react'
import { useAuth } from '../modules/useAuth'
import { User } from "../types"

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  // THÊM PROP user VÀO ĐÂY
  user: User | null; // Cần thay thế User bằng type thực tế
  logout: () => void; // Thêm logout để truyền xuống Sidebar
}

// pass hết vô đây
// mấy trang kia mà load thì cứ pass user= logout=
// vầy nè
// <MainLayout title="Bán hàng/POS" user={user} logout={logout}>
// nhớ gọi useAuth trên đầu func ko là die

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, user, logout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    return null 
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logout={logout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 lg:block hidden">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* TODO: Thay thế bằng NotificationsCenter thực tế */}
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>
      
      {/* Overlay cho mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default MainLayout