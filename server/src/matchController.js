class MatchController {
  constructor(p1, p2) {
    console.log('CONSTRUCTOR CALLED');
    this._players = [p1, p2];
    this._court = [];
    this.playerOnTurn = 0;
    this.lastWinner = null;
    this.round = 0;
    this.scoreP0 = 0;
    this.scoreP1 = 0;

    this.gameRuns = true;
    this.animation = null;
    this._sendMatchParameters();
    this._sendToPlayers('Match begins!');
    this._players[0].emit('setOnTurn', true);
    this._players[0].emit('message', 'You start!', 'warning');
    this._players.forEach((player) => {
      player.emit('gameBegins');
    });
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
    });
    this._players.forEach((player, idx) => {
      if(!player.quitListenerAdded) {
        player.on('quit', (type) => {
          this._endGame(false, idx, player.name, type);
          player.quitListenerAdded = true;
        });
      }
      if(!player.revancheListenerAdded) {
        player.on('accept', () => {
          player.revancheListenerAdded = true;
          if(idx == 0) {
            this._players[1].emit('accepted', this._players[idx].name);
          } else {
            this._players[0].emit('accepted', this._players[idx].name);
          }
          this._resetGameForRevanche();
        });
      }
    });
    console.log('constructor ' + this.round + ' ' + this.gameRuns + ' ' + this._court[6] + ' ' + this.playerOnTurn);
  }

  _resetGameForRevanche() {
    this.gameRuns = true;
    this._court = [];
    if(this.lastWinner == 0) {
      this.playerOnTurn = 1;
      this._players[1].emit('setOnTurn', true);
      this._players[0].emit('setOnTurn', false);
    }
    else {
      this.playerOnTurn = 0;
      this._players[0].emit('setOnTurn', true);
      this._players[1].emit('setOnTurn', false);
    }
    this.animation = null;
  }


  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit('message', msg, 'info');
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg, 'info');
    });
  }

  _broadcastScore() {
    this._players.forEach((player) => {
      player.emit('message', 'SCORE - ' + this._players[0].name + ' ' + this.scoreP0 + ':' + this.scoreP1 + ' ' + this._players[1].name, 'warning');
    });
  }

  _endGame(winnerExists, idx, playerName, type) {
    if(!winnerExists) {
      this._players.forEach((player) => {
          player.emit('gameover');
          player.emit('setOnTurn', false);
      });

      switch (type) {
      case "quit" :
        if(idx == 0) {
          this._sendToPlayer(1, playerName + ' quitted the game!');
          this._sendToPlayer(0, 'You quitted the game!');
        } else {
          this._sendToPlayer(0, playerName + ' quitted the game!');
          this._sendToPlayer(1, 'You quitted the game!');
        } break;

      case "canceled" :
        if(idx == 0) {
          this._sendToPlayer(1, playerName + ' canceled the revanche invitation!');
          this._sendToPlayer(0, 'You canceled the revanche invitation!');
        } else {
          this._sendToPlayer(0, playerName + ' canceled the revanche invitation!');
          this._sendToPlayer(1, 'You canceled the revanche invitation!');
        } break;

      case "declined" :
        if(idx == 0) {
          this._sendToPlayer(1, playerName + ' declined the revanche invitation!');
          this._sendToPlayer(0, 'You declined the revanche invitation!');
        } else {
          this._sendToPlayer(0, playerName + ' declined the revanche invitation!');
          this._sendToPlayer(1, 'You declined the revanche invitation!');
        } break;
      }
    }
    this.gameRuns = false;
    this._court = [];
    this.animation = null;
  }

  _broadcastTurn(buttonValue, char) {
    this._players.forEach((player) => {
      player.emit('broadcastTurn', buttonValue, char);
    });
  }

  _broadcastWinner(winner) {
      if (winner == 0) {
        this._players[winner].emit('broadcastWinner', true, this.animation);
        this._players[1].emit('broadcastWinner', false, this.animation);
      }
      else {
        this._players[winner].emit('broadcastWinner', true, this.animation);
        this._players[0].emit('broadcastWinner', false, this.animation);
      }
      this._broadcastScore();
  }

  _sendMatchParameters() {
    this._players[0].emit('matchparameter', this._players[0].id, this._players[1].name);
    this._players[1].emit('matchparameter', this._players[0].id, this._players[0].name);
  }

  _toggleTurn() {
    if (this.gameRuns) {
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
  }

  //turn would be the coordinates of the selected fields passed as array
  _onTurn(playerIndex, buttonValue) {
    if(playerIndex == this.playerOnTurn) {
      let char;
      if (playerIndex == 0) char = 'X';
      else char = 'O';
      this._court[buttonValue] = playerIndex;
      this._broadcastTurn(buttonValue, char);
      if (this.round > 3) {
        if(this._check(playerIndex) === true) {
          if(playerIndex == 0) this.scoreP0 ++;
          if(playerIndex == 1) this.scoreP1 ++;
          this.lastWinner = this.playerOnTurn;
          this._broadcastWinner(this.playerOnTurn);
          this._endGame(true);
        }
      }
    }
    this.round++;
    this._toggleTurn();
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
