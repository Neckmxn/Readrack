import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard, MessageSquare, BookOpen, Sparkles,
  Gift, ShoppingBag, Cpu, HelpCircle, Info, Mail,
  LogOut, Shield, ChevronLeft, ChevronRight, Baby, User
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/chat',        icon: MessageSquare,   label: 'AI Chat'        },
  { to: '/books',       icon: BookOpen,        label: 'All Books'      },
  { to: '/new-releases',icon: Sparkles,        label: 'New Releases'   },
  { to: '/free-books',  icon: Gift,            label: 'Free Books'     },
  { to: '/store',       icon: ShoppingBag,     label: 'Book Store'     },
  { to: '/analyzer',   icon: Cpu,             label: 'Analyzer & Summarizer' },
  { to: '/ask-it-out',  icon: HelpCircle,      label: 'Ask It Out'     },
  { to: '/about',       icon: Info,            label: 'About Us'       },
  { to: '/contact',     icon: Mail,            label: 'Contact Us'     },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { currentUser, userProfile, isAdmin, isKidsMode, setIsKidsMode, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        bg-gradient-to-b from-[#060c22] via-[#0a1530] to-[#060c22]
        border-r border-blue-900/30
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-5 border-b border-blue-900/30">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center flex-shrink-0 shadow-glow">
          <BookOpen size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="ml-3 text-xl font-bold text-white tracking-wide">
            Read<span className="text-blue-400">rack</span>
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-lg hover:bg-blue-900/30 text-blue-400 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User info */}
      <div className={`px-3 py-3 border-b border-blue-900/20 ${collapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? '' : 'px-1'}`}>
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="avatar" className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-blue-500/40" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-700/50 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-blue-300" />
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{userProfile?.displayName || currentUser?.displayName || 'Reader'}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
            </div>
          )}
        </div>
        {/* Badges */}
        {!collapsed && (
          <div className="flex gap-1.5 mt-2 flex-wrap px-1">
            {isAdmin && <span className="badge badge-paid"><Shield size={9} className="inline mr-1" />Admin</span>}
            {isKidsMode && <span className="badge badge-kids"><Baby size={9} className="inline mr-1" />Kids</span>}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-2 py-3 border-t border-blue-900/30 space-y-1">
        {/* Kids toggle */}
        <button
          onClick={() => setIsKidsMode(v => !v)}
          className={`nav-link w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? (isKidsMode ? 'Adult Mode' : 'Kids Mode') : undefined}
        >
          <Baby size={18} className="flex-shrink-0 text-sky-400" />
          {!collapsed && <span className="text-sm">{isKidsMode ? 'Switch to Adult' : 'Kids Mode'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`nav-link w-full text-red-400 hover:bg-red-900/20 hover:text-red-300 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
