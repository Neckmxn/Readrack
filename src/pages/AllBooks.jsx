import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookService, bookCategories } from '../services/bookService';
import BookCard from '../components/BookCard';
import { Filter } from 'lucide-react';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { isKidsMode } = useAuth();

  useEffect(() => {
    loadBooks();
  }, [isKidsMode]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter((book) => book.category === selectedCategory));
    }
  }, [selectedCategory, books]);

  const loadBooks = async () => {
    setLoading(true);
    const allBooks = await bookService.getAllBooks(isKidsMode);
    setBooks(allBooks);
    setFilteredBooks(allBooks);
    setLoading(false);
  };

  const handleDownload = async (book) => {
    if (book.pdfURL) {
      window.open(book.pdfURL, '_blank');
    } else {
      alert('PDF not available for this book');
    }
  };

  const handlePurchase = (book) => {
    alert(`Purchase functionality for ${book.title} will be implemented with Stripe`);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">All Books</h1>

        {/* Category Filter */}
        <div className="mb-8 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-blue-300 mr-2" />
            <h2 className="text-xl font-bold text-white">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-md transition ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
              }`}
            >
              All
            </button>
            {bookCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center text-white text-xl">Loading books...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center text-blue-300 text-xl">
            No books found in this category. Admin needs to add books.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
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

export default AllBooks;