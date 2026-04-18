import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookService, bookCategories } from '../services/bookService';
import BookCard from '../components/BookCard';
import { Filter } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookStore = () => {
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
    const paidBooks = await bookService.getPaidBooks(isKidsMode);
    setBooks(paidBooks);
    setFilteredBooks(paidBooks);
    setLoading(false);
  };

  const handlePurchase = async (book) => {
    // Stripe integration would go here
    // For now, showing alert
    alert(`Stripe Checkout for ${book.title} ($${book.price}) - Integration required`);
    
    // Example Stripe checkout flow:
    /*
    const stripe = await stripePromise;
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: book.id }),
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
    */
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Book Store</h1>

        <div className="mb-8 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-blue-300 mr-2" />
            <h2 className="text-xl font-bold text-white">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-md transition ${
                selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-blue-700 text-blue-200'
              }`}
            >
              All
            </button>
            {bookCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md transition ${
                  selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-blue-700 text-blue-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl">Loading...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center text-blue-300 text-xl">No paid books available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onPurchase={handlePurchase} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookStore;