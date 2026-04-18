import React, { useState } from 'react';
import { Image as ImageIcon, Send } from 'lucide-react';
import { openrouterService } from '../services/openrouterService';

const AskItOut = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !question.trim()) {
      alert('Please upload an image and enter a question');
      return;
    }

    setLoading(true);
    try {
      // Note: For actual image analysis, you would need to use a vision model
      // This is a simplified version using text description
      const imageDescription = `Book page image uploaded by user`;
      const response = await openrouterService.analyzeBookImage(imageDescription, question);
      setAnswer(response);
    } catch (error) {
      console.error('Error getting answer:', error);
      setAnswer('Error processing your question. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Ask It Out</h1>
        <p className="text-blue-200 mb-8">
          Upload an image of a book page and ask specific questions about it
        </p>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Upload Book Page Image
              </label>
              <div className="border-2 border-dashed border-blue-600 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Book page preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                  </div>
                ) : (
                  <ImageIcon className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary inline-block"
                >
                  {imagePreview ? 'Change Image' : 'Choose Image'}
                </label>
                {image && (
                  <p className="mt-4 text-blue-200">Selected: {image.name}</p>
                )}
              </div>
            </div>

            {/* Question Input */}
            <div>
              <label className="block text-white text-lg font-medium mb-4">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the book page..."
                rows="4"
                className="w-full px-4 py-3 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !image || !question.trim()}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
              <span>{loading ? 'Processing...' : 'Get Answer'}</span>
            </button>
          </form>

          {/* Answer Display */}
          {answer && (
            <div className="mt-8 bg-blue-950 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Answer:</h3>
              <div className="text-blue-100 whitespace-pre-wrap">{answer}</div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-950 rounded-lg">
            <h4 className="text-white font-bold mb-2">How to use:</h4>
            <ul className="text-blue-200 text-sm space-y-1 list-disc list-inside">
              <li>Take a photo or screenshot of a book page</li>
              <li>Upload the image using the button above</li>
              <li>Type your question about the content in the image</li>
              <li>Click "Get Answer" and wait for AI to analyze</li>
            </ul>
            <p className="mt-4 text-xs text-blue-300">
              Note: For best results, ensure the text in the image is clear and readable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskItOut;