import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, History } from 'lucide-react';
import { openrouterService } from '../services/openrouterService';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadChatHistory();
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, 'chatHistory'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const history = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatMessage = async (role, content) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'chatHistory'), {
        userId: currentUser.uid,
        role,
        content,
        timestamp: new Date(),
      });
      await loadChatHistory();
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const clearHistory = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, 'chatHistory'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((document) =>
        deleteDoc(doc(db, 'chatHistory', document.id))
      );
      await Promise.all(deletePromises);
      setChatHistory([]);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    await saveChatMessage('user', input);

    setInput('');
    setLoading(true);

    try {
      const response = await openrouterService.answerBookQuestion(input);
      const aiMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, aiMessage]);
      await saveChatMessage('assistant', response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-800 px-6 py-4 border-b border-blue-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">AI Chat Assistant</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition btn-primary"
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </button>
                <button
                  onClick={clearHistory}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition btn-primary"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-blue-900">
            {messages.length === 0 && !showHistory && (
              <div className="text-center text-blue-300 mt-20">
                <p className="text-xl mb-4">Ask me anything about books!</p>
                <p className="text-sm">
                  I can help you find book recommendations, answer questions about literature, and more.
                </p>
              </div>
            )}

            {showHistory ? (
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white mb-4">Chat History</h2>
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-700 ml-auto max-w-xs'
                        : 'bg-blue-800 mr-auto max-w-xs'
                    }`}
                  >
                    <p className="text-sm text-blue-200">{msg.role === 'user' ? 'You' : 'AI'}</p>
                    <p className="text-white">{msg.content}</p>
                    <p className="text-xs text-blue-300 mt-1">
                      {new Date(msg.timestamp?.toDate()).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-800 text-blue-100'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-blue-800 text-blue-100 px-4 py-3 rounded-lg">
                  <p className="animate-pulse">AI is thinking...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="bg-blue-800 px-6 py-4 border-t border-blue-700">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question about books..."
                className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;