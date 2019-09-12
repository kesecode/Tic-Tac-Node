//loading node.js modules
const express = require('express');
const socketio = require('socket.io');
const matchController = require('./MatchController');
const Logger = require('./logger.js');
const port = 4000;


let waiting = null;
logger = new Logger();

//App setup
const app = express();
const server = app.listen(port, () => {
  logger.serverStarted(port);
});

const clientPath = `${__dirname}/../../client`;

//Static files
app.use(express.static(clientPath));

//Socket setup
const io = socketio(server);


//___________________________________________________________







//connection
io.on('connection', (socket) => {
  socket.hasChosenName = false;
  socket.isInGame = false;
  socket.roomId = null;
  logger.userConnected(socket);
  socket.join('entrance');
  socket.emit('id', socket.id);


  socket.on('ready', (name) => {
    if (socket.hasChosenName == false) {
      socket.name = name;
      switchRoom(socket, 'lobby', 'Lobby');
      io.in('lobby').emit('playersOnline', logger.playersOnline);
      socket.hasChosenName = true;
    }
  })

  socket.on('message', (text, roomId, name) => {
    console.log('ASDsdcascs');
    
    io.in(roomId).emit('message', name + ' says: ' + text, 'secondary');
  });

  socket.on('revancheRequest', (roomId, name, id) => {
   io.to(roomId).emit('revancheRequest', name, id);
  });

  socket.on('playAgainRequest', (roomId, name, id) => {
   io.to(roomId).emit('playAgainRequest', name, id);
  });

  socket.on('matchmaking', () => {
    switchRoom(socket, 'matchmaking', ' -');


    io.in('matchmaking').clients((err , clients) => {
      if (waiting == null) {
        waiting = socket;
        waiting.emit('waiting');
      } else {
        socket.emit('opponentFound', waiting.name);
        waiting.emit('opponentFound', socket.name);
        switchRoom(waiting, waiting.id, 'Game');
        switchRoom(socket, waiting.id, 'Game');
        new matchController(waiting, socket);
        waiting = null;
      }
    });
  })

  socket.on('endsession', () => {
    switchRoom(socket, 'lobby', 'Lobby');
    if(waiting != null) {
      if(waiting.id == socket.id) waiting = null;
    }
  });

  socket.on('disconnect', () => {
    io.to(socket.roomId).emit('gameover');
    //io.to(socket.roomId).emit('message', socket.name + ' disconnected from game!', 'info');
    logger.userDisconnected(socket);
    io.in('lobby').emit('playersOnline', logger.playersOnline);
    if(waiting != null) {
      if(waiting.id == socket.id) waiting = null;
    }
  });
});










//___________________________________________________________


function switchRoom (socket, roomId, roomName) {
  if (socket.roomId !== null) socket.leave(socket.roomId);
  socket.join(roomId);
  socket.roomId = roomId
  socket.emit('roomSwitched', roomId, roomName);
}


//error logging
server.on('error', (err) => {
  logger.serverError(err);
});
