import React, { useState, useEffect } from 'react';
import { bookService, bookCategories } from '../services/bookService';
import { Plus, Edit2, Trash2, Upload, Save, X } from 'lucide-react';

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: bookCategories[0],
    description: '',
    price: 0,
    isFree: true,
    isKidsContent: false,
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllBooks();
  }, []);

  const loadAllBooks = async () => {
    const allBooks = await bookService.getAllBooks(false);
    const kidsBooks = await bookService.getAllBooks(true);
    setBooks([...allBooks, ...kidsBooks]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      category: bookCategories[0],
      description: '',
      price: 0,
      isFree: true,
      isKidsContent: false,
    });
    setPdfFile(null);
    setEditingBook(null);
    setShowAddModal(false);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert('Please upload a PDF file');
      return;
    }

    setLoading(true);
    try {
      await bookService.addBook(formData, pdfFile);
      alert('Book added successfully!');
      resetForm();
      loadAllBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    }
    setLoading(false);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author || '',
      category: book.category,
      description: book.description || '',
      price: book.price || 0,
      isFree: book.isFree,
      isKidsContent: book.isKidsContent || false,
    });
    setShowAddModal(true);
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookService.updateBook(editingBook.id, formData, pdfFile);
      alert('Book updated successfully!');
      resetForm();
      loadAllBooks();
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book');
    }
    setLoading(false);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(bookId);
        alert('Book deleted successfully!');
        loadAllBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition btn-primary"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Books Table */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-800 border-b border-blue-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-blue-800 transition">
                    <td className="px-6 py-4 text-white">{book.title}</td>
                    <td className="px-6 py-4 text-blue-200">{book.author || 'N/A'}</td>
                    <td className="px-6 py-4 text-blue-200">{book.category}</td>
                    <td className="px-6 py-4 text-blue-200">
                      {book.isFree ? 'Free' : `$${book.price}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${book.isKidsContent ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'}`}>
                        {book.isKidsContent ? 'Kids' : 'Adult'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBook(book)}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {books.length === 0 && (
              <div className="text-center py-12 text-blue-300">
                No books added yet. Click "Add New Book" to get started.
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Book Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 text-blue-300 hover:text-white transition"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={editingBook ? handleUpdateBook : handleAddBook} className="space-y-4">
                  <div>
                    <label className="block text-blue-100 text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-100 text-sm font-medium mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-100 text-sm font-medium mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {bookCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-blue-100 text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-blue-100">
                      <input
                        type="checkbox"
                        name="isFree"
                        checked={formData.isFree}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <span>Free Book</span>
                    </label>

                    <label className="flex items-center space-x-2 text-blue-100">
                      <input
                        type="checkbox"
                        name="isKidsContent"
                        checked={formData.isKidsContent}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <span>Kids Content</span>
                    </label>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <label className="block text-blue-100 text-sm font-medium mb-2">Price ($) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required={!formData.isFree}
                        className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-blue-100 text-sm font-medium mb-2">
                      Upload PDF * {editingBook && '(Optional for update)'}
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="pdf-file"
                      />
                      <label
                        htmlFor="pdf-file"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Choose PDF</span>
                      </label>
                      {pdfFile && <span className="text-blue-200">{pdfFile.name}</span>}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition btn-primary disabled:opacity-50"
                    >
                      <Save className="h-5 w-5" />
                      <span>{loading ? 'Saving...' : editingBook ? 'Update Book' : 'Add Book'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;