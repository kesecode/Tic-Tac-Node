const Logger = require('./logger.js');

class MatchController {
  constructor(p1, p2) {
    logger = new Logger();
    logger.matchInitialized(p1, p2);
    this._players = [p1, p2];
    this._court = null;
    this._court = [];
    this.playerOnTurn = Math.floor((Math.random() * 1) +0.5);


    this.lastWinner = null;
    this.turnSet = 0;
    this.round = 0;
    this.scoreP0 = 0;
    this.scoreP1 = 0;

    this.gameRuns = true;
    this.animation = null;
    this._sendMatchParameters();
    this._players[this.playerOnTurn].emit('setOnTurn', true);
    this._players.forEach((player) => {
      player.emit('gameBegins');
    });
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
    });
    this._players.forEach((player, idx) => {
      player.on('quit', (type) => {
        this._endGame(false, idx, player.name, type);
      });

      player.on('accept', () => {
        if(idx == 0) {
          this._players[1].emit('accepted', this._players[idx].name);
        } else {
          this._players[0].emit('accepted', this._players[idx].name);
        }
        this._resetGameForRevanche();
      });
    });
  }

  _resetGameForRevanche() {
    this.gameRuns = true;
    this._court = [];
    this.turnSet = 0;
    this.round ++;
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
    this._players.forEach((player, idx) => {
      if(idx == 0) player.emit('scoreBroadcast', this.scoreP0, this.scoreP1, this.round);
      else player.emit('scoreBroadcast', this.scoreP1, this.scoreP0, this.round);
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
          this._sendToPlayer(1, playerName + ' quit the game!');
          this._sendToPlayer(0, 'You quit the game!');
        } else {
          this._sendToPlayer(0, playerName + ' quit the game!');
          this._sendToPlayer(1, 'You quit the game!');
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
    this.turnSet = 0;
  }

  _broadcastTurn(buttonValue, char) {
    this._players.forEach((player) => {
      player.emit('turnBroadcast', buttonValue, char);
    });
  }

  _broadcastWinner(winner) {
      if (winner == 0) {
        this._players[winner].emit('broadcastWinner', true, this.animation);
        this._players[1].emit('broadcastWinner', false, this.animation);
      }
      else if (winner == 1) {
        this._players[winner].emit('broadcastWinner', true, this.animation);
        this._players[0].emit('broadcastWinner', false, this.animation);
      }
      else if (winner == 2) {
        this._players.forEach((player) => {
          player.emit('draw');
        })
      }
      this._broadcastScore();
  }

  _sendMatchParameters() {
    if (this.playerOnTurn == 0) {
      this._players[0].emit('matchparameter', this._players[0].id, this._players[1].name, true);
      this._players[1].emit('matchparameter', this._players[0].id, this._players[0].name, false);
    }
    else {
      this._players[0].emit('matchparameter', this._players[0].id, this._players[1].name, false);
      this._players[1].emit('matchparameter', this._players[0].id, this._players[0].name, true);
    }
  }

  _toggleTurn() {
    if (this.gameRuns) {
      if (this.playerOnTurn == 0) {
        this._players[0].emit('setOnTurn', false);
        this._players[1].emit('setOnTurn', true);
        this.playerOnTurn = 1;
      }
      else {
        this._players[1].emit('setOnTurn', false);
        this._players[0].emit('setOnTurn', true);
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
      if (this.turnSet > 3) {
        if(this._check(playerIndex) === true) {
          if(playerIndex == 0) this.scoreP0 ++;
          if(playerIndex == 1) this.scoreP1 ++;
          this.lastWinner = this.playerOnTurn;
          this._broadcastWinner(this.playerOnTurn);
          this._endGame(true);
        }
      }
      if (this.turnSet >= 8) {
        // TODO: approve
        console.log('DRAW ' + this.turnSet);
        if (this._check(0) === false && this._check(1) === false) this._broadcastWinner(2);
      }
    }
    this.turnSet++;
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
