interface SocketContext {
  createLobby(username: string): void;
  joinLobby(lobbyId: string, username: string): void;
  startGame(): void;

  inLobby: boolean;
  lobby: Lobby;
  gameStarted: boolean;
}

interface Lobby {
  lobbyId: string;
  players: Player[];
  owner: Player;

  hasStarted: boolean;
}

interface Player {
  id: string;
  username: string;
  isOwner: boolean;
}
