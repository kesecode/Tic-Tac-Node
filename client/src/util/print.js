const initializeGameUI = () => {
  document.getElementById('onlineBatch').style.display = 'none';
  document.getElementById('turnBatch').style.display = 'inline';
  document.getElementById('gameboard').style.display = 'grid';
  if(document.getElementById('waitingCard') != null) {
    let elem = document.getElementById('waitingCard');
    elem.parentNode.removeChild(elem);
  }
  updateTurnBatch();
}


const printWaitingCard = () => {
  clearNotifications();
  const parent = document.querySelector('#output');
  parent.appendChild(produceWaitingCard());
  const messages = document.getElementById('output')
  scrollToBottom();
};

const printResultCard = (result) => {
  clearNotifications();
  const parent = document.querySelector('#output');
  parent.appendChild(produceResultCard(result));
  if (!result) {
    document
      .querySelector('#revanche')
      .addEventListener('click', onRevancheRequest);
  }
  scrollToBottom();
};

const printDrawMessage = () => {
  clearNotifications();
  const parent = document.querySelector('#output');

  const div = document.createElement('div');
  const button = document.createElement('button');


  div.className = "alert alert-dismissible alert-danger";
  div.id = "drawAlert";
  div.innerHTML = "You both are too dumb to win!";
  button.id = "playagain";
  button.className = "close";
  button.innerHTML = "Revanche";
  div.appendChild(button);


  parent.appendChild(div);

  document
      .querySelector('#playagain')
      .addEventListener('click', onPlayAgainRequest);

  scrollToBottom();
}

const printRevancheInvitation = (playerName, idSender) => {
  document.getElementById('scoreBatch').style.display = 'inline';
  if(client.socketId != idSender) {
    const parent = document.querySelector('#output');

    const divCon = document.createElement('div');
    const divHead = document.createElement('div');
    const divBod = document.createElement('div');
    const title = document.createElement('h4');
    const text = document.createElement('p');
    const buttonAcc = document.createElement('button');
    const buttonDeni = document.createElement('button');


    //divCon
    divCon.className = "card text-white bg-info mb-3";
    divCon.id = 'revancheInv';


    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Rematch invitation";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = "Revanche?";

    //text
    text.className = "card-text";
    text.innerHTML = playerName + " wants a revanche... Take it or leave it.";

    //buttonAcc
    buttonAcc.type = "button";
    buttonAcc.className = "btn btn-success";
    buttonAcc.innerHTML = "I take it!";
    buttonAcc.id = "revancheAcc"

    //buttonDeni
    buttonDeni.type = "button";
    buttonDeni.className = "btn btn-warning";
    buttonDeni.innerHTML = "No thanks!";
    buttonDeni.id = "revancheDeni"



    divCon.appendChild(divHead);
    divCon.appendChild(divBod);
    divBod.appendChild(title);
    divBod.appendChild(text);
    divBod.appendChild(buttonAcc);
    divBod.appendChild(buttonDeni);
    parent.appendChild(divCon);

      document
        .querySelector('#revancheAcc')
        .addEventListener('click', onRevancheAck);
      document
        .querySelector('#revancheDeni')
        .addEventListener('click', onRevancheDecline);

    scrollToBottom();
  } else printWaitingForRevAck(playerName)
};

const updateRevancheInvitation = () => {
  document.getElementById('revancheInv').remove();
  clearNotifications();
  document.getElementById('scoreBatch').style.display = 'inline';
  const parent = document.querySelector('#output');

  const divCon = document.createElement('div');
  const divHead = document.createElement('div');
  const divBod = document.createElement('div');
  const title = document.createElement('h4');


    //divCon
    divCon.className = "card text-white bg-info mb-3";
    divCon.id = 'revancheInvTrue';

    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Rematch invitation";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = "You accepted! " + matchParameters.opponentsName + " begins...";


    divCon.appendChild(divHead);
    divCon.appendChild(divBod);
    divBod.appendChild(title);
    parent.appendChild(divCon);

    scrollToBottom();
  };


const printWaitingForRevAck = () => {
    const parent = document.querySelector('#output');

    const progressbar = document.createElement('div');
    const divProg = document.createElement('div');
    const divBar = document.createElement('div');

    progressbar.className = "bs-component"
    divProg.className = "progress"
    divBar.className = "progress-bar progress-bar-striped progress-bar-animated";
    divBar.role = "progressbar";
    divBar.setAttribute('aria-valuenow', "100");
    divBar.setAttribute('aria-valuemin', "0");
    divBar.setAttribute('aria-valuemax', "100");
    divBar.style.width = "100%";

    divProg.appendChild(divBar);
    progressbar.appendChild(divProg);

    const divCon = document.createElement('div');
    const divHead = document.createElement('div');
    const divBod = document.createElement('div');
    const lBreak = document.createElement('p')
    const title = document.createElement('h4');
    const buttonCancel = document.createElement('button');


    //divCon
    divCon.className = "card text-white bg-info mb-3";
    divCon.id = "waitingCard"

    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Revanche invitation send";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = "Waiting for " + matchParameters.opponentsName +'s okay...';

    //buttonDeni
    buttonCancel.type = "button";
    buttonCancel.className = "btn btn-warning";
    buttonCancel.innerHTML = "Cancel";
    buttonCancel.id = "revancheCancel"

    lBreak.innerHTML = ' ';



    divCon.appendChild(divHead);
    divCon.appendChild(divBod);
    divBod.appendChild(title);
    divBod.appendChild(progressbar);
    divBod.appendChild(lBreak);
    divBod.appendChild(buttonCancel);
    parent.appendChild(divCon);
    document
      .querySelector('#revancheCancel')
      .addEventListener('click', onRevancheCancel);

    scrollToBottom();
};

const printRevancheAccepted = (playerName) => {
    document.getElementById('waitingCard').remove();
    clearNotifications();
    document.getElementById('scoreBatch').style.display = 'inline';
    const parent = document.querySelector('#output');

    const divCon = document.createElement('div');
    const divHead = document.createElement('div');
    const divBod = document.createElement('div');
    const lBreak = document.createElement('p')
    const title = document.createElement('h4');


    //divCon
    divCon.className = "card text-white bg-success mb-3";

    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Revanche invitation accepted";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = playerName + " wants to kick your ass again! You start off...";

    lBreak.innerHTML = ' ';



    divCon.appendChild(divHead);
    divCon.appendChild(divBod);
    divBod.appendChild(title);
    divBod.appendChild(lBreak);
    parent.appendChild(divCon);


    scrollToBottom();
};

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
    box.style.background = '';
  }
};

const updateOnlineBatch = (online) => {
  document.getElementById('onlineBatch').innerHTML = 'Players online: ' + online;
};


const printPlayAgainInvitation = (playerName, idSender) => {
  document.getElementById('scoreBatch').style.display = 'inline';
  if(client.socketId != idSender) {
    const parent = document.querySelector('#output');

    const divCon = document.createElement('div');
    const divHead = document.createElement('div');
    const divBod = document.createElement('div');
    const title = document.createElement('h4');
    const text = document.createElement('p');
    const buttonAcc = document.createElement('button');
    const buttonDeni = document.createElement('button');


    //divCon
    divCon.className = "card text-white bg-secondary mb-3";
    divCon.id = 'revancheInv';


    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Rematch invitation";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = "Play Again?";

    //text
    text.className = "card-text";
    text.innerHTML = playerName + " wants to play again...";

    //buttonAcc
    buttonAcc.type = "button";
    buttonAcc.className = "btn btn-success";
    buttonAcc.innerHTML = "#metoo";
    buttonAcc.id = "revancheAcc"

    //buttonDeni
    buttonDeni.type = "button";
    buttonDeni.className = "btn btn-warning";
    buttonDeni.innerHTML = "Noooo!";
    buttonDeni.id = "revancheDeni"



    divCon.appendChild(divHead);
    divCon.appendChild(divBod);
    divBod.appendChild(title);
    divBod.appendChild(text);
    divBod.appendChild(buttonAcc);
    divBod.appendChild(buttonDeni);
    parent.appendChild(divCon);

    document
      .querySelector('#revancheAcc')
      .addEventListener('click', onRevancheAck);
    document
      .querySelector('#revancheDeni')
      .addEventListener('click', onRevancheDecline);

    scrollToBottom();
  } else printWaitingForPAAck(playerName)
};


const printWaitingForPAAck = () => {
    const parent = document.querySelector('#output');

    const progressbar = document.createElement('div');
    const divProg = document.createElement('div');
    const divBar = document.createElement('div');

    progressbar.className = "bs-component"
    divProg.className = "progress"
    divBar.className = "progress-bar progress-bar-striped progress-bar-animated";
    divBar.role = "progressbar";
    divBar.setAttribute('aria-valuenow', "100");
    divBar.setAttribute('aria-valuemin', "0");
    divBar.setAttribute('aria-valuemax', "100");
    divBar.style.width = "100%";

    divProg.appendChild(divBar);
    progressbar.appendChild(divProg);

    const divCon = document.createElement('div');
    const divHead = document.createElement('div');
    const divBod = document.createElement('div');
    const lBreak = document.createElement('p')
    const title = document.createElement('h4');
    const buttonCancel = document.createElement('button');


    //divCon
    divCon.className = "card text-white bg-secondary mb-3";
    divCon.id = "waitingCard"

    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Invitation send";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = "Waiting for " + matchParameters.opponentsName +'s okay...';

    //buttonDeni
    buttonCancel.type = "button";
    buttonCancel.className = "btn btn-warning";
    buttonCancel.innerHTML = "Cancel";
    buttonCancel.id = "playAgainCancel"

    lBreak.innerHTML = ' ';



    divCon.appendChild(divHead);
    divCon.appendChild(divBod);
    divBod.appendChild(title);
    divBod.appendChild(progressbar);
    divBod.appendChild(lBreak);
    divBod.appendChild(buttonCancel);
    parent.appendChild(divCon);
    document
      .querySelector('#playAgainCancel')
      .addEventListener('click', onRevancheCancel);

    scrollToBottom();
};

const printPAAccepted = (playerName) => {
    document.getElementById('waitingCard').remove();
    clearNotifications();
    document.getElementById('scoreBatch').style.display = 'inline';
    const parent = document.querySelector('#output');

    const divCon = document.createElement('div');
    const divHead = document.createElement('div');
    const divBod = document.createElement('div');
    const lBreak = document.createElement('p')
    const title = document.createElement('h4');


    //divCon
    divCon.className = "card text-white bg-success mb-3";

    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Revanche invitation accepted";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = playerName + " really really wants you!";

    lBreak.innerHTML = ' ';



    divCon.appendChild(divHead);
    divCon.appendChild(divBod);
    divBod.appendChild(title);
    divBod.appendChild(lBreak);
    parent.appendChild(divCon);

    scrollToBottom();
};
