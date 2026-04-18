import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

export const openrouterService = {
  async chat(messages, model = 'openai/gpt-3.5-turbo') {
    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: model,
          messages: messages,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Readrack',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  },

  async analyzeBook(bookText) {
    const messages = [
      {
        role: 'system',
        content: 'You are a book analysis expert. Analyze the provided book text and provide insights about themes, characters, writing style, and overall quality.',
      },
      {
        role: 'user',
        content: `Please analyze the following book text:\n\n${bookText.substring(0, 10000)}`,
      },
    ];

    return await this.chat(messages);
  },

  async summarizeBook(bookText) {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert at summarizing books. Provide a comprehensive yet concise summary of the book.',
      },
      {
        role: 'user',
        content: `Please summarize the following book:\n\n${bookText.substring(0, 10000)}`,
      },
    ];

    return await this.chat(messages);
  },

  async answerBookQuestion(question, context = '') {
    const messages = [
      {
        role: 'system',
        content: 'You are a knowledgeable book assistant. Answer questions about books, literature, and reading.',
      },
      {
        role: 'user',
        content: context ? `Context: ${context}\n\nQuestion: ${question}` : question,
      },
    ];

    return await this.chat(messages);
  },

  async analyzeBookImage(imageDescription, question) {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert at analyzing book pages and answering questions about their content.',
      },
      {
        role: 'user',
        content: `I have a book page with the following content: ${imageDescription}\n\nQuestion: ${question}`,
      },
    ];

    return await this.chat(messages);
  },
};