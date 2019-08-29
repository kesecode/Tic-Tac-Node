const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events');

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
};

const addTurnListeners = () => {
  ['turnTest'].forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener('click', () => {
      sock.emit('turn', id);
    });
  });
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message', text);
};

const onChooseName = (e) => {
  e.preventDefault();

  const input = document.querySelector('#name');
  const name = input.value;
  input.value = '';

  sock.emit('startMatchmaking', name);
};

const sock = io();
sock.on('message', writeEvent);
//sock.on('playerName', name)

document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);

document
  .querySelector('#name-form')
  .addEventListener('submit', onChooseName);

addTurnListeners();
