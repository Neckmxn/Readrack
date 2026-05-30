import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import { loadStripe } from '@stripe/stripe-js'
import BookCard from '../components/BookCard'
import CategoryFilter from '../components/CategoryFilter'
import AdminBookModal from '../components/AdminBookModal'
import { ShoppingBag, Plus, CreditCard, Lock, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function BookStore() {
  const { isAdmin, isKidsMode, currentUser } = useAuth()
  const [books, setBooks]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading]   = useState(true)
  const [buyingId, setBuyingId] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { loadBooks() }, [])
  useEffect(() => {
    let result = books
    if (isKidsMode) result = result.filter(b => b.isKidsContent)
    if (category !== 'All') result = result.filter(b => b.category === category)
    setFiltered(result)
  }, [books, category, isKidsMode])

  async function loadBooks() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'books'), orderBy('addedAt', 'desc')))
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(b => !b.isFree && b.price > 0))
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  async function handleBuy(book) {
    if (!currentUser) return toast.error('Please login first')
    setBuyingId(book.id)

    try {
      // Create a Stripe checkout session via your backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      if (!backendUrl) {
        toast('⚠️ Backend URL not configured. See setup instructions.', { duration: 5000 })
        setBuyingId(null)
        return
      }

      const resp = await fetch(`${backendUrl}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId:    book.id,
          bookTitle: book.title,
          price:     Math.round(book.price * 100), // cents
          userId:    currentUser.uid,
          userEmail: currentUser.email,
          successUrl: `${window.location.origin}/store?success=1&bookId=${book.id}`,
          cancelUrl:  `${window.location.origin}/store?cancel=1`
        })
      })

      if (!resp.ok) throw new Error('Failed to create checkout session')
      const { sessionId } = await resp.json()

      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) throw error

    } catch (err) {
      toast.error('Purchase failed: ' + err.message)
    } finally {
      setBuyingId(null)
    }
  }

  // Handle return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success')) {
      toast.success('🎉 Purchase successful! Your book is ready to download.')
      window.history.replaceState({}, '', '/store')
    }
    if (params.get('cancel')) {
      toast('Purchase cancelled.', { icon: '❌' })
      window.history.replaceState({}, '', '/store')
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-amber-400" size={26} /> Book Store
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Premium titles — {filtered.length} available</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add Book
          </button>
        )}
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: CreditCard, title: 'Secure Payments',   desc: 'Powered by Stripe',           color: 'text-blue-400'  },
          { icon: Lock,       title: 'Instant Download',  desc: 'PDF ready after purchase',     color: 'text-emerald-400' },
          { icon: Shield,     title: 'Safe & Encrypted',  desc: 'Your data is always protected', color: 'text-purple-400' },
        ].map(b => (
          <div key={b.title} className="glass-card p-4 flex items-center gap-3">
            <b.icon size={20} className={b.color} />
            <div>
              <p className="text-sm font-medium text-slate-200">{b.title}</p>
              <p className="text-xs text-slate-500">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <CategoryFilter selected={category} onSelect={setCategory} kids={isKidsMode} />

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ShoppingBag size={40} className="mx-auto text-amber-900/40 mb-3" />
          <p className="text-slate-400 font-medium">No paid books yet</p>
          <p className="text-slate-600 text-sm mt-1">{isAdmin ? 'Add a book with a price > $0.' : 'Check back soon!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(book => (
            <div key={book.id} className="relative">
              <BookCard
                book={{ ...book, ...(buyingId === book.id ? { title: '⏳ Processing...' } : {}) }}
                onBuy={handleBuy}
                showBuyButton
              />
            </div>
          ))}
        </div>
      )}

      {showModal && <AdminBookModal onClose={r => { setShowModal(false); if (r) loadBooks() }} />}
    </div>
  )
}