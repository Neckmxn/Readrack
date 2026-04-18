import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen,
  MessageSquare,
  Library,
  Sparkles,
  Gift,
  ShoppingCart,
  FileText,
  Image,
  Info,
  Mail,
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser, isKidsMode } = useAuth();

  const features = [
    {
      name: 'AI Chat',
      description: 'Chat with AI about books and get recommendations',
      icon: MessageSquare,
      path: '/ai-chat',
      color: 'from-purple-600 to-purple-800',
    },
    {
      name: 'All Books',
      description: 'Browse our complete collection',
      icon: Library,
      path: '/all-books',
      color: 'from-blue-600 to-blue-800',
    },
    {
      name: 'New Releases',
      description: 'Check out the latest additions',
      icon: Sparkles,
      path: '/new-releases',
      color: 'from-green-600 to-green-800',
    },
    {
      name: 'Free Books',
      description: 'Download free books',
      icon: Gift,
      path: '/free-books',
      color: 'from-yellow-600 to-yellow-800',
    },
    {
      name: 'Book Store',
      description: 'Purchase premium books',
      icon: ShoppingCart,
      path: '/book-store',
      color: 'from-red-600 to-red-800',
    },
    {
      name: 'Book Tools',
      description: 'Analyze and summarize books',
      icon: FileText,
      path: '/book-tools',
      color: 'from-indigo-600 to-indigo-800',
    },
    {
      name: 'Ask It Out',
      description: 'Upload book images and ask questions',
      icon: Image,
      path: '/ask-it-out',
      color: 'from-pink-600 to-pink-800',
    },
    {
      name: 'About Us',
      description: 'Learn more about Readrack',
      icon: Info,
      path: '/about',
      color: 'from-teal-600 to-teal-800',
    },
    {
      name: 'Contact Us',
      description: 'Get in touch with us',
      icon: Mail,
      path: '/contact',
      color: 'from-orange-600 to-orange-800',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <BookOpen className="mx-auto h-20 w-20 text-blue-300 mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">Readrack</h1>
          <p className="text-2xl text-blue-200">
            Your AI-Powered Book Reading Platform
          </p>
          {currentUser && (
            <p className="mt-4 text-blue-300">
              Welcome back, {currentUser.email}!
              {isKidsMode && (
                <span className="ml-2 px-3 py-1 bg-yellow-500 text-black text-sm font-semibold rounded-full">
                  Kids Mode Active
                </span>
              )}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="group"
            >
              <div className={`bg-gradient-to-br ${feature.color} rounded-lg shadow-lg p-6 card-hover h-full`}>
                <feature.icon className="h-12 w-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-2">{feature.name}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-4xl font-bold text-white mb-2">1000+</h3>
            <p className="text-blue-200">Books Available</p>
          </div>
          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-4xl font-bold text-white mb-2">500+</h3>
            <p className="text-blue-200">Free Books</p>
          </div>
          <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-4xl font-bold text-white mb-2">AI-Powered</h3>
            <p className="text-blue-200">Smart Features</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose Readrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-100">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">AI-Powered Chat</h3>
              <p>Get personalized book recommendations and answers to your questions about any book.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Book Analysis</h3>
              <p>Analyze and summarize books with advanced AI tools to understand them better.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Kids Mode</h3>
              <p>Safe and age-appropriate content for younger readers under 18.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Easy Downloads</h3>
              <p>Download your favorite books in PDF format and read offline anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;