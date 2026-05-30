import React, { useState, useRef } from 'react'
import { analyzeWithVision } from '../utils/openrouter'
import { fileToBase64 } from '../utils/pdfUtils'
import { HelpCircle, Upload, Send, Loader, Sparkles, ImageIcon, Copy, RefreshCw, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const QUICK_PROMPTS = [
  "What is the main idea of this page?",
  "Explain the difficult words or concepts here.",
  "Who are the characters mentioned on this page?",
  "What happens next in the story?",
  "Summarize this passage in simple words.",
  "What literary devices are used here?",
  "Translate the key terms on this page.",
  "Is there any hidden meaning in this text?"
]

export default function AskItOut() {
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer]   = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const fileRef = useRef()

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please upload an image file')
    const b64 = await fileToBase64(file)
    setImage(b64)
    const url = URL.createObjectURL(file)
    setPreview(url)
    setAnswer('')
    toast.success('Image loaded!')
  }

  async function handleAsk(e) {
    e?.preventDefault()
    if (!image)         return toast.error('Please upload a book page image first')
    if (!question.trim()) return toast.error('Please type your question')
    setLoading(true)
    setAnswer('')
    try {
      const prompt = `You are analyzing a page from a book. The user has a question about it.

Question: ${question}

Please provide a clear, insightful, and helpful answer based on what you see in the image. If the image contains text, analyze it carefully.`

      const response = await analyzeWithVision(image, prompt)
      setAnswer(response)
      setHistory(h => [{ question, answer: response, time: new Date().toLocaleTimeString() }, ...h.slice(0, 9)])
    } catch (err) {
      toast.error('Failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function renderAnswer(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-100">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="text-cyan-400" size={26} /> Ask It Out
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Upload a photo of any book page and ask specific questions — AI will answer instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Upload + Question */}
        <div className="lg:col-span-2 space-y-4">
          {/* Image upload */}
          <div
            onClick={() => fileRef.current.click()}
            className={`
              glass-card aspect-[3/4] max-h-72 flex flex-col items-center justify-center cursor-pointer
              border-2 border-dashed transition-all duration-300 overflow-hidden relative
              ${preview ? 'border-cyan-500/30 p-0' : 'border-blue-900/60 hover:border-cyan-500/50 p-6 hover:bg-cyan-900/5'}
            `}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            {preview ? (
              <>
                <img src={preview} alt="Book page" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm font-medium">Click to change</p>
                </div>
              </>
            ) : (
              <>
                <ImageIcon size={36} className="text-cyan-400/50 mb-3" />
                <p className="text-slate-300 font-medium text-sm text-center">Upload book page photo</p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP supported</p>
              </>
            )}
          </div>

          {/* Question input */}
          <form onSubmit={handleAsk} className="space-y-3">
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="What would you like to know about this page?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !image}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {loading ? <><Loader size={15} className="animate-spin" /> Analyzing...</> : <><Send size={15} /> Ask AI</>}
            </button>
          </form>

          {/* Quick prompts */}
          <div>
            <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => setQuestion(p)}
                  className="text-xs text-cyan-400/80 bg-cyan-900/20 border border-cyan-900/40 rounded-full px-2.5 py-1 hover:bg-cyan-900/40 hover:border-cyan-500/40 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Answer */}
        <div className="lg:col-span-3 space-y-4">
          {/* Current answer */}
          <div className="glass-card flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-blue-900/30">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400" /> AI Answer
              </h3>
              {answer && (
                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(answer); toast.success('Copied!') }}
                    className="btn-secondary text-xs py-1 px-2 flex items-center gap-1">
                    <Copy size={11} /> Copy
                  </button>
                  <button onClick={() => setAnswer('')} className="btn-secondary text-xs py-1 px-2 flex items-center gap-1">
                    <RefreshCw size={11} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 p-5 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Loader size={28} className="animate-spin text-cyan-400" />
                  <p className="text-slate-400 text-sm">Analyzing the page...</p>
                </div>
              ) : answer ? (
                <div className="text-sm text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderAnswer(answer) }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <HelpCircle size={36} className="text-cyan-900/40 mb-3" />
                  <p className="text-slate-500 text-sm">Upload a book page and ask a question</p>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="glass-card">
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-900/30">
                <h3 className="font-semibold text-slate-300 text-sm">Previous Questions</h3>
                <button onClick={() => setHistory([])} className="text-xs text-red-400 hover:text-red-300">
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                {history.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-blue-900/20 cursor-pointer hover:bg-blue-900/30 transition-colors"
                    onClick={() => { setQuestion(item.question); setAnswer(item.answer) }}>
                    <p className="text-xs font-medium text-slate-300 truncate">Q: {item.question}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">A: {item.answer.slice(0, 80)}...</p>
                    <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
