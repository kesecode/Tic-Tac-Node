client.socket.on('message', (data) => {
  let text = data.text;
  let type = data.type;
  writeEvent(text, type);
});

client.socket.on('turnBroadcast', (data) => {
  writeOnGameBoard(data.buttonValue, data.char);
});

client.socket.on('isWaiting', printWaitingCard);

client.socket.on('idCommit', (socketId) => {
  client.socketId = socketId;
})

client.socket.on('opponentFound', (opponentsName) => {
  clearNotifications();
  writeEvent('Opponent found! -  You\'re playing against ' + opponentsName, 'info');
});

client.socket.on('matchParameter', (data) => {
  matchParameters.opponentsName = data.opponentsName;
  matchParameters.opponentsId = data.opponentsId;
});

client.socket.on('scoreBroadcast', (data) => {
  updateScoreBatch(data.clientScore, data.opponentsScore);
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

client.socket.on('roomSwitched', (data) => {
  let roomName = data.roomName;
  let roomId = data.roomId;
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

client.socket.on('winnerBroadcast', (data) => {
  printResultCard(data.isWinner);
  animate(data.animation);
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
.querySelector('#imprint')
.addEventListener('click', onImprint);

document
.querySelector('#lobby')
.addEventListener('click', onLobby);

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
