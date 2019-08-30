const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};

const sock = io();
var _roomId = 'lobby';
var _name = null;
sock.on('message', writeEvent);
sock.on('matchparameter', (roomId) => {
   this._roomId = roomId;
 });

const addTurnListeners = () => {
  ['turnTest'].forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener('click', () => {
      sock.emit('turn', id);
    });
  });
};

const onMatchmaking = (e) => {
  e.preventDefault();
  sock.emit('matchmaking');
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  sock.emit('message', text, this._roomId, this._name);
};

const onChooseName = (e) => {
  e.preventDefault();

  const input = document.querySelector('#name');
  this._name = input.value;
  input.value = '';

  sock.emit('ready', this._name);
  document.getElementById('name-wrapper').style.display = 'none';
  document.getElementById('ttt-wrapper').style.display = 'flex';
  writeEvent('Hello ' + this._name + '!')
};
//sock.on('playerName', name)

document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);

document
  .querySelector('#name-form')
  .addEventListener('submit', onChooseName);

document
  .querySelector('#matchmaking')
  .addEventListener('click', onMatchmaking)

addTurnListeners();
