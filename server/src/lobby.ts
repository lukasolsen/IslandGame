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
        // Find the platform above the player
        const platformAbove = this.platformPositions.find(
          (platform) =>
            platform.x === player.position.x &&
            platform.y === player.position.y - 1
        );

        // Check if there is a platform above
        if (platformAbove) {
          // Check if there is already a player at that platform
          const playerAtPlatform = this.players.find(
            (otherPlayer) =>
              otherPlayer.position.x === platformAbove.x &&
              otherPlayer.position.y === platformAbove.y
          );

          if (playerAtPlatform) {
            console.log("Another player is already at the platform");
          } else {
            // Move the player up to the platform
            player.position.y = platformAbove.y;
            console.log(
              `Player ${playerId} moved up to platform ${player.position.y}`
            );
            this.turnSwitch();
          }
        } else {
          console.log("No platform above the player");
        }
        break;

      case "down":
        // Find the platform below the player
        const platformBelow = this.platformPositions.find(
          (platform) =>
            platform.x === player.position.x &&
            platform.y === player.position.y + 1
        );

        // Check if there is a platform below
        if (platformBelow) {
          // Check if there is already a player at that platform
          const playerAtPlatform = this.players.find(
            (otherPlayer) =>
              otherPlayer.position.x === platformBelow.x &&
              otherPlayer.position.y === platformBelow.y
          );

          if (playerAtPlatform) {
            console.log("Another player is already at the platform");
          } else {
            // Move the player down to the platform
            player.position.y = platformBelow.y;
            console.log(
              `Player ${playerId} moved down to platform ${player.position.y}`
            );
            this.turnSwitch();
          }
        } else {
          console.log("No platform below the player");
        }
        break;

      case "left":
        // Find the platform left of the player
        const platformLeft = this.platformPositions.find(
          (platform) =>
            platform.x === player.position.x - 1 &&
            platform.y === player.position.y
        );

        // Check if there is a platform left
        if (platformLeft) {
          // Check if there is already a player at that platform
          const playerAtPlatform = this.players.find(
            (otherPlayer) =>
              otherPlayer.position.x === platformLeft.x &&
              otherPlayer.position.y === platformLeft.y
          );

          if (playerAtPlatform) {
            console.log("Another player is already at the platform");
          } else {
            // Move the player left to the platform
            player.position.x = platformLeft.x;
            console.log(
              `Player ${playerId} moved left to platform ${player.position.x}`
            );
            this.turnSwitch();
          }
        } else {
          console.log("No platform left of the player");
        }
        break;

      case "right":
        // Find the platform right of the player
        const platformRight = this.platformPositions.find(
          (platform) =>
            platform.x === player.position.x + 1 &&
            platform.y === player.position.y
        );

        // Check if there is a platform right
        if (platformRight) {
          // Check if there is already a player at that platform
          const playerAtPlatform = this.players.find(
            (otherPlayer) =>
              otherPlayer.position.x === platformRight.x &&
              otherPlayer.position.y === platformRight.y
          );

          if (playerAtPlatform) {
            console.log("Another player is already at the platform");
          } else {
            // Move the player right to the platform
            player.position.x = platformRight.x;
            console.log(
              `Player ${playerId} moved right to platform ${player.position.x}`
            );
            this.turnSwitch();
          }
        } else {
          console.log("No platform right of the player");
        }
        break;
      // Add other cases for different moves if needed

      default:
        console.error("Invalid move");
    }
  }

  getPossibleMoves(playerId: string) {
    const player = this.players.find((player) => player.id === playerId);

    const possibleMoves = [];

    // Check if there is a platform around the player.
    // If there is, check if there is a player on the platform.

    // Check above
    const platformAbove = this.platformPositions.find(
      (platform) =>
        platform.x === player.position.x && platform.y === player.position.y - 1
    );

    if (platformAbove) {
      const playerAtPlatform = this.players.find(
        (otherPlayer) =>
          otherPlayer.position.x === platformAbove.x &&
          otherPlayer.position.y === platformAbove.y
      );

      if (!playerAtPlatform) {
        possibleMoves.push("up");
      }
    }

    // Check below
    const platformBelow = this.platformPositions.find(
      (platform) =>
        platform.x === player.position.x && platform.y === player.position.y + 1
    );

    if (platformBelow) {
      const playerAtPlatform = this.players.find(
        (otherPlayer) =>
          otherPlayer.position.x === platformBelow.x &&
          otherPlayer.position.y === platformBelow.y
      );

      if (!playerAtPlatform) {
        possibleMoves.push("down");
      }
    }

    // Check left
    const platformLeft = this.platformPositions.find(
      (platform) =>
        platform.x === player.position.x - 1 && platform.y === player.position.y
    );

    if (platformLeft) {
      const playerAtPlatform = this.players.find(
        (otherPlayer) =>
          otherPlayer.position.x === platformLeft.x &&
          otherPlayer.position.y === platformLeft.y
      );

      if (!playerAtPlatform) {
        possibleMoves.push("left");
      }
    }

    // Check right

    const platformRight = this.platformPositions.find(
      (platform) =>
        platform.x === player.position.x + 1 && platform.y === player.position.y
    );

    if (platformRight) {
      const playerAtPlatform = this.players.find(
        (otherPlayer) =>
          otherPlayer.position.x === platformRight.x &&
          otherPlayer.position.y === platformRight.y
      );

      if (!playerAtPlatform) {
        possibleMoves.push("right");
      }
    }

    return possibleMoves;
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
