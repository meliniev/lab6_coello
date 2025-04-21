const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

const users = {};

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('login', (username) => {
    console.log(`${username} se ha unido al chat`);
    users[socket.id] = username;
    
    io.emit('message', {
      type: 'system',
      content: `${username} se ha unido al chat`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('chatMessage', (message) => {
    const username = users[socket.id];
    if (username) {
      io.emit('message', {
        type: 'message',
        username: username,
        content: message,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      console.log(`${username} ha salido del chat`);
      io.emit('message', {
        type: 'system',
        content: `${username} ha salido del chat`,
        timestamp: new Date().toISOString()
      });
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor Socket.io corriendo en http://localhost:${PORT}`);
});