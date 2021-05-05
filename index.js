const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let online = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let usersNicks = {};

  usersNicks[socket.id] = socket.id;
  // for (let userNick in usersNicks) {
  //   if (usersNicks[userNick] !== null) {
  //     online.push(userNicks[userNick]);
  //   }
  // }
  online.push(socket.id);

  io.emit('chat message', "User " + socket.id + " has connected.")
  io.emit('check online', online);

  socket.on('name change', (newName) => {
    io.emit('chat message', "User " + usersNicks[socket.id] + " has changed their name to " + newName + ".");
    online = online.filter(function(value, index, arr){
      return value !== usersNicks[socket.id];
    });
    usersNicks[socket.id] = newName;
    online.push(newName);
    io.emit('check online', online);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', usersNicks[socket.id] + ": " + msg);
  });

  socket.on('disconnect', () => {
    io.emit('chat message', "User " + usersNicks[socket.id] + " has disconnected.");
    online = online.filter(function(value, index, arr){
      return value !== usersNicks[socket.id];
    });
    io.emit('check online', online);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});