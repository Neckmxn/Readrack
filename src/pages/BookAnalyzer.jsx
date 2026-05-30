import React, { useState, useRef } from 'react'
import { extractTextFromPDF } from '../utils/pdfUtils'
import { chatWithAI } from '../utils/openrouter'
import { Cpu, Upload, FileText, Sparkles, Loader, Copy, RefreshCw, BookOpen, AlignLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = { ANALYZER: 'analyzer', SUMMARIZER: 'summarizer' }

export default function BookAnalyzer() {
  const [tab, setTab]             = useState(TABS.ANALYZER)
  const [file, setFile]           = useState(null)
  const [text, setText]           = useState('')
  const [result, setResult]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const fileRef = useRef()

  async function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    if (f.type !== 'application/pdf') return toast.error('Please upload a PDF file')
    setFile(f)
    setResult('')
    setExtracting(true)
    try {
      const extracted = await extractTextFromPDF(f)
      setText(extracted)
      toast.success('PDF processed successfully!')
    } catch (err) {
      toast.error('Failed to extract text: ' + err.message)
    } finally {
      setExtracting(false)
    }
  }

  async function handleAnalyze() {
    if (!text) return toast.error('Please upload a PDF first')
    setLoading(true)
    setResult('')
    try {
      const prompt = tab === TABS.ANALYZER
        ? `Perform a comprehensive literary analysis of the following book text. Cover:
           1. 📖 Main themes and motifs
           2. 🎭 Character analysis (major characters, their arcs, relationships)
           3. ✍️ Writing style and narrative techniques
           4. 🌍 Setting and world-building
           5. 💡 Key insights and literary significance
           6. ⭐ Overall assessment
           ${customPrompt ? `\nAdditional focus: ${customPrompt}` : ''}
           
           Book text:\n${text}`
        : `Create a comprehensive, well-structured summary of the following book text. Include:
           1. 📝 Brief overview (2-3 sentences)
           2. 🔑 Key plot points / main ideas
           3. 💬 Important quotes or passages
           4. 🎯 Core message or takeaway
           5. 📊 Chapter-by-chapter breakdown (if applicable)
           ${customPrompt ? `\nAdditional focus: ${customPrompt}` : ''}
           
           Book text:\n${text}`

      const response = await chatWithAI([
        { role: 'system', content: 'You are an expert literary analyst and book summarizer. Provide detailed, insightful, well-formatted responses using markdown.' },
        { role: 'user', content: prompt }
      ])
      setResult(response)
    } catch (err) {
      toast.error('Analysis failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result)
    toast.success('Copied to clipboard!')
  }

  function renderMarkdown(text) {
    // Simple markdown rendering
    return text
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-blue-300 mt-4 mb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-slate-200 mt-3 mb-1">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(/^(\d+\. .+)$/gm, '<div class="ml-2 text-slate-300">$1</div>')
      .replace(/^- (.+)$/gm, '<div class="flex gap-2 ml-2"><span class="text-blue-400 mt-1">•</span><span class="text-slate-300">$1</span></div>')
      .replace(/\n\n/g, '<br/><br/>')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu className="text-rose-400" size={26} /> Book Analyzer & Summarizer
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">Upload a PDF and let AI analyze or summarize it for you</p>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-navy-950/60 rounded-xl p-1 gap-1 w-fit">
        <button
          onClick={() => { setTab(TABS.ANALYZER); setResult('') }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${tab === TABS.ANALYZER ? 'bg-rose-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <BookOpen size={14} /> Analyzer
        </button>
        <button
          onClick={() => { setTab(TABS.SUMMARIZER); setResult('') }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${tab === TABS.SUMMARIZER ? 'bg-blue-600 text-white shadow-glow' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <AlignLeft size={14} /> Summarizer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-4">
          <div
            onClick={() => fileRef.current.click()}
            className={`
              glass-card p-8 text-center cursor-pointer transition-all duration-300
              border-2 border-dashed
              ${file ? 'border-green-500/40 bg-green-900/5' : 'border-blue-900/60 hover:border-blue-500/50 hover:bg-blue-900/10'}
            `}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            {extracting ? (
              <>
                <Loader size={36} className="mx-auto text-blue-400 mb-3 animate-spin" />
                <p className="text-slate-300 font-medium">Extracting text...</p>
              </>
            ) : file ? (
              <>
                <FileText size={36} className="mx-auto text-green-400 mb-3" />
                <p className="text-green-300 font-medium">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{Math.round(file.size / 1024)} KB • {text.length.toLocaleString()} chars extracted</p>
                <p className="text-xs text-blue-400 mt-3">Click to change file</p>
              </>
            ) : (
              <>
                <Upload size={36} className="mx-auto text-blue-400/60 mb-3" />
                <p className="text-slate-300 font-medium">Upload your PDF book</p>
                <p className="text-xs text-slate-500 mt-1">Supports up to ~300 pages</p>
              </>
            )}
          </div>

          {/* Custom prompt */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Additional Instructions (optional)
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder={tab === TABS.ANALYZER
                ? "e.g., Focus on the symbolism and feminist themes..."
                : "e.g., Keep it under 500 words, focus on the plot..."
              }
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !file || extracting}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <><Loader size={16} className="animate-spin" /> {tab === TABS.ANALYZER ? 'Analyzing...' : 'Summarizing...'}</>
            ) : (
              <><Sparkles size={16} /> {tab === TABS.ANALYZER ? 'Analyze Book' : 'Summarize Book'}</>
            )}
          </button>

          {/* What this does */}
          <div className="glass-card p-4 bg-slate-900/30">
            <h4 className="text-sm font-medium text-slate-300 mb-2">
              {tab === TABS.ANALYZER ? '🔍 Analyzer covers:' : '📝 Summarizer covers:'}
            </h4>
            <ul className="text-xs text-slate-500 space-y-1">
  {(
    tab === TABS.ANALYZER
      ? ['Themes & motifs', 'Character analysis', 'Writing style', 'Literary devices', 'Overall assessment']
      : ['Brief overview', 'Key plot points', 'Important quotes', 'Core message', 'Chapter breakdown']
  ).map(item => (
    <li key={item} className="flex items-center gap-2">
      <span className="text-blue-500">•</span>
      {item}
    </li>
  ))}
</ul>
          </div>
        </div>

        {/* Result Panel */}
        <div className="glass-card flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-blue-900/30">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles size={14} className={tab === TABS.ANALYZER ? 'text-rose-400' : 'text-blue-400'} />
              {tab === TABS.ANALYZER ? 'Analysis Result' : 'Summary Result'}
            </h3>
            {result && (
              <div className="flex gap-2">
                <button onClick={copyResult} className="btn-secondary text-xs py-1 px-2 flex items-center gap-1">
                  <Copy size={11} /> Copy
                </button>
                <button onClick={() => setResult('')} className="btn-secondary text-xs py-1 px-2 flex items-center gap-1">
                  <RefreshCw size={11} /> Clear
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader size={32} className="animate-spin text-blue-400" />
                <p className="text-slate-400 text-sm">AI is {tab === TABS.ANALYZER ? 'analyzing' : 'summarizing'} your book...</p>
              </div>
            ) : result ? (
              <div
                className="text-sm text-slate-300 leading-relaxed space-y-1"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tab === TABS.ANALYZER ? 'bg-rose-900/20' : 'bg-blue-900/20'}`}>
                  {tab === TABS.ANALYZER ? <BookOpen size={28} className="text-rose-400/50" /> : <AlignLeft size={28} className="text-blue-400/50" />}
                </div>
                <p className="text-slate-500 text-sm">Upload a PDF and click {tab === TABS.ANALYZER ? '"Analyze Book"' : '"Summarize Book"'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}