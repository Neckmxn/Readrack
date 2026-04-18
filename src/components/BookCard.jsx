import React from 'react';
import { Download, DollarSign, BookOpen } from 'lucide-react';

const BookCard = ({ book, onDownload, onPurchase, showPrice = true }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg overflow-hidden card-hover">
      <div className="h-48 bg-gradient-to-br from-blue-700 to-blue-600 flex items-center justify-center">
        <BookOpen className="h-20 w-20 text-blue-200" />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2 truncate">{book.title}</h3>
        <p className="text-blue-200 text-sm mb-2">{book.author || 'Unknown Author'}</p>
        <p className="text-blue-300 text-sm mb-3">
          <span className="bg-blue-700 px-2 py-1 rounded-full">{book.category}</span>
        </p>
        
        {book.description && (
          <p className="text-blue-100 text-sm mb-4 line-clamp-2">{book.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          {showPrice && (
            <div className="text-lg font-bold text-white">
              {book.isFree ? (
                <span className="text-green-400">Free</span>
              ) : (
                <span className="flex items-center">
                  <DollarSign className="h-5 w-5" />
                  {book.price}
                </span>
              )}
            </div>
          )}
          
          <div className="flex space-x-2">
            {book.isFree ? (
              <button
                onClick={() => onDownload(book)}
                className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition btn-primary"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            ) : (
              <button
                onClick={() => onPurchase(book)}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary"
              >
                <DollarSign className="h-4 w-4" />
                <span>Buy Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;