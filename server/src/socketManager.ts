// socketManager.ts
import { Server as SocketIOServer, Socket } from "socket.io";
import { Lobby } from "./lobby";

export class SocketManager {
  private io: SocketIOServer;
  private lobbies: Map<string, Lobby>;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.lobbies = new Map<string, Lobby>();
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on("connect", (socket: Socket) => {
      console.log("Connected client with id %s.", socket.id);

      this.handleLobbyEvents(socket);
    });
  }

  private handleLobbyEvents(socket: Socket) {
    socket.on("createLobby", (args: { username: string }) => {
      const lobbyId = Math.random().toString(36).substr(2, 5);
      console.log("Creating lobby %s", lobbyId, args.username);
      const owner = {
        id: socket.id,
        username: args.username,
        isOwner: true,

        position: { x: 0, y: 0 },
      };
      const newLobby = new Lobby(lobbyId, owner);

      this.lobbies.set(lobbyId, newLobby);

      socket.join(lobbyId);
      this.io.to(lobbyId).emit("lobbyUpdate", {
        lobbyId: lobbyId,
        players: newLobby.getPlayers(),
        owner: newLobby.owner,
      });
    });

    socket.on("joinLobby", (args: { lobbyId: string; username: string }) => {
      console.log(this.lobbies);
      console.log("Joining lobby %s", args.lobbyId, args.username);
      const lobby = this.lobbies.get(args.lobbyId);

      if (lobby) {
        if (lobby.hasGameStarted()) {
          socket.emit("error", "Game already started");
          return;
        }
        if (lobby.getPlayers().length >= 6) {
          socket.emit("error", "Lobby full");
          return;
        }
        if (lobby.getPlayers().find((p) => p.username === args.username)) {
          socket.emit("error", "Username already taken");
          return;
        }

        const newPlayer = {
          id: socket.id,
          username: args.username,
          isOwner: false,

          position: { x: 0, y: 0 },
        };
        lobby.addPlayer(newPlayer);

        this.lobbies.set(args.lobbyId, lobby);

        socket.join(args.lobbyId);
        this.io.to(lobby.id).emit("lobbyUpdate", {
          lobbyId: lobby.id,
          players: lobby.getPlayers(),
          owner: lobby.owner,
        });
      } else {
        socket.emit("error", "Lobby not found");
      }
    });

    socket.on("startGame", () => {
      console.log("Starting game");

      this.lobbies.forEach((lobby, lobbyId) => {
        if (socket.id === lobby.owner.id) {
          if (lobby.getPlayers().length < 2) {
            socket.emit("error", "Not enough players");
            return;
          } else if (lobby.hasGameStarted()) {
            socket.emit("error", "Game already started");
            return;
          }

          lobby.startGame();
          this.lobbies.set(lobbyId, lobby);
          this.io.to(lobbyId).emit("lobbyUpdate", {
            lobbyId: lobbyId,
            owner: lobby.owner,
            hasStarted: lobby.hasGameStarted(),
            map: lobby.map,
          });

          // Send a message to each player with their position
          lobby.players.forEach((player) => {
            this.io.to(player.id).emit("playerUpdate", {
              id: player.id,
              position: player.position,
              username: player.username,
              possibleMoves: lobby.getPossibleMoves(player.id),
            });
          });
        } else {
          socket.emit("error", "Only the owner can start the game");
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");

      this.lobbies.forEach((lobby, lobbyId) => {
        lobby.removePlayer(socket.id);

        if (socket.id === lobby.owner.id) {
          console.log("Lobby owner disconnected");
          this.lobbies.delete(lobbyId);
          this.io.to(lobbyId).emit("lobbyClosed");
        } else {
          this.lobbies.set(lobbyId, lobby);
          this.io.to(lobbyId).emit("lobbyUpdate", {
            lobbyId: lobbyId,
            players: lobby.getPlayers(),
            owner: lobby.owner,

            gameStarted: lobby.hasGameStarted(),
          });
        }
      });
    });
  }
}
