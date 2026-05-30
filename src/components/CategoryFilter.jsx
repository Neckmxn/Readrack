import React from 'react'

export const CATEGORIES = [
  'All', 'Story', 'Fantasy', 'Science Fiction', 'Novels', 'Poetry',
  'Mystery/Thriller', 'Historical Fiction', 'Romance', 'Horror',
  'Literary Fiction', 'Non-Fiction'
]

export const KIDS_CATEGORIES = [
  'All', 'Story', 'Fantasy', 'Poetry', 'Adventure', 'Animals', 'Humor', 'Educational'
]

export default function CategoryFilter({ selected, onSelect, kids = false }) {
  const cats = kids ? KIDS_CATEGORIES : CATEGORIES

  return (
    <div className="flex flex-wrap gap-2">
      {cats.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`
            px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
            ${selected === cat
              ? 'bg-blue-600 text-white shadow-glow'
              : 'bg-blue-900/30 text-slate-400 border border-blue-900/50 hover:border-blue-500/50 hover:text-blue-300 hover:bg-blue-900/50'
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
