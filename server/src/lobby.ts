import { generationTerrain } from "./Map/generation";

interface Player {
  id: string;
  username: string;
  isOwner: boolean;

  position: { x: number; y: number };
}

export class Lobby {
  public id: string;
  public players: Player[];
  public owner: Player;
  public gameStarted: boolean;
  public map: number[][];
  public platformPositions: { x: number; y: number }[];
  public turnId: string;

  constructor(id: string, owner: Player) {
    this.id = id;
    this.players = [owner];
    this.owner = owner;
    this.gameStarted = false;
  }

  getPlayers() {
    // Remove coordinates from players
    return this.players.map((player) => ({
      id: player.id,
      username: player.username,
      isOwner: player.isOwner,
    }));
  }

  startGame() {
    this.gameStarted = true;

    // Generate Map
    const generatedMap = generationTerrain(1000, 800);
    this.map = generatedMap.terrainData;
    this.platformPositions = generatedMap.platformPositions;

    // Generate player positions
    const playerPositions = [];
    // Has to be at one of the platform positions.
    // Only 1 player per platform position.
    for (let i = 0; i < this.players.length; i++) {
      const randomIndex = Math.floor(
        Math.random() * this.platformPositions.length
      );
      const randomPlatformPosition = this.platformPositions[randomIndex];
      this.platformPositions.splice(randomIndex, 1);
      playerPositions.push(randomPlatformPosition);
    }

    // Assign player positions
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].position = playerPositions[i];
    }

    // Set turn
    this.turnId = this.players[0].id;
  }

  turnSwitch() {
    const currentTurnIndex = this.players.findIndex(
      (player) => player.id === this.turnId
    );
    if (currentTurnIndex === -1) {
      return console.error("Player not found");
    }

    const nextTurnIndex = (currentTurnIndex + 1) % this.players.length;
    this.turnId = this.players[nextTurnIndex].id;
  }

  doAction(playerId: string, move: string) {
    // Check if it's the player's turn
    if (playerId !== this.turnId) {
      return console.error("Not your turn");
    }

    const player = this.players.find((player) => player.id === playerId);

    switch (move) {
      case "up":
        const platformAbove = this.findPlatformNearby(
          player.position.x,
          player.position.y - 1
        );

        if (platformAbove) {
          if (this.players.find((p) => p.position === platformAbove)) {
            return console.error("Player already on platform");
          }

          this.players.find((p) => p.id === playerId).position = platformAbove;
        }
        break;
      case "down":
        const platformBelow = this.findPlatformNearby(
          player.position.x,
          player.position.y + 1
        );

        if (platformBelow) {
          if (this.players.find((p) => p.position === platformBelow)) {
            return console.error("Player already on platform");
          }

          this.players.find((p) => p.id === playerId).position = platformBelow;
        }
        break;
      case "left":
        const platformLeft = this.findPlatformNearby(
          player.position.x - 1,
          player.position.y
        );

        if (platformLeft) {
          if (this.players.find((p) => p.position === platformLeft)) {
            return console.error("Player already on platform");
          }

          this.players.find((p) => p.id === playerId).position = platformLeft;
        }
        break;
      case "right":
        const platformRight = this.findPlatformNearby(
          player.position.x + 1,
          player.position.y
        );

        if (platformRight) {
          if (this.players.find((p) => p.position === platformRight)) {
            return console.error("Player already on platform");
          }

          this.players.find((p) => p.id === playerId).position = platformRight;
        }
        break;
    }
  }

  getPossibleMoves(playerId: string) {
    const player = this.players.find((p) => p.id === playerId);

    if (!player) {
      return []; // Player not found
    }

    const possibleMoves = [];

    // Check above
    const platformAbove = this.findPlatformNearby(
      player.position.x,
      player.position.y - 1
    );
    if (platformAbove) {
      possibleMoves.push("up");
    }

    // Check below
    const platformBelow = this.findPlatformNearby(
      player.position.x,
      player.position.y + 1
    );
    if (platformBelow) {
      possibleMoves.push("down");
    }

    // Check left
    const platformLeft = this.findPlatformNearby(
      player.position.x - 1,
      player.position.y
    );
    if (platformLeft) {
      possibleMoves.push("left");
    }

    // Check right
    const platformRight = this.findPlatformNearby(
      player.position.x + 1,
      player.position.y
    );
    if (platformRight) {
      possibleMoves.push("right");
    }

    return possibleMoves;
  }

  findPlatformNearby(x: number, y: number) {
    const maxDistance = 1000;

    for (const platform of this.platformPositions) {
      const distance = Math.sqrt((platform.x - x) ** 2 + (platform.y - y) ** 2);
      if (distance <= maxDistance) {
        return platform;
      }
    }

    return null;
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
