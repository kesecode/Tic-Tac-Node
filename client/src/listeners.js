socket.on('message', writeEvent);

socket.on('waiting', () => {
  waitingAnimation();
});

socket.on('matchparameter', (roomId) => {
  this._roomId = roomId;
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
  socket.emit('endsession');
  document.getElementById('matchmaking').style.display = 'block';
  document.getElementById('quit').style.display = 'none';
  document.getElementById('gameboard').style.display = 'none';
});

socket.on('revancheRequest', (playerName, idSender) => {
  printRevancheInvitation(playerName, idSender);
});

socket.on('gameBegins', () => {
  resetGameBoard();
  if(!this.turnListenersAdded) {
    addTurnListeners();
    this.turnListenersAdded = true;
  }
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

const addTurnListeners = () => {
  ['button0', 'button1', 'button2',
   'button3', 'button4', 'button5',
   'button6', 'button7', 'button8'].forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener('click', () => {
      if(this._onTurn == true && document.getElementById(id).innerHTML == '') {
        socket.emit('turn', document.getElementById(id).value);
      }
    });
  });
};

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
