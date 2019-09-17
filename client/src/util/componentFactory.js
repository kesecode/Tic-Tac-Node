const produceWaitingCard = () => {
    const div = document.createElement('div');
    const divComp = document.createElement('div');
    const divProg = document.createElement('div');
    const divBar = document.createElement('div');
  
    div.className = "alert alert-info";
    div.innerHTML = "Waiting for an Opponent...";
    div.id = "waitingCard";
    divComp.className = "bs-component";
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

    return div;
}

const produceResultCard = (result) => {
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

    return div;
}
