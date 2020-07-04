class Logger {
	userConnection(socket, isConnected, usersOnline) {
		if (isConnected) {
			console.log(
				'\x1b[42m',
				'******* SERVER:        USER CONNECTED       ******* SOCKET-ID:  [',
				socket.id,
				']',
				'\x1b[0m',
				'Online Users: ',
				usersOnline
			);
		} else {
			console.log(
				'\x1b[43m',
				'******* SERVER:        USER DISCONNECTED    ******* SOCKET-ID:  [',
				socket.id,
				']',
				'\x1b[0m',
				'Online Users: ',
				usersOnline
			);
		}
	}

	matchInitialized(p0, p1) {
		console.log(
			'\x1b[34m',
			'******* CONTROLLER:    MATCH INITIALIZED    ******* Player 0:  [',
			p0.name,
			'] -- Player 1:  [',
			p1.name,
			']',
			'\x1b[0m'
		);
	}

	serverError(err) {
		console.error('\x1b[41m', '******* SERVER - ERROR: ', err, '\x1b[0m');
	}

	serverStarted(port) {
		console.log('\x1b[35m', '******* SERVER: listening to requests on port ', port, ' *******', '\x1b[0m');
	}
}

module.exports = Logger;
