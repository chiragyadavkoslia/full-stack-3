const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

// Create an HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow React frontend
    methods: ["GET", "POST"],
  },
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Handle incoming messages
  socket.on('send_message', (data) => {
    console.log('💬 Message:', data);
    // Broadcast to everyone
    io.emit('receive_message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
