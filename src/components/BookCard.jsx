import React from 'react'
import { Download, ShoppingCart, BookOpen, Star, Eye } from 'lucide-react'
import { format } from 'date-fns'

export default function BookCard({ book, onBuy, onRead, showBuyButton = true }) {
  const isFree = book.isFree || book.price === 0

  return (
    <div className="glass-card book-card p-4 flex flex-col gap-3 relative overflow-hidden">
      {/* Cover */}
      <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/60 to-navy-950 flex items-center justify-center">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-blue-400/50">
            <BookOpen size={40} />
            <span className="text-xs">{book.category}</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {book.isNew && <span className="badge badge-new">New</span>}
          {isFree       && <span className="badge badge-free">Free</span>}
          {!isFree      && <span className="badge badge-paid">${book.price?.toFixed(2)}</span>}
          {book.isKidsContent && <span className="badge badge-kids">Kids</span>}
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">{book.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{book.author}</p>
        <span className="inline-block mt-1 text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full">
          {book.category}
        </span>
      </div>

      {/* Description */}
      {book.description && (
        <p className="text-xs text-slate-500 line-clamp-2">{book.description}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        {isFree ? (
          <>
            <a
              href={book.pdfUrl}
              download={`${book.title}.pdf`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex-1 text-xs flex items-center justify-center gap-1 py-2"
            >
              <Download size={13} /> Download
            </a>
            {onRead && (
              <button
                onClick={() => onRead(book)}
                className="btn-secondary text-xs flex items-center justify-center gap-1 px-3 py-2"
              >
                <Eye size={13} /> Read
              </button>
            )}
          </>
        ) : (
          <>
            {showBuyButton && onBuy && (
              <button
                onClick={() => onBuy(book)}
                className="btn-primary flex-1 text-xs flex items-center justify-center gap-1 py-2"
              >
                <ShoppingCart size={13} /> Buy ${book.price?.toFixed(2)}
              </button>
            )}
            {book.purchased && (
              <a
                href={book.pdfUrl}
                download={`${book.title}.pdf`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs flex items-center justify-center gap-1 px-3 py-2"
              >
                <Download size={13} />
              </a>
            )}
          </>
        )}
      </div>

      {book.addedAt && (
        <p className="text-xs text-slate-600 mt-1">
          Added {format(book.addedAt?.toDate ? book.addedAt.toDate() : new Date(book.addedAt), 'MMM d, yyyy')}
        </p>
      )}
    </div>
  )
}
