//loading node.js modules
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const player = require('./player');
const matchController = require('./matchController');

//creating an instance of express
const app = express();

//declaring file path to client
const clientPath = `${__dirname}/../../client`;
console.log(`Serving static from ${clientPath}`);

//giving the client path to the express instance
app.use(express.static(clientPath));

//creating instances of server and socketio
const server = http.createServer(app);
const io = socketio(server);

let waitingPlayer = null;

//matchmaking
io.on('connection', (sock) => {
  if (waitingPlayer) {
    // start a Game
    opponentPlayer = new player('Opponent', sock);
    new matchController(waitingPlayer, opponentPlayer);
    waitingPlayer = null;
  } else {
    waitingPlayer = new player('Waiting', sock);
    waitingPlayer._sock.emit('message', 'Waiting for an opponent');
  }

  sock.on('message', (text) => {
    io.emit('message', text);
  });
});

//error logging
server.on('error', (err) => {
  console.error('Server error: ', err);
});

//start logging
server.listen(8080, () => {
  console.log('Server started on 8080');
});
