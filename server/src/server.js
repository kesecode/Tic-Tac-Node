//loading node.js modules
var express = require('express');
var socketio = require('socket.io');
var matchController = require('./MatchController');

var online = 0;
let waiting = null;

//App setup
var app = express();
var server = app.listen(3000, () => {
  console.log('******* SERVER: listening to requests on port 3000 *******');
});

const clientPath = `${__dirname}/../../client`;

//Static files
app.use(express.static(clientPath));

//Socket setup
var io = socketio(server);


//___________________________________________________________



//connection
io.on('connection', (socket) => {
  online++;
  socket.ready = false;
  console.log('\x1b[42m', '******* SERVER:     USER CONNECTED       ******* SOCKET-ID:  [', socket.id, ']', '\x1b[0m', 'Online Users: ', online);
  socket.join('entrance');

  io.in('lobby').clients((err , clients) => {
    //client is array of ids
  });

  socket.on('ready', (name) => {
    if (socket.ready == false) {
      socket.name = name;
      socket.leave('entrance');
      socket.join('lobby');
      socket.ready = true;
      console.log(socket.name, 'chose name and joined the lobby');
    } else {
      console.log(socket.name, 'is ready and already in the lobby');
    }
  })

  socket.on('message', (text, roomId, name) => {
   io.in(roomId).emit('message', name + ' says: ' + text);
  });

  socket.on('matchmaking', () => {
    console.log(socket.name + ' started matchmaking');
    socket.leave('lobby');
    socket.join('matchmaking');

    io.in('matchmaking').clients((err , clients) => {
      if (waiting == null) {
        waiting = socket;
        waiting.emit('message', 'Waiting on an opponent...');
        console.log(socket.name + ' is waiting...');
      } else {
        waiting.emit('message', 'Opponent found! -  You\'re playing against ' + socket.name);
        socket.emit('message', 'Opponent found! -  You\'re playing against ' + waiting.name);
        waiting.leave('matchmaking');
        socket.leave('matchmaking');
        waiting.join(waiting.id);
        socket.join(waiting.id);
        new matchController(waiting, socket);
        waiting = null;
        console.log('waiting is nulled');
      }
    });
  })

  socket.on('disconnect', () => {
    online--;
    if (socket.ready == true) {console.log(socket.name, 'left the game');}
    console.log('\x1b[43m', '******* SERVER:     USER DISCONNECTED    ******* SOCKET-ID:  [', socket.id, ']', '\x1b[0m','Online Users: ', online);
  });
});

//error logging
server.on('error', (err) => {
  console.error('\x1b[41m', '******* SERVER - ERROR: ', err, '\x1b[0m');
});
