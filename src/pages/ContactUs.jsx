import React, { useState } from 'react'
import { Mail, MessageSquare, User, Send, MapPin, Phone, Clock, Loader, CheckCircle } from 'lucide-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const SUBJECTS = [
  'General Inquiry', 'Book Request', 'Technical Support',
  'Report an Issue', 'Partnership', 'Feedback', 'Other'
]

export default function ContactUs() {
  const { currentUser } = useAuth()
  const [form, setForm] = useState({
    name:    currentUser?.displayName || '',
    email:   currentUser?.email || '',
    subject: 'General Inquiry',
    message: ''
  })
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.message.trim()) return toast.error('Message required')
    setSending(true)
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        userId:    currentUser?.uid || null,
        createdAt: serverTimestamp(),
        status:    'unread'
      })
      setSent(true)
      toast.success('Message sent! We\'ll get back to you soon.')
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="text-teal-400" size={26} /> Contact Us
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">We'd love to hear from you. Send us a message!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info cards */}
        <div className="space-y-4">
          {[
            { icon: Mail,     title: 'Email',    value: 'support@readrack.app',   color: 'text-blue-400'  },
            { icon: Clock,    title: 'Response', value: 'Within 24 hours',         color: 'text-emerald-400' },
            { icon: MessageSquare, title: 'Live Chat', value: 'Use AI Chat page',  color: 'text-purple-400' },
          ].map(c => (
            <div key={c.title} className="glass-card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${c.color}`}>
                <c.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{c.title}</p>
                <p className="text-sm font-medium text-slate-200">{c.value}</p>
              </div>
            </div>
          ))}

          <div className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-3 text-sm">FAQ</h3>
            <div className="space-y-3">
              {[
                ['How do I download a free book?', 'Go to Free Books, find your book, and click Download.'],
                ['How does Kids Mode work?',       'Based on your date of birth, content is automatically filtered.'],
                ['Can I request a book?',          'Yes! Use the contact form with "Book Request" subject.'],
              ].map(([q, a]) => (
                <div key={q} className="text-xs">
                  <p className="font-medium text-slate-300">{q}</p>
                  <p className="text-slate-500 mt-0.5">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2 glass-card p-6">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle size={36} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Message Sent!</h3>
              <p className="text-slate-400 text-sm max-w-xs">
                Thank you for reaching out! We'll respond to your message within 24 hours.
              </p>
              <button onClick={() => { setSent(false); setForm(f => ({ ...f, message: '' })) }}
                className="btn-secondary text-sm">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-5">Send a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Your Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3 text-slate-500" />
                    <input className="input-field pl-9" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-slate-500" />
                    <input type="email" className="input-field pl-9" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Subject</label>
                <select className="input-field" value={form.subject} onChange={e => set('subject', e.target.value)}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Message</label>
                <textarea
                  className="input-field resize-none"
                  rows={6}
                  placeholder="Tell us what's on your mind..."
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2 py-3">
                {sending ? <><Loader size={15} className="animate-spin" /> Sending...</> : <><Send size={15} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
