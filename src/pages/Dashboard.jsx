import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  LayoutDashboard, MessageSquare, BookOpen, Sparkles, Gift,
  ShoppingBag, Cpu, HelpCircle, Info, Mail, Shield,
  TrendingUp, Star, Baby, ArrowRight, Users
} from 'lucide-react'

const features = [
  { to: '/chat',         icon: MessageSquare, label: 'AI Chat',                    desc: 'Chat with AI about any book or topic',             color: 'from-blue-600 to-blue-800' },
  { to: '/books',        icon: BookOpen,      label: 'All Books',                  desc: 'Browse our entire collection by category',         color: 'from-indigo-600 to-indigo-800' },
  { to: '/new-releases', icon: Sparkles,      label: 'New Releases',               desc: 'Latest additions to our library',                  color: 'from-purple-600 to-purple-800' },
  { to: '/free-books',   icon: Gift,          label: 'Free Books',                 desc: 'Download books at no cost',                        color: 'from-emerald-600 to-emerald-800' },
  { to: '/store',        icon: ShoppingBag,   label: 'Book Store',                 desc: 'Purchase premium titles securely',                 color: 'from-amber-600 to-amber-800' },
  { to: '/analyzer',     icon: Cpu,           label: 'Analyzer & Summarizer',      desc: 'AI-powered book analysis and summaries',           color: 'from-rose-600 to-rose-800' },
  { to: '/ask-it-out',   icon: HelpCircle,    label: 'Ask It Out',                 desc: 'Upload a book page image and ask questions',       color: 'from-cyan-600 to-cyan-800' },
  { to: '/about',        icon: Info,          label: 'About Us',                   desc: 'Learn about Readrack',                             color: 'from-slate-600 to-slate-800' },
  { to: '/contact',      icon: Mail,          label: 'Contact Us',                 desc: 'Get in touch with our team',                       color: 'from-teal-600 to-teal-800' },
]

export default function Dashboard() {
  const { currentUser, userProfile, isAdmin, isKidsMode } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, free: 0, paid: 0, new: 0 })

  useEffect(() => {
    async function loadStats() {
      try {
        const snap = await getDocs(collection(db, 'books'))
        let free = 0, paid = 0, isNew = 0
        snap.forEach(d => {
          const b = d.data()
          if (b.isFree) free++; else paid++
          if (b.isNew)  isNew++
        })
        setStats({ total: snap.size, free, paid, new: isNew })
      } catch (_) {}
    }
    loadStats()
  }, [])

  const displayName = userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Reader'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative glass-card p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-indigo-900/30 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isKidsMode && <span className="badge badge-kids flex items-center gap-1"><Baby size={10} />Kids Mode</span>}
              {isAdmin    && <span className="badge badge-paid flex items-center gap-1"><Shield size={10} />Admin</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {greeting}, <span className="text-blue-400">{displayName}</span>! 📚
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
              {isKidsMode
                ? "Welcome to your kid-friendly reading adventure!"
                : "Your AI-powered reading universe awaits. What will you discover today?"}
            </p>
          </div>
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-glow-lg flex-shrink-0">
            <BookOpen size={44} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Books',   value: stats.total, icon: BookOpen,    color: 'text-blue-400'  },
          { label: 'Free Books',    value: stats.free,  icon: Gift,        color: 'text-emerald-400'},
          { label: 'Premium Books', value: stats.paid,  icon: ShoppingBag, color: 'text-amber-400' },
          { label: 'New Releases',  value: stats.new,   icon: Sparkles,    color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Explore Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <button
              key={f.to}
              onClick={() => navigate(f.to)}
              className="glass-card p-5 text-left group hover:border-blue-500/40 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3 group-hover:shadow-glow transition-all`}>
                <f.icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{f.label}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Go to {f.label} <ArrowRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Admin Banner */}
      {isAdmin && (
        <div className="glass-card p-5 border-amber-500/30 bg-amber-900/10">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-amber-400" />
            <div>
              <h3 className="font-semibold text-amber-300">Admin Panel Active</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                You have full admin access. Visit any page to add, edit, or manage books and settings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
