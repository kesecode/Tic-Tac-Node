const socket = io();
var _roomId = 'lobby';
var _name = null;
var _onTurn = false;

const onMatchmaking = (e) => {
  e.preventDefault();
  socket.emit('matchmaking');
  document.getElementById('matchmaking').style.display = 'none';
  document.getElementById('endGame').style.display = 'block';
};

const onEndGame = (e) => {
  socket.emit('endGame');
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  socket.emit('message', text, this._roomId, this._name);
};

const onChooseName = (e) => {
  e.preventDefault();

  const input = document.querySelector('#name');
  this._name = input.value;
  input.value = '';

  socket.emit('ready', this._name);
  document.getElementById('name-wrapper').style.display = 'none';
  document.getElementById('chat-wrapper').style.display = 'flex';
  writeEvent('Hello ' + this._name + '!')
};
