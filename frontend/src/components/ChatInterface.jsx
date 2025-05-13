import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

const ChatInterface = ({ fieldId, location }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const messagesEndRef = useRef(null);

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
      let content;
      if (typeof message === 'object') {
        if (message.error) {
          content = `Error: ${message.error}`;
        } else {
          content = `${message.using_mock ? '**Warning**: Using mock data due to database issues.\n\n' : ''}` +
                    `**Recommendation**:\n${message.recommendation || 'No recommendation provided'}\n\n` +
                    `**Field Details**:\n` +
                    `- Field ID: ${message.field_id}\n` +
                    `- Location: ${message.location}\n` +
                    `- Weather: ${message.weather_data.current.condition}, ${message.weather_data.current.temp_c}°C, ${message.weather_data.current.humidity}% humidity\n` +
                    `- Soil Moisture: ${message.soil_data.moisture}% (pH: ${message.soil_data.ph}, Temp: ${message.soil_data.temperature}°C)\n` +
                    `- Crop: ${message.crop_data.crop_type} (${message.crop_data.growth_stage}, ${message.crop_data.health_status})\n` +
                    `- Water Requirement: ${message.water_requirement.water_requirement} units\n` +
                    `- Irrigation Decision: ${message.irrigation_decision.should_irrigate ? `Irrigate for ${message.irrigation_decision.duration_minutes} minutes` : 'No irrigation needed'}`;
        }
      } else {
        content = message.toString();
      }
      
      setMessages(prev => [...prev, { type: 'assistant', content }]);
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    const message = inputMessage.trim();
    socket.emit('message', { 
      message,
      field_id: fieldId,
      location: location
    });
    
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputMessage('');
  };

  if (isConnecting) {
    return (
      <div className="h-96 bg-white rounded-xl shadow-inner flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl  font-bold mb-6 text-blue-900">Chat with Irrigation Assistant</h2>
      
      <div className=" bg-white h-[700px] rounded-xl shadow-inner overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto  p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : msg.type === 'system'
                    ? 'bg-red-100 text-red-800 rounded-bl-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <ReactMarkdown class="prose prose-sm max-w-none">
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about irrigation, weather, or soil conditions..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
            >
              <span>Send</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;