client.socket.on('message', writeEvent);

client.socket.on('turnBroadcast', (buttonValue, char) => {
  writeOnGameBoard(buttonValue, char);
});

client.socket.on('isWaiting', printWaitingCard);

client.socket.on('commitId', (socketId) => {
  client.socketId = socketId;
})

client.socket.on('opponentFound', (opponentsName) => {
  clearNotifications();
  writeEvent('Opponent found! -  You\'re playing against ' + opponentsName, 'info');
});

client.socket.on('matchparameter', (roomId, opponentsName) => {
  client.roomId = roomId;
  matchParameters.opponentsName = opponentsName;
});

client.socket.on('scoreBroadcast', (clientScore, opponentScore, round) => {
  document.getElementById('scoreBatch').style.display = 'inline';
  document.getElementById('scoreBatch').innerHTML = clientScore + ' : ' + opponentScore;
  if(round === 0) writeEvent('Score: ' + client.username + ' ' + clientScore + ' : ' + opponentScore + ' ' + matchParameters.opponentsName, 'info');
});

client.socket.on('gameBegins', () => {
  resetGameBoard();
  if(!turnListenersAdded) {
    addTurnListeners();
    turnListenersAdded = true;
  }
  initializeGameUI();
});

client.socket.on('gameover', () => {
  clearNotifications();
  resetGameBoard();
  client.socket.emit('endsession');
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

client.socket.on('revancheRequest', (playerName, idSender) => {
  printRevancheInvitation(playerName, idSender);
});

client.socket.on('accepted', (playerName) => {
  resetGameBoard();
  printRevancheAccepted(playerName);
});

client.socket.on('updateOnlineUsers', (online) => {
  updateOnlineBatch(online);
});

client.socket.on('broadcastWinner', (result, animation, winnerscore, loserscore) => {
  printResultCard(result);
  animate(animation);
});

client.socket.on('setOnTurn', (isOnTurn) => {
  matchParameters.isOnTurn = isOnTurn;
  updateTurnBatch();
})


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
