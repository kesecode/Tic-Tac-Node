'use strict';

//loading node.js modules
const express = require('express');
const socketio = require('socket.io');
const fs = require('fs');
const Logger = require('./Util/Logger');
const MatchController = require('./Util/MatchController');
let httpsServer = null;
let httpServer = null;
const greenlock = require('greenlock-express').init({
	packageRoot: __dirname,

	// contact for security and critical bug notices
	maintainerEmail: 'contact@david-weppler.de',

	// where to look for configuration
	configDir: './greenlock.d',

	// whether or not to run at cloudscale
	cluster: false
});

let waitingUser = null;
let usersOnline = 0;
const logger = new Logger();

//Setup
const app = express();
greenlock.ready(httpsWorker);
const clientPath = `${__dirname}./client`;
app.use(express.static(clientPath));
const io = socketio(httpsServer, {
	pingTimeout: 120000,
	cookie: false
});

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
			socket.name = name.substring(0, 30);
			switchRoom(socket, 'lobby', 'Lobby');
			socket.hasChosenName = true;
		}
	});

	socket.on('message', (text, roomId, name) => {
		let modText = text;
		if (text.length > 100) {
			modText =
				text.substring(0, 30) +
				'<br>' +
				text.substring(31, 60) +
				'<br>' +
				text.substring(61, 90) +
				'<br>' +
				text.substring(91, 120) +
				'<br>' +
				text.substring(121, 150) +
				'<br>' +
				text.substring(151, 180) +
				'<br>' +
				text.substring(181, 200);
		}
		socket.to(roomId).emit('message', { text: name + ' says: ' + modText, type: 'secondary' });
		io.to(socket.id).emit('message', { text: 'You' + ' said: ' + modText, type: 'primary' });
	});

	socket.on('revancheRequest', (socketId) => {
		io.to(socketId).emit('revancheRequest');
	});

	socket.on('playAgainRequest', (socketId) => {
		io.to(socketId).emit('playAgainRequest');
	});

	socket.on('matchmaking', () => {
		if (socket.isInGame || waitingUser == socket) return;
		socket
			.to('lobby')
			.emit('message', { text: socket.name + ' started looking for an opponent - join him!', type: 'info' });
		switchRoom(socket, 'matchmaking', ' -');

		io.in('matchmaking').clients((err, clients) => {
			if (waitingUser === null) {
				waitingUser = socket;
				waitingUser.emit('isWaiting');
			} else {
				socket.emit('opponentFound', waitingUser.name);
				waitingUser.emit('opponentFound', socket.name);
				switchRoom(waitingUser, waitingUser.id + socket.id, 'Game');
				switchRoom(socket, waitingUser.id + socket.id, 'Game');
				new MatchController(waitingUser, socket);
				socket.isInGame = true;
				waitingUser.isInGame = true;
				waitingUser = null;
			}
		});
	});

	socket.on('endSession', () => {
		socket.isInGame = false;
		switchRoom(socket, 'lobby', 'Lobby');
		if (waitingUser !== null) {
			if (waitingUser.id === socket.id) waitingUser = null;
		}
	});

	socket.on('quit', () => {
		if (waitingUser == socket) socket.emit('gameover');
	});

	socket.on('disconnect', () => {
		usersOnline--;
		if (socket.isInGame) io.to(socket.roomId).emit('gameover');
		io.to(socket.roomId).emit('message', { text: socket.name + ' disconnected from game!', type: 'info' });
		logger.userConnection(socket, false, usersOnline);
		io.in('lobby').emit('updateOnlineUsers', usersOnline);
		if (waitingUser !== null) {
			if (waitingUser.id === socket.id) waitingUser = null;
		}
	});
});

//___________________________________________________________

function switchRoom(socket, roomId, roomName) {
	if (socket.roomId !== null) socket.leave(socket.roomId);
	socket.join(roomId);
	socket.roomId = roomId;
	socket.emit('roomSwitched', { roomId: roomId, roomName: roomName });
}

//error logging
httpsServer.on('error', (err) => {
	logger.serverError(err);
});

function httpsWorker(glx) {
	httpsServer = glx.httpsServer(null, app);
	httpServer = glx.httpServer();

	httpsServer.listen(443, '127.0.0.1', function() {
		console.info('Listening on ', httpsServer.address());
	});
	httpServer.listen(80, '127.0.0.1', function() {
		console.info('Listening on ', httpServer.address());
	});
}

/* 

  COMMAND TO GENERATE NEW LOCALHOST CERTIFICATE AND KEY
  COPY IT TO THE - sslFiles - FOLDER

  openssl req -x509 -out localhost.crt -keyout localhost.key   -newkey rsa:2048 -nodes -sha256   -subj '/CN=localhost' -extensions EXT -config <( \
  printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

*/
