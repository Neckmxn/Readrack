import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import BookCard from '../components/BookCard'
import CategoryFilter from '../components/CategoryFilter'
import AdminBookModal from '../components/AdminBookModal'
import { Gift, Plus, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FreeBooks() {
  const { isAdmin, isKidsMode } = useAuth()
  const [books, setBooks]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading]   = useState(true)
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
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(b => b.isFree))
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gift className="text-emerald-400" size={26} /> Free Books
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Download and read for free — {filtered.length} titles available</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add Free Book
          </button>
        )}
      </div>

      {/* Banner */}
      <div className="glass-card p-4 bg-emerald-900/10 border-emerald-500/20 flex items-center gap-3">
        <Download size={20} className="text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-slate-300">All books here are <strong className="text-emerald-300">completely free</strong> to download as PDF. No account charges.</p>
      </div>

      <CategoryFilter selected={category} onSelect={setCategory} kids={isKidsMode} />

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Gift size={40} className="mx-auto text-emerald-900/40 mb-3" />
          <p className="text-slate-400 font-medium">No free books yet</p>
          <p className="text-slate-600 text-sm mt-1">{isAdmin ? 'Add a book with "Free Book" enabled.' : 'Check back soon!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(book => <BookCard key={book.id} book={book} showBuyButton={false} />)}
        </div>
      )}

      {showModal && <AdminBookModal onClose={r => { setShowModal(false); if (r) loadBooks() }} />}
    </div>
  )
}
