//loading node.js modules
const express = require('express');
const socketio = require('socket.io');
const player = require('./player');
const playerController = require('./playerController')
const matchController = require('./MatchController');

//App setup
const app = express();
const server = app.listen(4000, () => {
  console.log('listening to requests on port 4000');
});

//declaring file path to client
const clientPath = `${__dirname}/../../client`;

//Static files
app.use(express.static(clientPath));

//Socket setup
const io = socketio(server);



let waitingPlayer = null;

//connection
io.on('connection', (sock) => {
  console.log('on connection function called');

  if (waitingPlayer) {
    // start a Game
    opponentPlayer = new player('opponent', sock);
    new matchController(waitingPlayer, opponentPlayer);
    waitingPlayer = null;
  } else {
    waitingPlayer = new player('waiting', sock);
    waitingPlayer._sock.emit('message', 'Waiting for an opponent');
  }

  sock.on('message', (text) => {
    io.emit('message', 'Connection successfull!');
  });
});





//error logging
server.on('error', (err) => {
  console.error('Server error: ', err);
});
