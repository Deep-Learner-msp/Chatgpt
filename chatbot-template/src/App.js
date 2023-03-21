import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const chatBodyElement = document.querySelector('.chat-body');
    if (chatBodyElement) {
      chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
    }
  }, [chatHistory]);

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) {
      return;
    }

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { type: 'user', content: userInput },
    ]);
    setUserInput('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/chat', {
        user_query: userInput,
      });

      const botAnswer = response.data.response;
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'bot', content: botAnswer },
      ]);
    } catch (error) {
      console.error('Error fetching response from server:', error);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Chatbot</h1>
        </div>
        <div className="chat-body">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.type}`}>
              <div className="chat-bubble">
                <p>{chat.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <form onSubmit={handleUserSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
