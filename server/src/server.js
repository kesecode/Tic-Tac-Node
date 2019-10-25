//loading node.js modules
const express = require('express');
const socketio = require('socket.io');
const matchController = require('./matchController.js');
const Logger = require('./logger.js');
const port = 4000;


let waitingUser = null;
let usersOnline = 0;
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
const io = socketio(server, { pingTimeout: 120000 });


//___________________________________________________________



//connection
io.on('connection', (socket) => {
  usersOnline++;
  socket.hasChosenName = false;
  socket.isInGame = false;
  socket.listenerAdded = false;
  socket.roomId = null;
  io.emit('updateOnlineUsers', usersOnline);
  logger.userConnection(socket, true, usersOnline);
  socket.join('entrance');
  socket.emit('idCommit', socket.id);


  socket.on('userChoseName', (name) => {
    if (socket.hasChosenName === false) {
      socket.name = name;
      switchRoom(socket, 'lobby', 'Lobby');
      socket.hasChosenName = true;
    }
  })

  socket.on('message', (text, roomId, name) => {
    socket.to(roomId).emit('message', {text: name + ' says: ' + text, type: 'secondary'});
    io.to(socket.id).emit('message', {text: 'You' + ' said: ' + text, type: 'primary'});
  });

  socket.on('revancheRequest', (socketId) => {
   io.to(socketId).emit('revancheRequest');
  });

  socket.on('playAgainRequest', (socketId) => {
   io.to(socketId).emit('playAgainRequest');
  });

  socket.on('matchmaking', () => {
    console.log(socket.id + ' started Matchmaking!');
    switchRoom(socket, 'matchmaking', ' -');


    io.in('matchmaking').clients((err , clients) => {
      if (waitingUser === null) {
        waitingUser = socket;
        waitingUser.emit('isWaiting');
      } else {
        socket.emit('opponentFound', waitingUser.name);
        waitingUser.emit('opponentFound', socket.name);
        switchRoom(waitingUser, waitingUser.id + socket.id, 'Game');
        switchRoom(socket, waitingUser.id + socket.id, 'Game');
        new matchController(waitingUser, socket);
        socket.isInGame = true;
        waitingUser.isInGame = true;
        waitingUser = null;
      }
    });
  })

  socket.on('endSession', () => {    
    switchRoom(socket, 'lobby', 'Lobby');
    if(waitingUser !== null) {
      if(waitingUser.id === socket.id) waitingUser = null;
    }
  });

  socket.on('quit', () => {
    if(waitingUser == socket) socket.emit('gameover');
  })

  socket.on('disconnect', () => {
    usersOnline--;
    if(socket.isInGame) io.to(socket.roomId).emit('gameover');
    io.to(socket.roomId).emit('message', {text: socket.name + ' disconnected from game!', type: 'info'});
    logger.userConnection(socket, false, usersOnline);
    io.in('lobby').emit('updateOnlineUsers', usersOnline);
    if(waitingUser !== null) {
      if(waitingUser.id === socket.id) waitingUser = null;
    }
  });
});










//___________________________________________________________


function switchRoom (socket, roomId, roomName) {
  if (socket.roomId !== null) socket.leave(socket.roomId);
  socket.join(roomId);
  socket.roomId = roomId
  socket.emit('roomSwitched', {roomId: roomId, roomName: roomName});
}


//error logging
server.on('error', (err) => {
  logger.serverError(err);
});
