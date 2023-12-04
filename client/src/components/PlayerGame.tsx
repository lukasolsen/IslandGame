type PlayerProps = {
  name: string;
  role: string;
  isLocal: boolean;

  position: { x: number; y: number };
};

const Player: React.FC<PlayerProps> = ({ name, role, isLocal }) => {
  return (
    <>
      {isLocal && (
        <div className="bg-red-500 rounded-full w-4 h-4">
          <p className="text-white">
            {name} - {role}
          </p>
        </div>
      )}

      {!isLocal && <div className="bg-gray-500 rounded-full w-4 h-4"></div>}
    </>
  );
};

export default Player;
