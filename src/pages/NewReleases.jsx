import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import BookCard from '../components/BookCard'
import CategoryFilter from '../components/CategoryFilter'
import AdminBookModal from '../components/AdminBookModal'
import { Sparkles, Plus, Pencil, Clock } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import toast from 'react-hot-toast'

export default function NewReleases() {
  const { isAdmin, isKidsMode } = useAuth()
  const [books, setBooks]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editBook, setEditBook]  = useState(null)

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
      const all  = snap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Auto-move books older than 7 days out of new releases
      const now = new Date()
      const promotions = []
      const newBooks = all.filter(b => {
        if (!b.isNew) return false
        const addedDate = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(b.addedAt)
        const days = differenceInDays(now, addedDate)
        if (days >= 7) {
          promotions.push(b.id)
          return false
        }
        return true
      })

      // Silently promote old "new" books
      for (const id of promotions) {
        await updateDoc(doc(db, 'books', id), { isNew: false })
      }

      setBooks(newBooks)
    } catch (e) { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  function getDaysLeft(book) {
    const addedDate = book.addedAt?.toDate ? book.addedAt.toDate() : new Date(book.addedAt)
    const days = differenceInDays(new Date(), addedDate)
    return Math.max(0, 7 - days)
  }

  function closeModal(refresh) {
    setShowModal(false)
    setEditBook(null)
    if (refresh) loadBooks()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-purple-400" size={26} /> New Releases
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Fresh titles added this week — {filtered.length} available
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add New Release
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="glass-card p-4 flex items-center gap-3 border-purple-500/20 bg-purple-900/5">
        <Clock size={18} className="text-purple-400 flex-shrink-0" />
        <p className="text-sm text-slate-300">
          Books stay in New Releases for <strong className="text-purple-300">7 days</strong>, then move to All Books automatically.
        </p>
      </div>

      <CategoryFilter selected={category} onSelect={setCategory} kids={isKidsMode} />

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Sparkles size={40} className="mx-auto text-purple-900/40 mb-3" />
          <p className="text-slate-400 font-medium">No new releases right now</p>
          <p className="text-slate-600 text-sm mt-1">{isAdmin ? 'Add a book with "New Release" enabled.' : 'Check back soon!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(book => (
            <div key={book.id} className="relative">
              <BookCard book={book} />
              {/* Days left badge */}
              <div className="absolute bottom-14 left-3 right-3">
                <div className="flex items-center gap-1 bg-purple-900/80 rounded-full px-2 py-1 text-xs text-purple-300">
                  <Clock size={10} />
                  {getDaysLeft(book)} day{getDaysLeft(book) !== 1 ? 's' : ''} left as new
                </div>
              </div>
              {isAdmin && (
                <button onClick={() => { setEditBook(book); setShowModal(true) }} className="absolute top-2 right-2 p-1.5 rounded-lg bg-blue-900/80 text-blue-300 hover:bg-blue-800 transition-colors">
                  <Pencil size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && <AdminBookModal onClose={closeModal} editBook={editBook} />}
    </div>
  )
}
