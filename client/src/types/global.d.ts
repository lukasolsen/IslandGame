interface SocketContext {
  createLobby(username: string): void;
  joinLobby(lobbyId: string, username: string): void;
  startGame(): void;
  doAction(action: string): void;

  player: Player;
  inLobby: boolean;
  lobby: Lobby;
  gameStarted: boolean;
}

interface Lobby {
  lobbyId: string;
  players: Player[];
  owner: Player;

  hasStarted: boolean;
  map: number[][];
}

interface Player {
  id: string;
  username: string;
  isOwner: boolean;

  position: { x: number; y: number };
  possibleMoves: string[];
}
