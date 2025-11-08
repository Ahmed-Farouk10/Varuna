import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

const HISTORY_LENGTH = 8;

const buildHistory = (messages) => {
  // Convert app messages to an OpenAI-like role format for backend context awareness
  return messages.filter(m => m.type === 'user' || m.type === 'assistant')
    .slice(-HISTORY_LENGTH)
    .map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }));
};

const ChatInterface = ({ fieldId, location }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleDecisionDetails = useCallback(() => {
    if (!socket) {
      console.error('Socket not connected');
      return;
    }
    setMessages(prev => [
      ...prev,
      { type: 'system', content: 'Fetching irrigation decision details...' }
    ]);
    const history = buildHistory(messages);
    socket.emit('message', {
      action: 'request_decision_details',
      field_id: fieldId || 'field_001',
      location: location || '',
      history
    });
  }, [socket, messages, fieldId, location]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnecting(false);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "Hello! I'm your irrigation assistant. How can I help you today?"
      }]);
    });

    newSocket.on('response', (message) => {
      if (typeof message === 'object') {
        if (message.error) {
          setMessages(prev => [...prev, {
            type: 'system',
            content: `Error: ${message.error}${message.message ? ' - ' + message.message : ''}`
          }]);
        } else if ('recommendation' in message && (!message.weather_data || !message.crop_data)) {
          // Friendly bot reply or short answer
          setMessages(prev => [...prev, {
            type: 'assistant',
            content: message.recommendation
          }]);
        } else if ('recommendation' in message) {
          // Recommendation + details
          setMessages(prev => [...prev, {
            type: 'assistant',
            content:
              `${message.using_mock ? '**Warning**: Using mock data due to database issues.\n\n' : ''}` +
              `**Recommendation**:\n${message.recommendation || 'No recommendation provided'}\n\n` +
              `**Field Details**:\n` +
              `- Field ID: ${message.field_id}\n` +
              `- Location: ${message.location}\n` +
              `- Weather: ${message.weather_data.current.condition}, ${message.weather_data.current.temp_c}°C, ${message.weather_data.current.humidity}% humidity\n` +
              `- Soil Moisture: ${message.soil_data.moisture}% (pH: ${message.soil_data.ph}, Temp: ${message.soil_data.temperature}°C)\n` +
              `- Crop: ${message.crop_data.crop_type} (${message.crop_data.growth_stage}, ${message.crop_data.health_status})\n` +
              `- Water Requirement: ${message.water_requirement.water_requirement} units\n` +
              `- Irrigation Decision: ${message.irrigation_decision.should_irrigate ? `Irrigate for ${message.irrigation_decision.duration_minutes} minutes` : 'No irrigation needed'}`
          }]);
        } else {
          // Unknown object - fallback
          setMessages(prev => [...prev, {
            type: 'system',
            content: `Unknown response from server.`
          }]);
        }
      } else {
        setMessages(prev => [...prev, { type: 'assistant', content: message.toString() }]);
      }
    });

    newSocket.on('connect_error', () => {
      setIsConnecting(false);
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'Failed to connect to the server. Please try again later.'
      }]);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive - only scroll within chat container
    if (chatContainerRef.current) {
      const currentPageScroll = window.scrollY;
      setTimeout(() => {
        // Scroll only the chat container, not the page
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
        // Restore page scroll position immediately
        window.scrollTo({ top: currentPageScroll, behavior: 'instant' });
      }, 100);
    }
  }, [messages]);

  const sendMessage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!inputMessage.trim() || !socket) return;

    const message = inputMessage.trim();
    const history = buildHistory([...messages, { type: 'user', content: message }]);
    socket.emit('message', {
      message,
      field_id: fieldId,
      location: location,
      history,
    });
    
    // Save current page scroll position
    const currentPageScroll = window.scrollY;
    
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputMessage('');
    
    // Scroll chat container only, not the page
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
      
      // Restore page scroll position to prevent any movement
      window.scrollTo({ top: currentPageScroll, behavior: 'instant' });
    }, 50);
    
    // Immediately prevent any page scroll
    window.scrollTo({ top: currentPageScroll, behavior: 'instant' });
  };

  if (isConnecting) {
    return (
      <div className="w-full">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 font-cool">💬 Chat with Irrigation Assistant</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center h-[400px] sm:h-[500px] lg:h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A49FFF] mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to assistant...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 font-cool">Chat with Irrigation Assistant</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
          style={{ scrollBehavior: 'smooth' }}
          onScroll={(e) => {
            // Prevent page scroll when scrolling chat
            e.stopPropagation();
          }}
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
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>

        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
            <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDecisionDetails();
              // Prevent page scroll
              window.scrollTo({ top: window.scrollY, behavior: 'instant' });
            }}
            type="button"
            className="w-full mb-2 sm:mb-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-[#7AD7B1] to-[#4CAB5B] text-gray-900 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all hover:from-[#6BC7A1] hover:to-[#3D9B4D]"
          >
            Irrigation Decision Details
          </button>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              sendMessage(e);
            }} 
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onFocus={(e) => {
                // Prevent page scroll on input focus
                e.stopPropagation();
                const currentScroll = window.scrollY;
                setTimeout(() => {
                  window.scrollTo({ top: currentScroll, behavior: 'instant' });
                }, 0);
              }}
              placeholder="Ask about irrigation..."
              className="flex-1 p-2 sm:p-2.5 rounded-lg border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-[#A49FFF] focus:border-[#A49FFF] text-xs sm:text-sm bg-white text-gray-900"
            />
            <button
              type="submit"
              className="bg-[#A49FFF] text-gray-900 font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-[#B8E6D8] hover:text-gray-900 transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg"
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