import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';

const HISTORY_LENGTH = 8;

const buildHistory = (messages) => {
  return messages.filter(m => m.type === 'user' || m.type === 'assistant')
    .slice(-HISTORY_LENGTH)
    .map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }));
};

const ChatInterface = ({ fieldId, location }) => {
  const [messages, setMessages] = useState([
    { type: 'assistant', content: "Hello! I'm your irrigation assistant. How can I help you today?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const handleDecisionDetails = useCallback(async () => {
    setMessages(prev => [
      ...prev,
      { type: 'system', content: 'Fetching irrigation decision details...' }
    ]);
    setIsLoading(true);
    try {
      const history = buildHistory(messages);
      const result = await api.chat(null, fieldId || 'field_001', location || '', history, 'request_decision_details');
      if (result.error) {
        setMessages(prev => [...prev, { type: 'system', content: `Error: ${result.error}` }]);
      } else {
        setMessages(prev => [...prev, { type: 'assistant', content: result.recommendation }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { type: 'system', content: 'Failed to fetch decision details.' }]);
    }
    setIsLoading(false);
  }, [messages, fieldId, location]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const currentPageScroll = window.scrollY;
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        window.scrollTo({ top: currentPageScroll, behavior: 'instant' });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    const currentPageScroll = window.scrollY;

    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
      window.scrollTo({ top: currentPageScroll, behavior: 'instant' });
    }, 50);

    try {
      const history = buildHistory([...messages, { type: 'user', content: message }]);
      const result = await api.chat(message, fieldId, location, history);
      if (result.error) {
        setMessages(prev => [...prev, { type: 'system', content: `Error: ${result.error}` }]);
      } else {
        setMessages(prev => [...prev, { type: 'assistant', content: result.recommendation }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { type: 'system', content: 'Failed to get response. Please try again.' }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 font-cool">Chat with Irrigation Assistant</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
          style={{ scrollBehavior: 'smooth' }}
          onScroll={(e) => { e.stopPropagation(); }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] lg:max-w-[75%] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${
                  msg.type === 'user'
                    ? 'bg-purple-100 text-gray-900 border-2 border-purple-300 ml-auto shadow-md font-medium'
                    : msg.type === 'system'
                    ? 'bg-red-50 text-red-800 border-2 border-red-200'
                    : 'bg-purple-50 text-gray-900 border border-purple-200'
                }`}
              >
                <ReactMarkdown class="prose prose-sm max-w-none">
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-purple-50 text-gray-500 border border-purple-200 rounded-lg px-4 py-2 text-sm">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
            <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDecisionDetails();
              window.scrollTo({ top: window.scrollY, behavior: 'instant' });
            }}
            type="button"
            disabled={isLoading}
            className="w-full mb-2 sm:mb-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#7AD7B1] to-[#4CAB5B] text-gray-900 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all hover:from-[#6BC7A1] hover:to-[#3D9B4D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Irrigation Decision Details
          </button>
          <form 
            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); sendMessage(e); }} 
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onFocus={(e) => {
                e.stopPropagation();
                const currentScroll = window.scrollY;
                setTimeout(() => { window.scrollTo({ top: currentScroll, behavior: 'instant' }); }, 0);
              }}
              placeholder="Ask about irrigation..."
              disabled={isLoading}
              className="flex-1 p-2 sm:p-2.5 rounded-lg border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-[#A49FFF] focus:border-[#A49FFF] text-xs sm:text-sm bg-white text-gray-900 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#A49FFF] text-gray-900 font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-[#B8E6D8] hover:text-gray-900 transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;