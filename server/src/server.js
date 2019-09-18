//loading node.js modules
const express = require('express');
const socketio = require('socket.io');
const matchController = require('./MatchController');
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
  socket.roomId = null;
  io.emit('updateOnlineUsers', usersOnline);
  logger.userConnection(socket, true, usersOnline);
  socket.join('entrance');
  socket.emit('commitId', socket.id);


  socket.on('userChoseName', (name) => {
    if (socket.hasChosenName == false) {
      socket.name = name;
      switchRoom(socket, 'lobby', 'Lobby');
      socket.hasChosenName = true;
    }
  })

  socket.on('message', (text, roomId, name) => {        
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
      if (waitingUser === null) {
        waitingUser = socket;
        waitingUser.emit('isWaiting');
      } else {
        socket.emit('opponentFound', waitingUser.name);
        waitingUser.emit('opponentFound', socket.name);
        switchRoom(waitingUser, waitingUser.id, 'Game');
        switchRoom(socket, waitingUser.id, 'Game');
        new matchController(waitingUser, socket);
        socket.isInGame = true;
        waitingUser.isInGame = true;
        waitingUser = null;
      }
    });
  })

  socket.on('endsession', () => {    
    switchRoom(socket, 'lobby', 'Lobby');
    if(waitingUser !== null) {
      if(waitingUser.id === socket.id) waiting = null;
    }
  });

  socket.on('disconnect', () => {
    usersOnline--;
    if(socket.isInGame) io.to(socket.roomId).emit('gameover');
    //io.to(socket.roomId).emit('message', socket.name + ' disconnected from game!', 'info');
    logger.userConnection(socket, false, usersOnline);
    io.in('lobby').emit('updateOnlineUsers', usersOnline);
    if(waitingUser !== null) {
      if(waitingUser.id === socket.id) waiting = null;
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
