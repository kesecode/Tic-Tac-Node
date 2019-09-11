const addTurnListeners = () => {
  ['button0', 'button1', 'button2',
   'button3', 'button4', 'button5',
   'button6', 'button7', 'button8'].forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener('click', () => {
      if(this._onTurn === true && document.getElementById(id).innerHTML === '') {
        socket.emit('turn', document.getElementById(id).value);
      }
    });
  });
};

const updateTurnBatch = () => {
  turnBatch = document.getElementById('turnBatch');
  turnBatch.style.display = 'inline'
  if(this._onTurn) turnBatch.innerHTML = 'Your turn';
  else turnBatch.innerHTML = _opponentsName + 's turn'
}

const scrollToBottom = () => {
  const messages = document.getElementById('events')
  messages.scrollTop = messages.scrollHeight;
};

const clearNotifications = () => {
  const parent = document.getElementById("output");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};
