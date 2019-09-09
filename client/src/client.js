const socket = io();
var _roomId = 'lobby';
const id = null;
const turnListenersAdded = false;
const acceptDeclineListenersAdded = false;
const cancelListenersAdded = false;
var _name = null;
var _onTurn = false;
var _opponentsName = null;

const onMatchmaking = (e) => {
  e.preventDefault();
  socket.emit('matchmaking');
  document.getElementById('matchmaking').style.display = 'none';
  document.getElementById('quit').style.display = 'block';
};

const onQuit = (e) => {
  socket.emit('quit', 'quit');
};

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
  socket.emit('message', text, this._roomId, this._name);
};

const onChooseName = (e) => {
  e.preventDefault();

  const input = document.querySelector('#name');
  this._name = input.value;
  input.value = '';

  socket.emit('ready', this._name);
  document.getElementById('matchmaking').style.display = 'block';
  document.getElementById('onlineBatch').style.display = 'inline';
  document.getElementById('name-wrapper').style.display = 'none';
  document.getElementById('chat-wrapper').style.display = 'flex';
  writeEvent('Hello ' + this._name + '!', 'info')
};

const onRevancheRequest = () => {
  socket.emit('revancheRequest', this._roomId, this._name, this.id);
}
