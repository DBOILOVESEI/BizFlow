// components/Sidebar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  LogOut,
  Zap,
  UsersRound,
  ShieldAlert,
  X
} from 'lucide-react'
import { User, UserRole } from '../types' // Giả sử types vẫn ở vị trí cũ

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, label, onClick }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}

interface SidebarProps {
  user: User // Truyền thông tin user vào
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  logout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ user, sidebarOpen, setSidebarOpen, logout }) => {
  const isAdmin = user.role === UserRole.ADMIN
  const isOwner = user.role === UserRole.OWNER

  return (
    <aside
      className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-white transition-transform duration-300 z-50 flex flex-col`}
    >
      {/* ... Phần header và logo ... */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span>
            Biz<span className="text-indigo-400">Flow</span>
          </span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
          <X size={20} />
        </button>
      </div>

      {/* ... Phần Navigation ... */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {!isAdmin ? (
          <>
            {isOwner && (
              <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Tổng quan" onClick={() => setSidebarOpen(false)} />
            )}

            <SidebarLink href="/pos" icon={<ShoppingCart size={20} />} label="Bán hàng / POS" onClick={() => setSidebarOpen(false)} />

            {isOwner && (
              <>
                <SidebarLink href="/inventory" icon={<Package size={20} />} label="Kho hàng" onClick={() => setSidebarOpen(false)} />
                <SidebarLink href="/customers" icon={<Users size={20} />} label="Khách hàng" onClick={() => setSidebarOpen(false)} />
                <SidebarLink href="/staff" icon={<UsersRound size={20} />} label="Quản lý Nhân viên" onClick={() => setSidebarOpen(false)} />
                <SidebarLink href="/analytics" icon={<BarChart3 size={20} />} label="Báo cáo" onClick={() => setSidebarOpen(false)} />
              </>
            )}
          </>
        ) : (
          <SidebarLink href="/admin" icon={<ShieldAlert size={20} />} label="Quản trị Hệ thống" onClick={() => setSidebarOpen(false)} />
        )}
      </nav>

      {/* ... Phần User Profile và Logout ... */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">
              {user.role === UserRole.ADMIN ? 'Quản trị viên' : user.role === UserRole.OWNER ? 'Chủ tiệm' : 'Nhân viên'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}

export default Sidebar