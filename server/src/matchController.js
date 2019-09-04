class MatchController {
  constructor(p1, p2) {
    this._players = [p1, p2];
    this._court = [8];
    this.playerOnTurn = 0;
    this.round = 0;

    this.animation = null;
    this._sendMatchParameters();
    this._sendToPlayers('Match starts!');
    this._players[0].emit('setOnTurn', true);
    this._players[0].emit('message', 'You start!');
    this._players.forEach((player) => {
      player.emit('gameBegins');
    });
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
    });
    this._players.forEach((player) => {
      player.on('endGame', (turn) => {
        console.log('Player: ' + player.name + ' - wants to Quit!');
        this._players.forEach((player) => {
          this._endGame(false);
        });
      });
    });
  }


  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }

  _endGame(winnerExists) {
    this._sendToPlayers('Game Over!');
    if(!winnerExists) {
      this._players.forEach((player) => {
          player.emit('gameover');
      });
    }
  }

  _broadcastTurn(buttonValue, char) {
    this._players.forEach((player) => {
      player.emit('broadcastTurn', buttonValue, char);
    });
  }

  _broadcastWinner(winner) {
      this._players[winner].emit('broadcastWinner', true, this.animation);
      if (winner == 0) this._players[1].emit('broadcastWinner', false, this.animation);
      else this._players[0].emit('broadcastWinner', false, this.animation);
  }

  _sendMatchParameters() {
    this._players.forEach((player) => {
      player.emit('matchparameter', this._players[0].id);
    });
  }

  _toggleTurn() {
    if (this.playerOnTurn == 0) {
      this._players[0].emit('setOnTurn', false);
      this._players[1].emit('setOnTurn', true);
      this._sendToPlayer(1, 'Your turn!');
      this.playerOnTurn = 1;
    }
    else {
      this._players[1].emit('setOnTurn', false);
      this._players[0].emit('setOnTurn', true);
      this._sendToPlayer(0, 'Your turn!');
      this.playerOnTurn = 0;
    }
  }

  //turn would be the coordinates of the selected fields passed as array
  _onTurn(playerIndex, buttonValue) {
    let char;
    if (playerIndex == 0) char = 'X';
    else char = 'O';
    this._court[buttonValue] = playerIndex;
    this._broadcastTurn(buttonValue, char);
    if (this.round > 3) {
      if(this._check(playerIndex) === true) {
        this._broadcastWinner(this.playerOnTurn);
        this._endGame(true);
      }
    }
    this._toggleTurn();
    this.round++;
  }

  _check(playerIndex) {
    if(this._court[0] === playerIndex) {
      if (this._court[1] === playerIndex && this._court[2] === playerIndex) {
        this.animation = 'horizontal0';
        return true;
      }
      if (this._court[3] === playerIndex && this._court[6] === playerIndex) {
        this.animation = 'vertical0';
        return true;
      }
      if (this._court[4] == playerIndex && this._court[8] === playerIndex) {
        this.animation = 'diagonal0';
        return true;
      }
    }

    if(this._court[1] === playerIndex) {
      if (this._court[4] === playerIndex && this._court[7] === playerIndex){
        this.animation = 'vertical1';
        return true;
      }
    }

    if(this._court[2] === playerIndex) {
      if (this._court[5] === playerIndex && this._court[8] === playerIndex) {
        this.animation = 'vertical2';
        return true;
      }
      if (this._court[4] === playerIndex && this._court[6] === playerIndex) {
        this.animation = 'diagonal1';
        return true;
      }
    }

    if(this._court[3] === playerIndex) {
      if (this._court[4] === playerIndex && this._court[5] === playerIndex){
        this.animation = 'horizontal1';
        return true;
      }
    }
    if(this._court[6] === playerIndex) {
      if (this._court[7] === playerIndex && this._court[8] === playerIndex) {
        this.animation = 'horizontal2';
        return true;
      }
    }
    return false;
  }
}


module.exports = MatchController;
