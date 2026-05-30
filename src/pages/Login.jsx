import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Mail, Lock, Eye, EyeOff, Phone, User, Calendar, Loader, Chrome } from 'lucide-react'
import toast from 'react-hot-toast'

const TAB = { LOGIN: 'login', REGISTER: 'register', PHONE: 'phone' }

export default function Login() {
  const [tab, setTab]             = useState(TAB.LOGIN)
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [name, setName]           = useState('')
  const [dob, setDob]             = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [phone, setPhone]         = useState('')
  const [otp, setOtp]             = useState('')
  const [otpSent, setOtpSent]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const { currentUser, loginWithGoogle, loginWithFacebook, loginWithEmail, registerWithEmail, setupRecaptcha, sendPhoneOtp, verifyPhoneOtp } = useAuth()
  const navigate = useNavigate()
  const recaptchaDiv = useRef()

  useEffect(() => { if (currentUser) navigate('/') }, [currentUser])

  useEffect(() => {
    if (tab === TAB.PHONE) {
      setTimeout(() => setupRecaptcha('recaptcha-container'), 300)
    }
  }, [tab])

  async function handleGoogle() {
    setLoading(true)
    try { await loginWithGoogle(); navigate('/') }
    catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  async function handleFacebook() {
    setLoading(true)
    try { await loginWithFacebook(); navigate('/') }
    catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  async function handleEmailLogin(e) {
    e.preventDefault()
    setLoading(true)
    try { await loginWithEmail(email, password); navigate('/') }
    catch (e) { toast.error('Invalid email or password') }
    finally { setLoading(false) }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!dob) return toast.error('Date of birth required')
    setLoading(true)
    try { await registerWithEmail(email, password, name, dob); navigate('/') }
    catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  async function handleSendOtp() {
    if (!phone) return toast.error('Enter phone number')
    setLoading(true)
    try { await sendPhoneOtp(phone); setOtpSent(true); toast.success('OTP sent!') }
    catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  async function handleVerifyOtp() {
    setLoading(true)
    try { await verifyPhoneOtp(otp); navigate('/') }
    catch (e) { toast.error('Invalid OTP') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center mx-auto mb-4 shadow-glow-lg">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Read<span className="text-blue-400">rack</span></h1>
          <p className="text-slate-400 text-sm mt-1">Read. Discover. Explore.</p>
        </div>

        <div className="glass-card p-6">
          {/* Tab switcher */}
          <div className="flex bg-navy-950/60 rounded-xl p-1 mb-6 gap-1">
            {[
              { key: TAB.LOGIN,    label: 'Sign In' },
              { key: TAB.REGISTER, label: 'Register' },
              { key: TAB.PHONE,    label: '📱 Phone' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${tab === t.key ? 'bg-blue-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Social logins */}
          {tab !== TAB.PHONE && (
            <div className="space-y-2 mb-5">
              <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/40 transition-all text-sm font-medium text-slate-200">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
              <button onClick={handleFacebook} disabled={loading} className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-blue-800/20 border border-blue-800/30 hover:bg-blue-800/30 hover:border-blue-500/40 transition-all text-sm font-medium text-slate-200">
                <span className="text-blue-400 font-bold text-base">f</span>
                Continue with Facebook
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-blue-900/40" />
                <span className="text-xs text-slate-600">or</span>
                <div className="flex-1 h-px bg-blue-900/40" />
              </div>
            </div>
          )}

          {/* Email Login */}
          {tab === TAB.LOGIN && (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-slate-500" />
                <input type="email" className="input-field pl-9" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
                <input type={showPwd ? 'text' : 'password'} className="input-field pl-9 pr-9" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader size={15} className="animate-spin" /> : null} Sign In
              </button>
            </form>
          )}

          {/* Register */}
          {tab === TAB.REGISTER && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="relative">
                <User size={15} className="absolute left-3 top-3 text-slate-500" />
                <input type="text" className="input-field pl-9" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-slate-500" />
                <input type="email" className="input-field pl-9" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
                <input type={showPwd ? 'text' : 'password'} className="input-field pl-9 pr-9" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-3 text-slate-500" />
                <input type="date" className="input-field pl-9" value={dob} onChange={e => setDob(e.target.value)} required max={new Date().toISOString().split('T')[0]} />
              </div>
              <p className="text-xs text-slate-500">📌 Date of birth determines content access (under 18 = Kids Mode)</p>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader size={15} className="animate-spin" /> : null} Create Account
              </button>
            </form>
          )}

          {/* Phone */}
          {tab === TAB.PHONE && (
            <div className="space-y-3">
              <div id="recaptcha-container" />
              {!otpSent ? (
                <>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-3 text-slate-500" />
                    <input type="tel" className="input-field pl-9" placeholder="+1 234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <button onClick={handleSendOtp} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <Loader size={15} className="animate-spin" /> : null} Send OTP
                  </button>
                </>
              ) : (
                <>
                  <input className="input-field text-center text-lg tracking-widest" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
                  <button onClick={handleVerifyOtp} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <Loader size={15} className="animate-spin" /> : null} Verify OTP
                  </button>
                  <button onClick={() => setOtpSent(false)} className="btn-secondary w-full text-sm">Resend OTP</button>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          By signing in you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
