import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';

const NewReleases = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isKidsMode } = useAuth();

  useEffect(() => {
    loadBooks();
  }, [isKidsMode]);

  const loadBooks = async () => {
    setLoading(true);
    const newBooks = await bookService.getNewReleases(isKidsMode);
    setBooks(newBooks);
    setLoading(false);
  };

  const handleDownload = (book) => {
    if (book.pdfURL) {
      window.open(book.pdfURL, '_blank');
    }
  };

  const handlePurchase = (book) => {
    alert(`Purchase ${book.title} - Stripe integration pending`);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">New Releases</h1>
        <p className="text-blue-200 mb-8">Books added in the last 7 days</p>

        {loading ? (
          <div className="text-center text-white text-xl">Loading...</div>
        ) : books.length === 0 ? (
          <div className="text-center text-blue-300 text-xl">No new releases yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDownload={handleDownload}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReleases;