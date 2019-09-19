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

const updateInvitation = (isRevanche) => {
  document.getElementById('invitationCard').remove();
  clearNotifications();
  document.getElementById('scoreBatch').style.display = 'inline';
  const parent = document.querySelector('#output');
  parent.appendChild(produceAcceptedInvitationCard(isRevanche));
  scrollToBottom();
}

const updateTurnBatch = () => {
  turnBatch = document.getElementById('turnBatch');
  if(matchParameters.isOnTurn) turnBatch.innerHTML = 'Your turn';
  else turnBatch.innerHTML = matchParameters.opponentsName + 's turn'
}

const updateScoreBatch = (clientScore, opponentScore) => {
  document.getElementById('scoreBatch').innerHTML = 'You   ' + clientScore + ' : ' + opponentScore + '   ' + matchParameters.opponentsName;
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

const onThemeChange = (theme) => {
  let color;
  switch(theme) {
    case 'dark':
      color = '#404040';
      break;
    case 'light':
      color = '#f7f4f4';
      break;
    case 'color':
      color = '#f95353';
      break;
  }
  document.getElementById('body').style.background = color;
}
