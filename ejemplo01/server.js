const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.emit('notification', {
    type: 'info',
    message: 'Bienvenido al sistema de notificaciones',
    timestamp: new Date().toISOString()
  });

  socket.on('triggerNotification', (type) => {
    const notification = {
      type: type || 'info',
      message: `Notificación de tipo ${type || 'info'} generada a las ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString()
    };
    
    io.emit('notification', notification);
    
    console.log(`Notificación enviada: ${notification.message}`);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor de notificaciones corriendo en http://localhost:${PORT}`);
});