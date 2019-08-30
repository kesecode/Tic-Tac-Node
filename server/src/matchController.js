class MatchController {
  constructor(p1, p2) {
    this._players = [p1, p2];
    this._turns = [null, null];
    this._court = [2][2];

    this._sendMatchParameters();
    this._sendToPlayers('Match starts!');
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
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

  _sendMatchParameters() {
    this._players.forEach((player) => {
      player.emit('matchparameter', this._players[0].id);
    });
  }

  //turn would be the coordinates of the selected fields passed as array
  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `You selected the field: ${turn}`);
  }
}

module.exports = MatchController;
