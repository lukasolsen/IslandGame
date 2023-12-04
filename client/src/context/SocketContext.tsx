import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
const SocketContext = createContext({} as SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [inLobby, setInLobby] = useState(false);
  const [lobby, setLobby] = useState<Lobby>({} as Lobby);
  const [player, setPlayer] = useState<Player>({} as Player); // [TODO] - Used for the game page.
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on(
      "newPlayer",
      (args: { player: { id: string; username: string } }) => {
        console.log("newPlayer", args);
      }
    );

    newSocket.on(
      "playerDisconnected",
      (args: { player: { id: string; username: string } }) => {
        console.log("playerDisconnected", args);
      }
    );

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("disconnect", () => {
        setSocket(undefined);
      });

      if (inLobby && lobby.lobbyId) {
        socket.on("lobbyUpdate", (args: Lobby) => {
          setLobby({
            lobbyId: args.lobbyId,
            players: args.players,
            owner: args.owner,
            hasStarted: args.hasStarted,
            map: args.map,
          });

          if (args.hasStarted) {
            setGameStarted(true);
            setInLobby(false);
          }
        });

        socket.on("playerUpdate", (args: Player) => {
          setPlayer(args);
        });
      }
    }
  }, [inLobby]);

  const sendToServer = (event: string, command?: object) => {
    if (socket) {
      command ? socket.emit(event, command) : socket.emit(event);
    }
  };

  const startGame = () => {
    sendToServer("startGame");
  };

  const joinLobby = (lobbyId: string, username?: string) => {
    sendToServer("joinLobby", { lobbyId, username });

    socket.once("error", (message: string) => {
      console.log(message);
      return;
    });

    socket.once("lobbyUpdate", (args: Lobby) => {
      setInLobby(true);
      setLobby({
        lobbyId: args.lobbyId,
        players: args.players,
        owner: args.owner,
        hasStarted: args.hasStarted,
        map: null,
      });
    });
  };

  const createLobby = (username: string) => {
    sendToServer("createLobby", { username: username });

    socket.once("lobbyUpdate", (args: Lobby) => {
      setInLobby(true);
      setLobby({
        lobbyId: args.lobbyId,
        players: args.players,
        owner: args.owner,
        hasStarted: args.hasStarted,
        map: null,
      });
    });
  };

  const contextValue: SocketContext = {
    joinLobby,
    createLobby,
    startGame,

    player,
    lobby,
    inLobby,
    gameStarted,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
