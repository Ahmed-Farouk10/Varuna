import React, { useState } from 'react';
import Layout from '../components/Layout';
import ChatInterface from '../components/ChatInterface';

const Chat = () => {
  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)]">
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
          <ChatInterface />
        </div>
      </div>
    </Layout>
  );
};

export default Chat; 