let turnListenersAdded = false;

let client = {
  socket: io(),
  socketId: null,
  roomId: null,
  username: null,
};

let matchParameters = {
  isOnTurn: false,
  opponentsName: null,
  isInGame: false
};


const onMatchmaking = (e) => {
  e.preventDefault();
  client.socket.emit('matchmaking');
  document.getElementById('matchmaking').style.display = 'none';
  document.getElementById('onlineBatch').style.display = 'none';
  document.getElementById('quit').style.display = 'block';
};

const onQuit = (e) => {
  client.socket.emit('quit', 'quit');
};

const onRevancheCancel = () => {
  client.socket.emit('quit', 'canceled');
};

const onRevancheDecline = () => {
  client.socket.emit('quit', 'declined');
};

const onRevancheAck = () => {
  resetGameBoard();
  updateRevancheInvitation();
  client.socket.emit('accept');
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';
  client.socket.emit('message', text, client.roomId, client.username);
};

const onChoseName = (e) => {
  e.preventDefault();

  const input = document.querySelector('#name');
  client.username = input.value;
  input.value = '';

  client.socket.emit('userChoseName', client.username);
  document.getElementById('matchmaking').style.display = 'block';
  document.getElementById('onlineBatch').style.display = 'inline';
  document.getElementById('chatroomBatch').style.display = 'inline';
  document.getElementById('name-wrapper').style.display = 'none';
  document.getElementById('chat-wrapper').style.display = 'flex';
  writeEvent('Hello ' + client.username + '!', 'info')
};

const onRevancheRequest = () => {
  client.socket.emit('revancheRequest', client.roomId, client.username, client.socketId);
};

const onPlayAgainRequest = () => {
  window.setTimeout(playAgain, Math.floor(Math.random() * 150));
};

function playAgain() {
  client.socket.emit('playAgainRequest', client.roomId, client.username, client.socketId);
};
