client.socket.on('message', writeEvent);

client.socket.on('turnBroadcast', (buttonValue, char) => {
  writeOnGameBoard(buttonValue, char);
});

client.socket.on('isWaiting', printWaitingCard);

client.socket.on('idCommit', (socketId) => {
  client.socketId = socketId;
})

client.socket.on('opponentFound', (opponentsName) => {
  clearNotifications();
  writeEvent('Opponent found! -  You\'re playing against ' + opponentsName, 'info');
});

client.socket.on('matchparameter', (opponentsName, opponentsId) => {
  matchParameters.opponentsName = opponentsName;
  matchParameters.opponentsId = opponentsId;
});

client.socket.on('scoreBroadcast', (clientScore, opponentScore) => {
  updateScoreBatch(clientScore, opponentScore);
});

client.socket.on('gameBegins', () => {
  resetGameBoard();
  if(!client.turnListenersAdded) {
    addTurnListeners();
    client.turnListenersAdded = true;
  }
  initializeGameUI();
});

client.socket.on('firstTurn', () => {
  clearNotifications();
});


client.socket.on('gameover', () => {
  clearNotifications();
  resetGameBoard();
  matchParameters.isOnTurn = false;
  client.socket.emit('endSession');
  document.getElementById('turnBatch').style.display = 'none';
  document.getElementById('onlineBatch').style.display = 'inline';
  document.getElementById('scoreBatch').style.display = 'none';
  document.getElementById('matchmaking').style.display = 'block';
  document.getElementById('quit').style.display = 'none';
  document.getElementById('gameboard').style.display = 'none';
});

client.socket.on('roomSwitched', (roomId, roomName) => {
  document.getElementById('chatroomBatch').innerHTML = 'Chatroom: ' + roomName;
  client.roomId = roomId;
});

client.socket.on('revancheRequest', () => {
  clearNotifications();
  printInvitation(true);
});

client.socket.on('playAgainRequest', () => {
  clearNotifications();
  printInvitation(false);
});

client.socket.on('revancheAccepted', () => {
  resetGameBoard();
  printAcceptedCard(true);
});

client.socket.on('playAgainAccepted', () => {
  resetGameBoard();
  printAcceptedCard(false);
});

client.socket.on('updateOnlineUsers', (online) => {
  updateOnlineBatch(online);
});

client.socket.on('winnerBroadcast', (result, animation) => {
  printResultCard(result);
  animate(animation);
});

client.socket.on('drawBroadcast', () => {
  printDrawCard();
});

client.socket.on('setOnTurn', (isOnTurn) => {
  matchParameters.isOnTurn = isOnTurn;
  updateTurnBatch();
})

client.socket.on('gameState', (isActive) => {
  if(isActive) {
    document.getElementById('turnBatch').style.display = 'inline';
  } else {
    document.getElementById('turnBatch').style.display = 'none';
    matchParameters.isOnTurn = false;
  }
});

document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);

document
  .querySelector('#name-form')
  .addEventListener('submit', onChoseName);

document
  .querySelector('#matchmaking')
  .addEventListener('click', onMatchmaking);

document
  .querySelector('#quit')
  .addEventListener('click', onQuit);

document
.querySelector('#darkTheme')
.addEventListener('click', onDark);

document
.querySelector('#lightTheme')
.addEventListener('click', onLight);

document
.querySelector('#colorTheme')
.addEventListener('click', onColor);
