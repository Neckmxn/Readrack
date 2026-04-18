import React from 'react';
import { BookOpen, Sparkles, Shield, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <BookOpen className="h-20 w-20 text-blue-300 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">About Readrack</h1>
          <p className="text-xl text-blue-200">
            Your AI-Powered Book Reading & Store Platform
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-blue-100 leading-relaxed">
              Readrack is dedicated to revolutionizing the way people discover, read, and interact
              with books. We combine cutting-edge AI technology with a vast library of literature
              to create an unparalleled reading experience for book lovers of all ages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg shadow-lg p-6">
              <Sparkles className="h-12 w-12 text-purple-300 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Features</h3>
              <p className="text-purple-100">
                Our AI chat assistant, book analyzer, and summarizer help you understand and
                enjoy books like never before.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg shadow-lg p-6">
              <Shield className="h-12 w-12 text-green-300 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Safe for All Ages</h3>
              <p className="text-green-100">
                Our Kids Mode ensures age-appropriate content for younger readers, providing a
                safe reading environment.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg shadow-lg p-6">
              <BookOpen className="h-12 w-12 text-blue-300 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Vast Library</h3>
              <p className="text-blue-100">
                Access thousands of books across multiple genres, from classics to new releases,
                with both free and premium options.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-lg shadow-lg p-6">
              <Heart className="h-12 w-12 text-red-300 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Reader-Focused</h3>
              <p className="text-red-100">
                Built with readers in mind, featuring easy downloads, personalized recommendations,
                and intuitive navigation.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">What We Offer</h2>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>AI-powered chat assistant for book recommendations and questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Advanced book analyzer and summarizer tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Image-based Q&A for specific book page questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Categorized book collections across all genres</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Free books and premium book store with secure payments</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>PDF downloads for offline reading</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>Kids Mode for safe, age-appropriate content</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Reading Community</h2>
            <p className="text-blue-100 mb-6">
              Start your reading journey with Readrack today and discover a new way to experience
              literature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;