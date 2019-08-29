class player {
  constructor (name, sock) {
    this._name = name;
    this._sock = sock;
  }

  get name() {
    return this._name;
  }

  get sock() {
    return this._sock;
  }
}

module.exports = player;
