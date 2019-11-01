let client = {
  socket: io(),
  socketId: null,
  roomId: null,
  username: null,
  recievedInvitation: null
};

let matchParameters = {
  isOnTurn: false,
  opponentsName: null,
  opponentsId: null,
  isInGame: false,
  turnListenersAdded: false
};


const onMatchmaking = (e) => {
  e.preventDefault();
  client.socket.emit('matchmaking');
};

const onLegalNotice = (e) => {
  e.preventDefault();
  document.getElementById('game-controls').style.display = 'none';
  document.getElementById('main-container').style.display = 'none';
  document.getElementById('legalnotice-wrapper').style.display = 'block';
  document.getElementById('lobby').style.display = 'block';
};

const onLobby = (e) => {
  e.preventDefault();
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('main-container').style.display = 'block';
  document.getElementById('legalnotice-wrapper').style.display = 'none';
  document.getElementById('game-controls').style.display = 'block';
};

const onQuit = () => {
  client.socket.emit('quit', 'quit');
};

const onCancelInvitation = () => {
  client.socket.emit('quit', 'canceled');
};

const onDeclineInvitation = () => {
  client.socket.emit('quit', 'declined');
};

const onRevancheAccept = () => {
  resetGameBoard();
  updateInvitation(true);
  client.socket.emit('revancheAccept');
};

const onPlayAgainAccept = () => {
  resetGameBoard();
  updateInvitation(false);
  client.socket.emit('playAgainAccept');
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat-input');
  const text = input.value;
  if(client.roomId !== 'matchmaking' && input.value != '') client.socket.emit('message', text, client.roomId, client.username);
  input.value = '';
};

const onChoseName = (e) => {
  e.preventDefault();

  const input = document.querySelector('#name');
  client.username = input.value;
  input.value = '';

  client.socket.emit('userChoseName', client.username);
  //document.getElementById('chatControl').style.display = 'block';
  document.getElementById('matchmaking').style.display = 'block';
  document.getElementById('onlineBatch').style.display = 'inline';
  document.getElementById('chatroomBatch').style.display = 'inline';
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('chat-col').style.display = 'flex';
  writeEvent('Hello ' + client.username + '!', 'info')
};

const onRevancheRequest = () => {
  clearNotifications();
  client.socket.emit('revancheRequest', matchParameters.opponentsId);
  printAwaitAcceptanceCard(true)
};

const onPlayAgainRequest = () => {
  clearNotifications();
  window.setTimeout(playAgain, Math.floor(Math.random() * 150));
};

function playAgain() {
  client.socket.emit('playAgainRequest', matchParameters.opponentsId);
  printAwaitAcceptanceCard(false)
};

const onDark = () => {
  onThemeChange('dark');
} 

const onLight = () => {
  onThemeChange('light');
} 

const onColor = () => {
  onThemeChange('color');
} 
