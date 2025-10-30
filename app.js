import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000'); // backend URL

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // Receive messages from server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  // Send message to server
  const sendMessage = () => {
    if (username && message) {
      const msgData = {
        username,
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', msgData);
      setMessage('');
    }
  };

  return (
    <div style={{ margin: '50px', fontFamily: 'Arial' }}>
      <h2>💬 Real-Time Chat App</h2>

      {!username ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => username && alert(`Welcome, ${username}!`)}>
            Join Chat
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              height: '300px',
              overflowY: 'auto',
              marginBottom: '10px',
            }}
          >
            {chat.map((c, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                <strong>{c.username}</strong> [{c.time}]: {c.message}
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
