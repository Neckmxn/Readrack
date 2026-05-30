import React from 'react'
import { BookOpen, Cpu, Sparkles, Shield, Heart, Globe, Users, Star } from 'lucide-react'

const team = [
  { name: 'The Readrack Team', role: 'Creators & Curators', avatar: '📚' },
]

const values = [
  { icon: BookOpen, title: 'Knowledge for All',    desc: 'We believe every person deserves access to great books and literature.',        color: 'from-blue-600 to-blue-800' },
  { icon: Cpu,      title: 'AI-Powered Learning',  desc: 'We leverage cutting-edge AI to make reading more engaging and insightful.',     color: 'from-purple-600 to-purple-800' },
  { icon: Shield,   title: 'Safe Environment',     desc: 'Age-appropriate content filters ensure every reader has a safe experience.',    color: 'from-emerald-600 to-emerald-800' },
  { icon: Heart,    title: 'Community First',      desc: 'We build features based on what readers love, need, and dream about.',         color: 'from-rose-600 to-rose-800' },
  { icon: Globe,    title: 'Global Reach',         desc: 'Connecting readers and books across languages, cultures, and borders.',         color: 'from-amber-600 to-amber-800' },
  { icon: Star,     title: 'Quality Curation',     desc: 'Every book in our catalog is reviewed and categorized for the best experience.',color: 'from-cyan-600 to-cyan-800' },
]

export default function AboutUs() {
  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
      {/* Hero */}
      <div className="glass-card p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-indigo-900/20 pointer-events-none" />
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center mx-auto mb-6 shadow-glow-lg">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            About <span className="text-blue-400">Readrack</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Readrack is an AI-powered book reading platform and online bookstore designed to make
            reading more accessible, engaging, and intelligent for everyone.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-400" /> Our Mission
        </h2>
        <p className="text-slate-300 leading-relaxed">
          We founded Readrack with a simple but powerful idea: <strong className="text-white">books should be for everyone</strong>.
          By combining a vast digital library with advanced AI tools — including an AI chatbot, book analyzer,
          summarizer, and visual Q&A — we transform the way you discover, read, and understand books.
        </p>
        <p className="text-slate-300 leading-relaxed mt-4">
          Whether you're a student doing research, a casual reader looking for your next great story,
          or a parent finding age-appropriate content for your child, Readrack has something for you.
          Our Kids Mode ensures younger readers enjoy a safe, curated experience, while our full library
          serves every genre and interest.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '∞',    label: 'Books Growing',   icon: '📚' },
          { value: 'AI',   label: 'Powered Tools',   icon: '🤖' },
          { value: '10+',  label: 'Categories',      icon: '🗂️' },
          { value: '100%', label: 'Secure & Private', icon: '🔒' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-blue-400">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Heart size={20} className="text-rose-400" /> Our Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map(v => (
            <div key={v.title} className="glass-card p-5 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center flex-shrink-0`}>
                <v.icon size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{v.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features overview */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <Cpu size={20} className="text-purple-400" /> What Makes Us Different
        </h2>
        <div className="space-y-3">
          {[
            ['🤖 AI Chat',            'Ask our AI anything about books, authors, genres, or literary concepts.'],
            ['🔍 Book Analyzer',       'Upload any PDF and get a comprehensive literary analysis powered by AI.'],
            ['📝 Book Summarizer',     'Get detailed summaries of any book in seconds.'],
            ['🖼️ Ask It Out',          'Photograph a book page and ask specific questions about it.'],
            ['🛒 Secure Store',        'Purchase premium titles with Stripe\'s secure payment infrastructure.'],
            ['🎁 Free Library',        'Access a growing collection of completely free books to download.'],
            ['👶 Kids Mode',           'Age-appropriate content automatically filtered for younger readers.'],
            ['📱 Multi-Platform Auth', 'Sign in with Google, Facebook, phone number, or email/password.'],
          ].map(([title, desc]) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-900/20 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
