import React, { useState, useEffect } from 'react'
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import BookCard from '../components/BookCard'
import CategoryFilter from '../components/CategoryFilter'
import AdminBookModal from '../components/AdminBookModal'
import { BookOpen, Plus, Pencil, Trash2, Search, Filter, Shield, Baby } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AllBooks() {
  const { isAdmin, isKidsMode } = useAuth()
  const [books, setBooks]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editBook, setEditBook]  = useState(null)
  const [ageFilter, setAgeFilter] = useState('all') // 'all' | 'kids' | 'adult'

  useEffect(() => { loadBooks() }, [])

  useEffect(() => {
    let result = books
    if (isKidsMode) result = result.filter(b => b.isKidsContent)
    else if (ageFilter === 'kids')  result = result.filter(b => b.isKidsContent)
    else if (ageFilter === 'adult') result = result.filter(b => !b.isKidsContent)

    if (category !== 'All') result = result.filter(b => b.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [books, category, search, ageFilter, isKidsMode])

  async function loadBooks() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'books'), orderBy('addedAt', 'desc')))
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) { toast.error('Failed to load books') }
    finally { setLoading(false) }
  }

  async function handleDelete(id, e) {
    e.stopPropagation()
    if (!window.confirm('Delete this book?')) return
    await deleteDoc(doc(db, 'books', id))
    setBooks(b => b.filter(x => x.id !== id))
    toast.success('Book deleted')
  }

  function openEdit(book) {
    setEditBook(book)
    setShowModal(true)
  }

  function closeModal(refresh) {
    setShowModal(false)
    setEditBook(null)
    if (refresh) loadBooks()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-blue-400" size={26} />
            {isKidsMode ? '📚 Kids Library' : 'All Books'}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{filtered.length} book{filtered.length !== 1 ? 's' : ''} available</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add Book
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              className="input-field pl-9"
              placeholder="Search books, authors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {!isKidsMode && (
            <div className="flex gap-2">
              {[
                { key: 'all',   label: 'All Ages' },
                { key: 'kids',  label: '👶 Kids'  },
                { key: 'adult', label: '18+'      },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setAgeFilter(f.key)}
                  className={`px-3 py-2 text-xs rounded-lg font-medium transition-all ${ageFilter === f.key ? 'bg-blue-600 text-white' : 'bg-blue-900/20 text-slate-400 hover:bg-blue-900/40'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <CategoryFilter selected={category} onSelect={setCategory} kids={isKidsMode} />
      </div>

      {/* Kids mode banner */}
      {isKidsMode && (
        <div className="glass-card p-4 flex items-center gap-3 border-sky-500/20">
          <Baby size={20} className="text-sky-400" />
          <div>
            <p className="text-sm font-medium text-sky-300">Kids Mode Active</p>
            <p className="text-xs text-slate-500">Showing only age-appropriate content</p>
          </div>
        </div>
      )}

      {/* Books Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <BookOpen size={40} className="mx-auto text-blue-900/60 mb-3" />
          <p className="text-slate-400 font-medium">No books found</p>
          <p className="text-slate-600 text-sm mt-1">
            {isAdmin ? 'Click "Add Book" to add your first book!' : 'Check back soon for new titles.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(book => (
            <div key={book.id} className="relative">
              <BookCard book={book} />
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => openEdit(book)} className="p-1.5 rounded-lg bg-blue-900/80 text-blue-300 hover:text-blue-100 hover:bg-blue-800 transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={e => handleDelete(book.id, e)} className="p-1.5 rounded-lg bg-red-900/80 text-red-300 hover:text-red-100 hover:bg-red-800 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && <AdminBookModal onClose={closeModal} editBook={editBook} />}
    </div>
  )
}
