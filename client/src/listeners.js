socket.on('message', writeEvent);

socket.on('waiting', () => {
  waitingAnimation();
});

socket.on('opponentFound', (opponentsName) => {
  clearNotifications();
  writeEvent('Opponent found! -  You\'re playing against ' + opponentsName, 'info');
});

socket.on('matchparameter', (roomId, opponentsName, isStarting) => {
  this._roomId = roomId;
  this._opponentsName = opponentsName;
  if(isStarting) writeEvent('Match begins! You start...', 'info');
  else writeEvent('Match begins! ' + this._opponentsName + ' starts...', 'info');
});

socket.on('broadcastTurn', (turn, char) => {
  writeOnGameBoard(turn, char);
});

socket.on('id', (socketid) => {
  this.id = socketid;
});

socket.on('score', (myScore, opScore) => {
  if (this.scoreAsMessage) {
    writeEvent('SCORE - ' + this._name + ' ' + myScore + ':' + opScore + ' ' + this._opponentsName, 'warning');
    this.scoreAsMessage = false;
  }
  document.getElementById('scoreBatch').innerHTML = 'Score: ' + myScore + ' : ' + opScore;
})

socket.on('gameover', () => {
  clearNotifications();
  resetGameBoard();
  this._gameActive = false;
  this.scoreAsMessage = true;
  this._roomId = 'lobby';
  socket.emit('endsession');
  document.getElementById('onlineBatch').style.display = 'inline';
  document.getElementById('turnBatch').style.display = 'none'
  document.getElementById('scoreBatch').style.display = 'none'
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

socket.on('playAgainRequest', (playerName, idSender) => {
  printPlayAgainInvitation(playerName, idSender);
});

socket.on('draw', () => {
  printDrawMessage();
});

socket.on('drawAccepted', () => {
  //TODO
});

socket.on('playagainRecieved', () => {
  //TODO
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
  this._gameActive = true;
  updateTurnBatch();
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
  document.getElementById('turnBatch').style.display = 'none'
});

socket.on('setOnTurn', (onTurn) => {
  this._onTurn = onTurn;
  if(this._gameActive) updateTurnBatch();
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
