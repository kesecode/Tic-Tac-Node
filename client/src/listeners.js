socket.on('message', writeEvent);

socket.on('waiting', waitingAnimation);

socket.on('matchparameter', (roomId, playerName) => {
  this._roomId = roomId;
  this._opponentsName = playerName;
});

socket.on('broadcastTurn', (turn, char) => {
  writeOnGameBoard(turn, char);
});

socket.on('id', (socketid) => {
  this.id = socketid;
});

socket.on('gameover', () => {
  clearNotifications();
  resetGameBoard();
  this._roomId = 'lobby';
  socket.emit('endsession');
  document.getElementById('onlineBatch').style.display = 'inline';
  document.getElementById('matchmaking').style.display = 'block';
  document.getElementById('quit').style.display = 'none';
  document.getElementById('gameboard').style.display = 'none';
});

socket.on('chatroomChange', (chatroom) => {
  document.getElementById('chatroomBatch').innerHTML = 'Chatroom: ' + chatroom;
});

socket.on('revancheRequest', (playerName, idSender) => {
  printRevancheInvitation(playerName, idSender);
});

socket.on('accepted', (playerName) => {
  resetGameBoard();
  printRevancheAccepted(playerName);
});

socket.on('playersOnline', (online) => {
  updateOnlineBatch(online);
});

socket.on('gameBegins', () => {
  resetGameBoard();
  if(!this.turnListenersAdded) {
    addTurnListeners();
    this.turnListenersAdded = true;
  }
  document.getElementById('onlineBatch').style.display = 'none';
  document.getElementById('gameboard').style.display = 'grid';
  if(document.getElementById('waitingInfo') != null) {
    document.getElementById('waitingInfo').style.display = 'none';
  }
});

socket.on('broadcastWinner', (result, animation, winnerscore, loserscore) => {
  printResult(result, winnerscore, loserscore);
  animate(animation);
});

socket.on('setOnTurn', (onTurn) => {
  this._onTurn = onTurn;
})


document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);

document
  .querySelector('#name-form')
  .addEventListener('submit', onChooseName);

document
  .querySelector('#matchmaking')
  .addEventListener('click', onMatchmaking);

document
  .querySelector('#quit')
  .addEventListener('click', onQuit);
