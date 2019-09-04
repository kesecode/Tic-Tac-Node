const waitingAnimation = () => {
  clearNotifications();
  const parent = document.querySelector('#output');

  const div = document.createElement('div');
  const divComp = document.createElement('div');
  const divProg = document.createElement('div');
  const divBar = document.createElement('div');

  div.className = "alert alert-info";
  div.innerHTML = "Waiting on an Opponent...";
  div.id = "waitingInfo"
  divComp.className = "bs-component"
  divProg.className = "progress"
  divBar.className = "progress-bar progress-bar-striped progress-bar-animated";
  divBar.role = "progressbar";
  divBar.setAttribute('aria-valuenow', "100");
  divBar.setAttribute('aria-valuemin', "0");
  divBar.setAttribute('aria-valuemax', "100");
  divBar.style.width = "100%";

  divProg.appendChild(divBar);
  divComp.appendChild(divProg);
  div.appendChild(divComp);
  parent.appendChild(div);
  const messages = document.getElementById('output')
  scrollToBottom();
};

const printResult = (result, winnerscore, loserscore) => {
  const parent = document.querySelector('#output');

  const div = document.createElement('div');
  const button = document.createElement('button');

  if(result) {
    div.className = "alert alert-dismissible alert-success";
    div.id = "winAlert";
    div.innerHTML = "Well done... You won the game!";
  } else {
    div.className = "alert alert-dismissible alert-danger";
    div.id = "loseAlert";
    div.innerHTML = "Sad... You lost!";
    button.id = "revanche";
    button.className = "close";
    button.innerHTML = "Revanche";
    div.appendChild(button);
  }

  parent.appendChild(div);
  if (!result) {
    document
      .querySelector('#revanche')
      .addEventListener('click', onRevancheRequest);
  }
  scrollToBottom();
};

const printRevancheInvitation = (playerName, idSender) => {
  if(this.id != idSender) {
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

    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Rematch invitation";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = "Revanche!";

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

const printWaitingForRevAck = (playerName) => {
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

    //divHead
    divHead.className = "card-header";
    divHead.innerHTML = "Revanche invitation send";

    //divBod
    divBod.className = "card-body";

    //title
    title.className = "card-title";
    title.innerHTML = "Waiting for " + '[playerName]' +'s okay...';

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

const writeEvent = (text, type) => {
  // <ul> element
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

const scrollToBottom = () => {
  const messages = document.getElementById('events')
  messages.scrollTop = messages.scrollHeight;
}

const clearNotifications = () => {
  const parent = document.getElementById("output");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
