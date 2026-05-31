import React, { useState, useRef } from 'react'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import { X, Upload, BookOpen, Loader } from 'lucide-react'
import { CATEGORIES, KIDS_CATEGORIES } from './CategoryFilter'
import toast from 'react-hot-toast'

const ALL_CATS = [...new Set([...CATEGORIES, ...KIDS_CATEGORIES])].filter(c => c !== 'All')

export default function AdminBookModal({ onClose, editBook = null }) {
  const [form, setForm] = useState({
    title:        editBook?.title || '',
    author:       editBook?.author || '',
    description:  editBook?.description || '',
    category:     editBook?.category || 'Story',
    price:        editBook?.price !== undefined ? editBook.price : 0,
    isFree:       editBook?.isFree ?? true,
    isKidsContent:editBook?.isKidsContent ?? false,
    isNew:        editBook?.isNew ?? true,
  })
  const [pdfFile,   setPdfFile]   = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [pdfProg,   setPdfProg]   = useState(0)
  const pdfRef   = useRef()
  const coverRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

async function uploadFile(file, onProgress) {
  const formData = new FormData()

  formData.append("file", file)
  formData.append("upload_preset", "readrack_upload")

  const xhr = new XMLHttpRequest()
  xhr.open(
    "POST",
    "https://api.cloudinary.com/v1_1/diuascilk/auto/upload"
  )

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable && onProgress) {
      const percent = Math.round((event.loaded / event.total) * 100)
      onProgress(percent)
    }
  }

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText)
      resolve(response.secure_url)
    }

    xhr.onerror = () => reject(new Error("Upload failed"))
    xhr.send(formData)
  })
}

  const data = await res.json()
  return data.secure_url
}

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title required')
    if (!editBook && !pdfFile) return toast.error('PDF file required')

    setUploading(true)
    try {
      let pdfUrl   = editBook?.pdfUrl   || ''
      let coverUrl = editBook?.coverUrl || ''

if (pdfFile) {
  pdfUrl = await uploadFile(pdfFile, setPdfProg)
}

if (coverFile) {
  coverUrl = await uploadFile(coverFile, () => {})
}

      const payload = {
        ...form,
        price:     form.isFree ? 0 : parseFloat(form.price) || 0,
        pdfUrl,
        coverUrl,
        updatedAt: serverTimestamp()
      }

      if (editBook) {
        await updateDoc(doc(db, 'books', editBook.id), payload)
        toast.success('Book updated!')
      } else {
        await addDoc(collection(db, 'books'), {
          ...payload,
          addedAt: serverTimestamp(),
          downloads: 0
        })
        toast.success('Book added!')
      }
      onClose(true)
    } catch (err) {
      console.error(err)
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={() => onClose(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen size={20} className="text-blue-400" />
          {editBook ? 'Edit Book' : 'Add New Book'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Book Title *</label>
            <input className="input-field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Enter book title" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Author</label>
            <input className="input-field" value={form.author} onChange={e => set('author', e.target.value)} placeholder="Author name" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Description</label>
            <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Category</label>
              <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                {ALL_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Price (USD)</label>
              <input type="number" min="0" step="0.01" className="input-field" value={form.price} onChange={e => set('price', e.target.value)} disabled={form.isFree} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set('isFree', !form.isFree)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.isFree ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFree ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-slate-300">Free Book</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set('isKidsContent', !form.isKidsContent)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.isKidsContent ? 'bg-sky-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isKidsContent ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-slate-300">Kids Content</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set('isNew', !form.isNew)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.isNew ? 'bg-green-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isNew ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-slate-300">New Release</span>
            </label>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">PDF File {editBook ? '(leave blank to keep current)' : '*'}</label>
            <div
              onClick={() => pdfRef.current.click()}
              className="border-2 border-dashed border-blue-900/60 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500/60 transition-colors"
            >
              <Upload size={20} className="mx-auto mb-1 text-blue-400" />
              <p className="text-xs text-slate-400">{pdfFile ? pdfFile.name : 'Click to upload PDF'}</p>
              {uploading && pdfProg > 0 && (
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pdfProg}%` }} />
                </div>
              )}
            </div>
            <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={e => setPdfFile(e.target.files[0])} />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Cover Image (optional)</label>
            <div
              onClick={() => coverRef.current.click()}
              className="border-2 border-dashed border-blue-900/60 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500/60 transition-colors"
            >
              <Upload size={20} className="mx-auto mb-1 text-blue-400" />
              <p className="text-xs text-slate-400">{coverFile ? coverFile.name : 'Click to upload cover image'}</p>
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files[0])} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => onClose(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={uploading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {uploading ? <><Loader size={14} className="animate-spin" /> Uploading...</> : (editBook ? 'Save Changes' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
