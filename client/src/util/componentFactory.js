const produceWaitingCard = () => {
	const div = document.createElement('div');
	const divComp = document.createElement('div');
	const divProg = document.createElement('div');
	const divBar = document.createElement('div');

	div.className = 'alert alert-info';
	div.innerHTML = 'Waiting for an Opponent...';
	div.id = 'waitingCard';
	divComp.className = 'bs-component';
	divProg.className = 'progress';
	divBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
	divBar.role = 'progressbar';
	divBar.setAttribute('aria-valuenow', '100');
	divBar.setAttribute('aria-valuemin', '0');
	divBar.setAttribute('aria-valuemax', '100');
	divBar.style.width = '100%';

	divProg.appendChild(divBar);
	divComp.appendChild(divProg);
	div.appendChild(divComp);

	return div;
};

const produceResultCard = (result) => {
	const div = document.createElement('div');
	const button = document.createElement('button');

	if (result) {
		div.className = 'alert alert-dismissible alert-success';
		div.id = 'winAlert';
		div.innerHTML = 'Well done... You won the game!';
		button.id = 'playagain';
		button.className = 'close';
		button.innerHTML = 'Revanche';
		div.appendChild(button);
	} else {
		div.className = 'alert alert-dismissible alert-danger';
		div.id = 'loseAlert';
		div.innerHTML = 'Sad... You lost!';
		button.id = 'revanche';
		button.className = 'close';
		button.innerHTML = 'Revanche';
		div.appendChild(button);
	}

	return div;
};

const produceInvitationCard = (revanche) => {
	const cardElem = document.createElement('div');
	if (revanche) {
		const divHead = document.createElement('div');
		const divBod = document.createElement('div');
		const title = document.createElement('h4');
		const text = document.createElement('p');
		const buttonAcc = document.createElement('button');
		const buttonDeni = document.createElement('button');

		//divCon
		cardElem.className = 'card text-white bg-info mb-3';
		cardElem.id = 'invitationCard';

		//divHead
		divHead.className = 'card-header';
		divHead.innerHTML = 'Revanche invitation';

		//divBod
		divBod.className = 'card-body';

		//title
		title.className = 'card-title';
		title.innerHTML = 'Revanche?';

		//text
		text.className = 'card-text';
		text.innerHTML = matchParameters.opponentsName + ' wants a revanche... Take it or leave it.';

		//buttonAcc
		buttonAcc.type = 'button';
		buttonAcc.className = 'btn btn-success';
		buttonAcc.innerHTML = 'I take it!';
		buttonAcc.id = 'revancheAcc';

		//buttonDeni
		buttonDeni.type = 'button';
		buttonDeni.className = 'btn btn-warning';
		buttonDeni.innerHTML = 'No thanks!';
		buttonDeni.id = 'revancheDeni';

		cardElem.appendChild(divHead);
		cardElem.appendChild(divBod);
		divBod.appendChild(title);
		divBod.appendChild(text);
		divBod.appendChild(buttonAcc);
		divBod.appendChild(buttonDeni);
	} else {
		const divHead = document.createElement('div');
		const divBod = document.createElement('div');
		const title = document.createElement('h4');
		const text = document.createElement('p');
		const buttonAcc = document.createElement('button');
		const buttonDeni = document.createElement('button');

		//divCon
		cardElem.className = 'card text-white bg-secondary mb-3';
		cardElem.id = 'invitationCard';

		//divHead
		divHead.className = 'card-header';
		divHead.innerHTML = 'Rematch invitation';

		//divBod
		divBod.className = 'card-body';

		//title
		title.className = 'card-title';
		title.innerHTML = 'Play Again?';

		//text
		text.className = 'card-text';
		text.innerHTML = matchParameters.opponentsName + ' wants to play again...';

		//buttonAcc
		buttonAcc.type = 'button';
		buttonAcc.className = 'btn btn-success';
		buttonAcc.innerHTML = '#metoo';
		buttonAcc.id = 'revancheAcc';

		//buttonDeni
		buttonDeni.type = 'button';
		buttonDeni.className = 'btn btn-warning';
		buttonDeni.innerHTML = 'Noooo!';
		buttonDeni.id = 'revancheDeni';

		cardElem.appendChild(divHead);
		cardElem.appendChild(divBod);
		divBod.appendChild(title);
		divBod.appendChild(text);
		divBod.appendChild(buttonAcc);
		divBod.appendChild(buttonDeni);
	}
	return cardElem;
};

const produceAwaitAcceptanceCard = (revanche) => {
	const cardElem = document.createElement('div');
	if (revanche) {
		const progressbar = document.createElement('div');
		const divProg = document.createElement('div');
		const divBar = document.createElement('div');

		progressbar.className = 'bs-component';
		divProg.className = 'progress';
		divBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
		divBar.role = 'progressbar';
		divBar.setAttribute('aria-valuenow', '100');
		divBar.setAttribute('aria-valuemin', '0');
		divBar.setAttribute('aria-valuemax', '100');
		divBar.style.width = '100%';

		divProg.appendChild(divBar);
		progressbar.appendChild(divProg);

		const divHead = document.createElement('div');
		const divBod = document.createElement('div');
		const lBreak = document.createElement('p');
		const title = document.createElement('h4');
		const buttonCancel = document.createElement('button');

		//divCon
		cardElem.className = 'card text-white bg-info mb-3';
		cardElem.id = 'waitingCard';

		//divHead
		divHead.className = 'card-header';
		divHead.innerHTML = 'Revanche invitation send';

		//divBod
		divBod.className = 'card-body';

		//title
		title.className = 'card-title';
		title.innerHTML = 'Waiting for ' + matchParameters.opponentsName + 's okay...';

		//buttonDeni
		buttonCancel.type = 'button';
		buttonCancel.className = 'btn btn-warning';
		buttonCancel.innerHTML = 'Cancel';
		buttonCancel.id = 'revancheCancel';

		lBreak.innerHTML = ' ';

		cardElem.appendChild(divHead);
		cardElem.appendChild(divBod);
		divBod.appendChild(title);
		divBod.appendChild(progressbar);
		divBod.appendChild(lBreak);
		divBod.appendChild(buttonCancel);
	} else {
		const progressbar = document.createElement('div');
		const divProg = document.createElement('div');
		const divBar = document.createElement('div');

		progressbar.className = 'bs-component';
		divProg.className = 'progress';
		divBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
		divBar.role = 'progressbar';
		divBar.setAttribute('aria-valuenow', '100');
		divBar.setAttribute('aria-valuemin', '0');
		divBar.setAttribute('aria-valuemax', '100');
		divBar.style.width = '100%';

		divProg.appendChild(divBar);
		progressbar.appendChild(divProg);

		const divHead = document.createElement('div');
		const divBod = document.createElement('div');
		const lBreak = document.createElement('p');
		const title = document.createElement('h4');
		const buttonCancel = document.createElement('button');

		//divCon
		cardElem.className = 'card text-white bg-secondary mb-3';
		cardElem.id = 'waitingCard';

		//divHead
		divHead.className = 'card-header';
		divHead.innerHTML = 'Rematch invitation send';

		//divBod
		divBod.className = 'card-body';

		//title
		title.className = 'card-title';
		title.innerHTML = 'Waiting for ' + matchParameters.opponentsName + 's okay...';

		//buttonDeni
		buttonCancel.type = 'button';
		buttonCancel.className = 'btn btn-warning';
		buttonCancel.innerHTML = 'Cancel';
		buttonCancel.id = 'playAgainCancel';

		lBreak.innerHTML = ' ';

		cardElem.appendChild(divHead);
		cardElem.appendChild(divBod);
		divBod.appendChild(title);
		divBod.appendChild(progressbar);
		divBod.appendChild(lBreak);
		divBod.appendChild(buttonCancel);
	}
	return cardElem;
};

const produceAcceptedCard = (revanche) => {
	const cardElem = document.createElement('div');
	if (revanche) {
		const divHead = document.createElement('div');
		const divBod = document.createElement('div');
		const lBreak = document.createElement('p');
		const title = document.createElement('h4');

		//divCon
		cardElem.className = 'card text-white bg-info mb-3';

		//divHead
		divHead.className = 'card-header';
		divHead.innerHTML = 'Revanche invitation accepted';

		//divBod
		divBod.className = 'card-body';

		//title
		title.className = 'card-title';
		title.innerHTML = matchParameters.opponentsName + ' wants to kick your ass again! You start off...';

		lBreak.innerHTML = ' ';

		cardElem.appendChild(divHead);
		cardElem.appendChild(divBod);
		divBod.appendChild(title);
		divBod.appendChild(lBreak);
	} else {
		const divHead = document.createElement('div');
		const divBod = document.createElement('div');
		const lBreak = document.createElement('p');
		const title = document.createElement('h4');

		//divCon
		cardElem.className = 'card text-white bg-secondary mb-3';

		//divHead
		divHead.className = 'card-header';
		divHead.innerHTML = 'Rematch invitation accepted';

		//divBod
		divBod.className = 'card-body';

		//title
		title.className = 'card-title';
		title.innerHTML = matchParameters.opponentsName + ' wants to play again!';

		lBreak.innerHTML = ' ';

		cardElem.appendChild(divHead);
		cardElem.appendChild(divBod);
		divBod.appendChild(title);
		divBod.appendChild(lBreak);
	}
	return cardElem;
};

const produceAcceptedInvitationCard = (revanche) => {
	const cardElem = document.createElement('div');
	if (revanche) {
		const divHead = document.createElement('div');
		const divBod = document.createElement('div');
		const title = document.createElement('h4');

		//divCon
		cardElem.className = 'card text-white bg-info mb-3';
		cardElem.id = 'revancheInvTrue';

		//divHead
		divHead.className = 'card-header';
		divHead.innerHTML = 'Revanche invitation';

		//divBod
		divBod.className = 'card-body';

		//title
		title.className = 'card-title';
		title.innerHTML = 'You accepted! ' + matchParameters.opponentsName + ' begins...';

		cardElem.appendChild(divHead);
		cardElem.appendChild(divBod);
		divBod.appendChild(title);
	} else {
		const divHead = document.createElement('div');
		const divBod = document.createElement('div');
		const title = document.createElement('h4');

		//divCon
		cardElem.className = 'card text-white bg-secondary mb-3';
		cardElem.id = 'revancheInvTrue';

		//divHead
		divHead.className = 'card-header';
		divHead.innerHTML = 'Rematch invitation';

		//divBod
		divBod.className = 'card-body';

		//title
		title.className = 'card-title';
		title.innerHTML = 'You accepted! ' + matchParameters.opponentsName + ' begins...';

		cardElem.appendChild(divHead);
		cardElem.appendChild(divBod);
		divBod.appendChild(title);
	}
	return cardElem;
};

const produceDrawCard = () => {
	const cardElem = document.createElement('div');
	const button = document.createElement('button');

	cardElem.className = 'alert alert-dismissible alert-warning';
	cardElem.id = 'drawAlert';
	cardElem.innerHTML = 'You both are too dumb to win!';
	button.id = 'playagain';
	button.className = 'close';
	button.innerHTML = 'Revanche';
	cardElem.appendChild(button);

	return cardElem;
};
