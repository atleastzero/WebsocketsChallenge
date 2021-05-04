const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

users_nicks = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  users_nicks[socket.id] = socket.id;

  socket.on('name change', (newName) => {
    users_nicks[socket.id] = newName;
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', users_nicks[socket.id] + ": " + msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});