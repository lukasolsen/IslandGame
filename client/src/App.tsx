import React from "react";
import { useSocket } from "./context/SocketContext";
import Lobby from "./page/Lobby";
import Game from "./page/Game";

const App: React.FC = () => {
  const {
    inLobby,
    createLobby,
    joinLobby,
    lobby,
    startGame,
    gameStarted,
    player,
    doAction,
  } = useSocket();
  const [option, setOption] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");

  const [lobbyId, setLobbyId] = React.useState<string>("");

  console.log(player);

  return (
    <div className="flex bg-white flex-row w-screen h-full">
      {!gameStarted && inLobby && <Lobby lobby={lobby} startGame={startGame} />}

      {!inLobby && gameStarted && (
        <div className="w-full h-full">
          <Game terrainData={lobby.map} player={player} doAction={doAction} />
        </div>
      )}

      {!gameStarted && !inLobby && (
        <div className="w-full h-full">
          <h3>You are not in a lobby.</h3>
          {!option && (
            <div className="flex flex-row justify-evenly items-center w-6/12">
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setOption("create");
                  }}
                >
                  Create Lobby
                </button>
              </div>
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setOption("join");
                  }}
                >
                  Join Lobby
                </button>
              </div>
            </div>
          )}

          {option === "create" && (
            <div className="flex flex-col justify-center items-center w-full h-full gap-2">
              <h3>Create a lobby</h3>
              <input
                className="border border-gray-400 rounded-md w-4/12 p-2"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  createLobby(username);
                }}
              >
                Create
              </button>
            </div>
          )}

          {option === "join" && (
            <div className="flex flex-col justify-center items-center w-full h-full gap-2">
              <h3>Join a lobby</h3>
              <input
                className="border border-gray-400 rounded-md w-4/12 p-2"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="border border-gray-400 rounded-md w-4/12 p-2"
                placeholder="Lobby ID"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  joinLobby(lobbyId, username);
                }}
              >
                Join
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
