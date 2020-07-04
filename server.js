'use strict';

//loading node.js modules
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Logger = require('./utilNEU/Logger');
const MatchController = require('./utilNEU/MatchController');

const clientPath = `${__dirname}/client`;
let port = process.env.PORT; //define a port for private hosting

let waitingUser = null;
let usersOnline = 0;
const logger = new Logger();

//setup
const app = express();
const server = http.Server(app);

app.use(express.static(clientPath));
server.listen(port, () => {
	console.log('Server listens on Port', port);
});

const io = socketio(server, {
	pingTimeout: 120000,
	cookie: false
});

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

function switchRoom(socket, roomId, roomName) {
	if (socket.roomId !== null) socket.leave(socket.roomId);
	socket.join(roomId);
	socket.roomId = roomId;
	socket.emit('roomSwitched', { roomId: roomId, roomName: roomName });
}

//error logging
server.on('error', (err) => {
	logger.serverError(err);
});
