const socket = io();
var _roomId = 'lobby';
const id = null;
const turnListenersAdded = false;
const acceptDeclineListenersAdded = false;
const cancelListenersAdded = false;
var scoreAsMessage = true;
var _name = null;
var _onTurn = false;
var _opponentsName = null;
var _gameActive = false;

const onMatchmaking = (e) => {
  e.preventDefault();
  socket.emit('matchmaking');
  _roomId = 'matchmaking';
  document.getElementById('matchmaking').style.display = 'none';
  document.getElementById('quit').style.display = 'block';
};

const onQuit = (e) => {
  socket.emit('quit', 'quit');
};

const onPlayAgain = (e) => {
  // TODO:
  socket.emit('playAgainRequest', 'GEHT NICH', this._roomId, this._name);
}

const onRevancheCancel = (e) => {
  socket.emit('quit', 'canceled');
};

const onRevancheDecline = (e) => {
  socket.emit('quit', 'declined');
};

const onRevancheAck = (e) => {
  resetGameBoard();
  updateRevancheInvitation();
  socket.emit('accept');
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  if(this._roomId != 'matchmaking') socket.emit('message', text, this._roomId, this._name);
};

const onChooseName = (e) => {
  e.preventDefault();

  const input = document.querySelector('#name');
  this._name = input.value;
  input.value = '';

  socket.emit('ready', this._name);
  document.getElementById('matchmaking').style.display = 'block';
  document.getElementById('onlineBatch').style.display = 'inline';
  document.getElementById('chatroomBatch').style.display = 'inline';
  document.getElementById('name-wrapper').style.display = 'none';
  document.getElementById('chat-wrapper').style.display = 'flex';
  writeEvent('Hello ' + this._name + '!', 'info')
};

const onRevancheRequest = () => {
  socket.emit('revancheRequest', this._roomId, this._name, this.id);
}

const onPlayAgainRequest = () => {
timeoutID = window.setTimeout(playAgain, Math.floor(Math.random() * 150));
}

function playAgain() {
  socket.emit('playAgainRequest', this._roomId, this._name, this.id);
}
