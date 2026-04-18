import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to a backend API
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-blue-200">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

            {submitted && (
              <div className="mb-6 bg-green-500 text-white p-4 rounded-md">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Subject of your message"
                />
              </div>

              <div>
                <label className="block text-blue-100 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 bg-blue-950 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-300 mt-1" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-blue-200">support@readrack.com</p>
                    <p className="text-blue-200">contact@readrack.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-300 mt-1" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Phone</h3>
                    <p className="text-blue-200">+1 (555) 123-4567</p>
                    <p className="text-blue-200">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-300 mt-1" />
                  <div>
                    <h3 className="text-white font-medium mb-1">Address</h3>
                    <p className="text-blue-200">123 Book Street</p>
                    <p className="text-blue-200">Reading City, RC 12345</p>
                    <p className="text-blue-200">United States</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-white mb-4">FAQ</h3>
              <div className="space-y-3 text-purple-100">
                <p className="font-medium">How do I download books?</p>
                <p className="text-sm text-purple-200 mb-4">
                  Click on any free book and use the download button to get the PDF.
                </p>

                <p className="font-medium">How does Kids Mode work?</p>
                <p className="text-sm text-purple-200 mb-4">
                  Users under 18 are automatically placed in Kids Mode with age-appropriate content.
                </p>

                <p className="font-medium">Can I request a book?</p>
                <p className="text-sm text-purple-200">
                  Yes! Contact us with your book request and we'll do our best to add it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;