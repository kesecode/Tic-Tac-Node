const initializeGameUI = () => {
  document.getElementById('onlineBatch').style.display = 'none';
  document.getElementById('game-col').style.display = 'block';
  if ((function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))){
    safariFix();
  }
  if(document.getElementById('waitingCard') != null) {
    let elem = document.getElementById('waitingCard');
    elem.parentNode.removeChild(elem);
  }
  updateTurnBatch();
}

//Prints waiting for an opponent information
const printWaitingCard = () => {
  clearNotifications();
  const parent = document.querySelector('#output');
  parent.appendChild(produceWaitingCard());
  const messages = document.getElementById('output')
  scrollToBottom();
};

//Prints incoming invitations
const printInvitation = (isRevanche) => {
  const parent = document.querySelector('#output');

  if(isRevanche) {
      parent.appendChild(produceInvitationCard(true));
        document
          .querySelector('#revancheAcc')
          .addEventListener('click', onRevancheAccept);
        document
          .querySelector('#revancheDeni')
          .addEventListener('click', onDeclineInvitation);
  } else {
      parent.appendChild(produceInvitationCard(false));
        document
          .querySelector('#revancheAcc')
          .addEventListener('click', onPlayAgainAccept);
        document
          .querySelector('#revancheDeni')
          .addEventListener('click', onDeclineInvitation);
  }
  client.recievedInvitation = true;

  scrollToBottom();
};

//Prints out information while waiting for the acknowledgement of the invitation
const printAwaitAcceptanceCard = (isRevanche) => {
  const parent = document.querySelector('#output');
  if(isRevanche) {
    parent.appendChild(produceAwaitAcceptanceCard(true));
    document
      .querySelector('#revancheCancel')
      .addEventListener('click', onCancelInvitation);
  } else {
    parent.appendChild(produceAwaitAcceptanceCard(false));
    document
      .querySelector('#playAgainCancel')
      .addEventListener('click', onCancelInvitation);
  }
};

//Prints information when opponent accepted the invitation
const printAcceptedCard = (isRevanche) => {
  document.getElementById('waitingCard').remove();
  clearNotifications();
  document.getElementById('scoreBatch').style.display = 'inline';
  const parent = document.querySelector('#output');
  parent.appendChild(produceAcceptedCard(isRevanche));
  
  scrollToBottom();
}

//Prints result
const printResultCard = (result) => {
  clearNotifications();
  const parent = document.querySelector('#output');
  parent.appendChild(produceResultCard(result));
  if (!result) {
    document
      .querySelector('#revanche')
      .addEventListener('click', onRevancheRequest);
  } else {
    document
      .querySelector('#playagain')
      .addEventListener('click', onPlayAgainRequest);
  }
  scrollToBottom();
};

//Prints draw information
const printDrawCard = () => {
  clearNotifications();
  const parent = document.querySelector('#output');

  parent.appendChild(produceDrawCard());

  document
      .querySelector('#playagain')
      .addEventListener('click', onPlayAgainRequest);

  scrollToBottom();
}

const writeEvent = (text, type) => {
  const parent = document.querySelector('#output');

  const div = document.createElement('div');
  div.className = "alert alert-" + type;
  div.innerHTML = text;

  parent.appendChild(div);
  scrollToBottom();
};

const writeOnGameBoard = (buttonValue, char) => {
  let box = document.getElementById('button' + buttonValue);
    box.innerHTML = char;
};

const resetGameBoard = () => {
  for (var i = 0; i < 9; i ++) {
    let box = document.getElementById('button' + i);
    box.innerHTML = '';
    box.classList.remove('result');
    box.classList.remove('draw')
  }
};

const updateOnlineBatch = (online) => {
  document.getElementById('onlineBatch').innerHTML = 'Online: ' + online;
};
