import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'
import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, orderBy, serverTimestamp, deleteDoc
} from 'firebase/firestore'
import { streamChatWithAI } from '../utils/openrouter'
import {
  MessageSquare, Send, Plus, Trash2, Bot, User,
  Clock, Loader, Sparkles, BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const SYSTEM_PROMPT = `You are Readrack AI, an expert literary assistant. You help users with:
- Book recommendations and summaries
- Author backgrounds and literary analysis
- Plot discussions and character analysis
- Genre exploration and reading lists
- Writing tips and book club discussions
Be warm, insightful, and enthusiastic about books!`

export default function AIChat() {
  const { currentUser, isKidsMode } = useAuth()
  const [sessions, setSessions]   = useState([])
  const [activeId, setActiveId]   = useState(null)
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const messagesEnd = useRef(null)
  const inputRef    = useRef(null)

  useEffect(() => { loadSessions() }, [])
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streamText])

  async function loadSessions() {
    const q    = query(collection(db, 'users', currentUser.uid, 'chatSessions'), orderBy('updatedAt', 'desc'))
    const snap = await getDocs(q)
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    setSessions(data)
    if (data.length > 0 && !activeId) openSession(data[0])
  }

  async function openSession(session) {
    setActiveId(session.id)
    setMessages(session.messages || [])
  }

  async function newSession() {
    const ref = await addDoc(collection(db, 'users', currentUser.uid, 'chatSessions'), {
      title:    'New Conversation',
      messages: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    const sess = { id: ref.id, title: 'New Conversation', messages: [] }
    setSessions(s => [sess, ...s])
    setActiveId(ref.id)
    setMessages([])
  }

  async function deleteSession(id, e) {
    e.stopPropagation()
    await deleteDoc(doc(db, 'users', currentUser.uid, 'chatSessions', id))
    setSessions(s => s.filter(x => x.id !== id))
    if (activeId === id) { setActiveId(null); setMessages([]) }
    toast.success('Conversation deleted')
  }

  async function sendMessage(e) {
    e?.preventDefault()
    if (!input.trim() || loading) return
    if (!activeId) { await newSession(); return }

    const userMsg = { role: 'user', content: input.trim(), ts: Date.now() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStreaming(true)
    setStreamText('')

    try {
      const apiMessages = [
        { role: 'system', content: isKidsMode ? SYSTEM_PROMPT + '\nKeep responses child-friendly and age-appropriate.' : SYSTEM_PROMPT },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ]

      let fullReply = ''
      await streamChatWithAI(apiMessages, (delta, full) => {
        fullReply = full
        setStreamText(full)
      })

      const aiMsg = { role: 'assistant', content: fullReply, ts: Date.now() }
      const finalMessages = [...newMessages, aiMsg]
      setMessages(finalMessages)
      setStreamText('')

      // Auto-title from first message
      const title = newMessages[0]?.content?.slice(0, 40) + (newMessages[0]?.content?.length > 40 ? '...' : '')
      await updateDoc(doc(db, 'users', currentUser.uid, 'chatSessions', activeId), {
        messages:  finalMessages,
        title,
        updatedAt: serverTimestamp()
      })
      setSessions(s => s.map(x => x.id === activeId ? { ...x, messages: finalMessages, title } : x))
    } catch (err) {
      toast.error('AI error: ' + err.message)
    } finally {
      setLoading(false)
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="h-[calc(100vh-80px)] flex gap-4 animate-fade-in">
      {/* Sidebar - History */}
      <div className="w-64 flex-shrink-0 glass-card flex flex-col overflow-hidden">
        <div className="p-3 border-b border-blue-900/30">
          <button onClick={newSession} className="btn-primary w-full text-sm flex items-center justify-center gap-2 py-2">
            <Plus size={15} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-slate-600 text-center mt-8">No conversations yet.<br />Start chatting!</p>
          )}
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => openSession(s)}
              className={`
                flex items-center gap-2 p-2.5 rounded-lg cursor-pointer group transition-all
                ${activeId === s.id ? 'bg-blue-900/40 border border-blue-700/40' : 'hover:bg-blue-900/20'}
              `}
            >
              <MessageSquare size={13} className={activeId === s.id ? 'text-blue-400' : 'text-slate-500'} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs truncate ${activeId === s.id ? 'text-slate-200' : 'text-slate-400'}`}>{s.title || 'New Conversation'}</p>
                {s.updatedAt?.toDate && (
                  <p className="text-xs text-slate-600">{format(s.updatedAt.toDate(), 'MMM d')}</p>
                )}
              </div>
              <button
                onClick={e => deleteSession(s.id, e)}
                className="opacity-0 group-hover:opacity-100 text-red-500/60 hover:text-red-400 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-blue-900/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 flex items-center justify-center">
            <Bot size={16} className="text-blue-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">Readrack AI</h2>
            <p className="text-xs text-slate-500">Your literary companion</p>
          </div>
          <div className="ml-auto">
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !streaming && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-900/30 flex items-center justify-center">
                <Sparkles size={32} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-300">Ask me anything about books!</h3>
                <p className="text-xs text-slate-500 mt-1">Book recommendations, summaries, analysis...</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {[
                  "Recommend a fantasy novel",
                  "Summarize 1984 by Orwell",
                  "Best books of 2024",
                  "Explain magical realism"
                ].map(s => (
                  <button key={s} onClick={() => { setInput(s); inputRef.current?.focus() }}
                    className="text-xs text-blue-400 border border-blue-900/50 rounded-full px-3 py-1 hover:bg-blue-900/30 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                  {msg.role === 'user' ? <User size={13} className="text-white" /> : <Bot size={13} className="text-blue-300" />}
                </div>
                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

          {streaming && streamText && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Bot size={13} className="text-blue-300" />
                </div>
                <div className="chat-bubble-ai">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{streamText}<span className="inline-block w-1 h-4 bg-blue-400 ml-0.5 animate-pulse" /></p>
                </div>
              </div>
            </div>
          )}

          {loading && !streaming && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai flex items-center gap-2">
                <Loader size={13} className="animate-spin text-blue-400" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-blue-900/30">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              className="input-field flex-1"
              placeholder="Ask about any book, author, or literary topic..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-4 flex items-center gap-1 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
