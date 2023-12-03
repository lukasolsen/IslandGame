interface Player {
  id: string;
  username: string;
  isOwner: boolean;
}

export class Lobby {
  public id: string;
  public players: Player[];
  public owner: Player;
  public gameStarted: boolean;

  constructor(id: string, owner: Player) {
    this.id = id;
    this.players = [owner];
    this.owner = owner;
    this.gameStarted = false;
  }

  startGame() {
    this.gameStarted = true;
  }

  hasGameStarted() {
    return this.gameStarted;
  }

  addPlayer(player: Player) {
    console.log("Adding player %s to lobby %s", player.username, this.id);
    this.players.push(player);
  }

  removePlayer(playerId: string) {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }
}
