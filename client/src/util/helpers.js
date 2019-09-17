const addTurnListeners = () => {
  ['button0', 'button1', 'button2',
   'button3', 'button4', 'button5',
   'button6', 'button7', 'button8'].forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener('click', () => {
      if(matchParameters.isOnTurn && document.getElementById(id).innerHTML === '') {
        client.socket.emit('turn', document.getElementById(id).value);
      }
    });
  });
};

const updateTurnBatch = () => {
  turnBatch = document.getElementById('turnBatch');
  if(matchParameters.isOnTurn) turnBatch.innerHTML = 'Your turn';
  else turnBatch.innerHTML = matchParameters.opponentsName + 's turn'
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
