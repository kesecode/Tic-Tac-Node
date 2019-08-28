//loading node.js modules
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

//creating an instance of express
const app = express();

//declaring file path to client
const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

//giving the client path to the express instance
app.use(express.static(clientPath));

//creating instances of server and socketio
const server = http.createServer(app);
const io = socketio(server);

//socketio connection success logging
io.on('connection', (sock) => {
  console.log("Someone connected.");
  sock.emit('message', 'Hi, you are connectet');
});

//error logging
server.on('error', (err) => {
  console.error('Server error: ', err);
});

//start logging
server.listen(8080, () => {
  console.log('Server started on 8080');
});
