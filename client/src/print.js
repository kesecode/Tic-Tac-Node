const waitingAnimation = () => {
  const parent = document.querySelector('#output');

  const div = document.createElement('div');
  div.className = "alert alert-info";
  div.innerHTML = "Waiting on an Opponent...";

  const divComp = document.createElement('div');
  const divProg = document.createElement('div');
  const divBar = document.createElement('div');

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
};

const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#output');

  const div = document.createElement('div');
  div.className = "alert alert-secondary";
  div.innerHTML = text;

  parent.appendChild(div);
};

const writeOnGameBoard = (buttonValue, char) => {
  let box = document.getElementById('button' + buttonValue);
  box.innerHTML = char;
};

const resetGameBoard = () => {
  for (var i = 0; i < 9; i ++) {
    let box = document.getElementById('button' + i);
    box.innerHTML = '';
  }
};
