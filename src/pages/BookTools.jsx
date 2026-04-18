import React, { useState } from 'react';
import { FileText, Sparkles, Upload } from 'lucide-react';
import { openrouterService } from '../services/openrouterService';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const BookTools = () => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResult('');
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }

    setLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      const analysis = await openrouterService.analyzeBook(text);
      setResult(analysis);
    } catch (error) {
      console.error('Error analyzing book:', error);
      setResult('Error analyzing book. Please try again.');
    }
    setLoading(false);
  };

  const handleSummarize = async () => {
    if (!file) {
      alert('Please upload a PDF file first');
      return;
    }

    setLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      const summary = await openrouterService.summarizeBook(text);
      setResult(summary);
    } catch (error) {
      console.error('Error summarizing book:', error);
      setResult('Error summarizing book. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Book Tools</h1>

        {/* Tab Selection */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md transition ${
              activeTab === 'analyzer'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Book Analyzer</span>
          </button>
          <button
            onClick={() => setActiveTab('summarizer')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md transition ${
              activeTab === 'summarizer'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>Book Summarizer</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-2xl p-8">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-white text-lg font-medium mb-4">
              Upload PDF Book
            </label>
            <div className="border-2 border-dashed border-blue-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary inline-block"
              >
                Choose PDF File
              </label>
              {file && (
                <p className="mt-4 text-blue-200">Selected: {file.name}</p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mb-6">
            {activeTab === 'analyzer' ? (
              <button
                onClick={handleAnalyze}
                disabled={loading || !file}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Book'}
              </button>
            ) : (
              <button
                onClick={handleSummarize}
                disabled={loading || !file}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Summarizing...' : 'Summarize Book'}
              </button>
            )}
          </div>

          {/* Result Display */}
          {result && (
            <div className="bg-blue-950 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {activeTab === 'analyzer' ? 'Analysis Result' : 'Summary Result'}
              </h3>
              <div className="text-blue-100 whitespace-pre-wrap">{result}</div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-950 rounded-lg">
            <h4 className="text-white font-bold mb-2">Instructions:</h4>
            <ul className="text-blue-200 text-sm space-y-1 list-disc list-inside">
              <li>Upload a PDF file of the book you want to analyze or summarize</li>
              <li>The tool will extract text from the first 10 pages</li>
              <li>Click the appropriate button to analyze or summarize</li>
              <li>Wait for the AI to process your request</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTools;