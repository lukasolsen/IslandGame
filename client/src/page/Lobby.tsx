type LobbyProps = {
  lobby: Lobby;
  startGame: () => void;
};

const Lobby: React.FC<LobbyProps> = ({ lobby, startGame }) => {
  console.log(lobby);
  return (
    <div className="bg-gray-700 w-full h-full">
      {!lobby && <p>Loading...</p>}
      {!lobby.players && <p>Loading...</p>}
      {lobby?.lobbyId ? (
        <div className="h-24 text-white">
          <div className="flex flex-row justify-evenly items-center h-full">
            <h2>Lobby ID: {lobby.lobbyId}</h2>

            <div className="flex flex-row gap-8 items-center w-6/12">
              {lobby.players.map((player: Player) => {
                return (
                  <div className="bg-blue-400 rounded-full w-4 h-4 p-4 flex justify-center items-center">
                    {player.username}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col h-full justify-evenly">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
                startGame();
              }}>
                Start Game
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Leave Lobby
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Lobby;
