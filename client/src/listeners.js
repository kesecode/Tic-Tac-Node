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

socket.on('gameover', () => {
  resetGameBoard();
  socket.emit('endsession');
});

socket.on('gameBegins', () => {
  resetGameBoard();
  document.getElementById('gameboard').style.display = 'grid';
});

socket.on('broadcastWinner', (result, animation) => {
  if (result == true) writeEvent('you won!');
  else writeEvent('you lost!');
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
  .querySelector('#endGame')
  .addEventListener('click', onEndGame);

addTurnListeners();
