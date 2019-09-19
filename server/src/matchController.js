const Logger = require('./logger.js');

class MatchController {
  constructor(p1, p2) {
    logger = new Logger();
    logger.matchInitialized(p1, p2);
    this.players = [p1, p2];
    this.court = [];
    this.playerOnTurn = Math.floor((Math.random() * 1) +0.5);


    this.lastWinner = null;
    this.turnCount = 0;
    this.round = 0;
    this.scoreP0 = 0;
    this.scoreP1 = 0;

    this.setGameState(true);
    this.animation = null;
    this.sendMatchParameters();
    this.players[this.playerOnTurn].emit('setOnTurn', true);
    this.players.forEach((player) => {
      player.emit('gameBegins');
    });
    this.players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this.onTurn(idx, turn);
      });
    });
    this.players.forEach((player, idx) => {
      if(!player.listenerAdded) {
        player.on('quit', (type) => {
          this.endGame(false, idx, player.name, type);
        });
        player.listenerAdded = true;
      }
      
      player.on('revancheAccept', () => {
        if(idx == 0) {
          this.players[1].emit('revancheAccepted', this.players[idx].name);
        } else {
          this.players[0].emit('revancheAccepted', this.players[idx].name);
        }
        this.resetGameForRematch();
      });
      player.on('playAgainAccept', () => {
        if(idx == 0) {
          this.players[1].emit('playAgainAccepted', this.players[idx].name);
        } else {
          this.players[0].emit('playAgainAccepted', this.players[idx].name);
        }
        this.resetGameForRematch();
      });
    });
  }

  resetGameForRematch() {
    this.setGameState(true);
    this.court = [];
    this.turnCount = 0;
    this.round ++;
    if(this.lastWinner == 0) {
      this.playerOnTurn = 1;
      this.players[1].emit('setOnTurn', true);
      this.players[0].emit('setOnTurn', false);
    }
    else {
      this.playerOnTurn = 0;
      this.players[0].emit('setOnTurn', true);
      this.players[1].emit('setOnTurn', false);
    }
    this.animation = null;
  }


  sendToPlayer(playerIndex, msg) {
    this.players[playerIndex].emit('message', msg, 'info');
  }

  sendToPlayers(msg) {
    this.players.forEach((player) => {
      player.emit('message', msg, 'info');
    });
  }

  setGameState(isActive) {
    this.gameRuns = isActive;
    this.players.forEach((player) => {
      player.emit('gameState', isActive);
    })
  }

  broadcastScore() {
    this.players.forEach((player, idx) => {
      if(idx == 0) player.emit('scoreBroadcast', this.scoreP0, this.scoreP1, this.round);
      else player.emit('scoreBroadcast', this.scoreP1, this.scoreP0, this.round);
    });
  }

  endGame(hasResult, idx, playerName, type) {
    if(!hasResult) {
      this.players.forEach((player) => {
          player.emit('gameover');
      });

      switch (type) {
      case "quit" :
        if(idx == 0) {
          this.sendToPlayer(1, playerName + ' quit the game!');
          this.sendToPlayer(0, 'You quit the game!');
        } else {
          this.sendToPlayer(0, playerName + ' quit the game!');
          this.sendToPlayer(1, 'You quit the game!');
        } break;

      case "canceled" :
        if(idx == 0) {
          this.sendToPlayer(1, playerName + ' canceled the invitation!');
          this.sendToPlayer(0, 'You canceled the invitation!');
        } else {
          this.sendToPlayer(0, playerName + ' canceled the invitation!');
          this.sendToPlayer(1, 'You canceled the invitation!');
        } break;

      case "declined" :
        if(idx == 0) {
          this.sendToPlayer(1, playerName + ' declined the invitation!');
          this.sendToPlayer(0, 'You declined the invitation!');
        } else {
          this.sendToPlayer(0, playerName + ' declined the invitation!');
          this.sendToPlayer(1, 'You declined the invitation!');
        } break;
      }
    }
    this.setGameState(false);
    this.court = [];
    this.animation = null;
    this.turnCount = 0;
  }

  broadcastTurn(buttonValue, char) {
    if(this.turnCount == 0)  {
      this.players.forEach((player) => {
      player.emit('firstTurn');
      });
    }
    this.players.forEach((player) => {
      player.emit('turnBroadcast', buttonValue, char);
    });
  }

  broadcastWinner(winner) {
      if (winner == 0) {
        this.players[winner].emit('winnerBroadcast', true, this.animation);
        this.players[1].emit('winnerBroadcast', false, this.animation);
      }
      else if (winner == 1) {
        this.players[winner].emit('winnerBroadcast', true, this.animation);
        this.players[0].emit('winnerBroadcast', false, this.animation);
      }
      else if (winner == 2) {
        this.players.forEach((player) => {
          player.emit('drawBroadcast');
        })
      }
      this.broadcastScore();
  }

  sendMatchParameters() {
    if (this.playerOnTurn == 0) {
      this.players[0].emit('matchparameter', this.players[1].name, this.players[1].id, true);
      this.players[1].emit('matchparameter', this.players[0].name, this.players[0].id, false);
    }
    else {
      this.players[0].emit('matchparameter', this.players[1].name, this.players[1].id, false);
      this.players[1].emit('matchparameter', this.players[0].name, this.players[0].id, true);
    }
  }

  toggleTurn() {
    if (this.gameRuns) {
      if (this.playerOnTurn == 0) {
        this.players[0].emit('setOnTurn', false);
        this.players[1].emit('setOnTurn', true);
        this.playerOnTurn = 1;
      }
      else {
        this.players[1].emit('setOnTurn', false);
        this.players[0].emit('setOnTurn', true);
        this.playerOnTurn = 0;
      }
    }
  }

  //turn would be the coordinates of the selected fields passed as array
  onTurn(playerIndex, buttonValue) {
    if(playerIndex == this.playerOnTurn) {
      let char;
      if (playerIndex == 0) char = 'X';
      else char = 'O';
      this.court[buttonValue] = playerIndex;
      this.broadcastTurn(buttonValue, char);
      if (this.turnCount > 3) {
        if(this.check(playerIndex) === true) {
          if(playerIndex == 0) this.scoreP0 ++;
          if(playerIndex == 1) this.scoreP1 ++;
          this.lastWinner = this.playerOnTurn;
          this.broadcastWinner(this.playerOnTurn);
          this.endGame(true);
        }
      }
      if (this.turnCount >= 8) {
        this.endGame(true);
        if (this.check(0) === false && this.check(1) === false) this.broadcastWinner(2);
      }
    }
    this.turnCount++;
    this.toggleTurn();
  }

  check(playerIndex) {
    if(this.court[0] === playerIndex) {
      if (this.court[1] === playerIndex && this.court[2] === playerIndex) {
        this.animation = 'horizontal0';
        return true;
      }
      if (this.court[3] === playerIndex && this.court[6] === playerIndex) {
        this.animation = 'vertical0';
        return true;
      }
      if (this.court[4] == playerIndex && this.court[8] === playerIndex) {
        this.animation = 'diagonal0';
        return true;
      }
    }

    if(this.court[1] === playerIndex) {
      if (this.court[4] === playerIndex && this.court[7] === playerIndex){
        this.animation = 'vertical1';
        return true;
      }
    }

    if(this.court[2] === playerIndex) {
      if (this.court[5] === playerIndex && this.court[8] === playerIndex) {
        this.animation = 'vertical2';
        return true;
      }
      if (this.court[4] === playerIndex && this.court[6] === playerIndex) {
        this.animation = 'diagonal1';
        return true;
      }
    }

    if(this.court[3] === playerIndex) {
      if (this.court[4] === playerIndex && this.court[5] === playerIndex){
        this.animation = 'horizontal1';
        return true;
      }
    }
    if(this.court[6] === playerIndex) {
      if (this.court[7] === playerIndex && this.court[8] === playerIndex) {
        this.animation = 'horizontal2';
        return true;
      }
    }
    return false;
  }
}

module.exports = MatchController;
