import React, { useEffect, useRef } from "react";

type TerrainProps = {
  terrainData: number[][];
  player: Player;
  width: number;
  height: number;
};

const TerrainMap: React.FC<TerrainProps> = ({
  terrainData,
  width,
  height,
  player,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      // Draw terrain
      for (let x = player.position.x - 200; x < player.position.x + 200; x++) {
        for (
          let y = player.position.y - 200;
          y < player.position.y + 200;
          y++
        ) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            const terrainColor = terrainData[x][y];

            ctx.fillStyle = `rgb(${terrainColor[0]}, ${terrainColor[1]}, ${terrainColor[2]})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      // Draw players
      ctx.fillStyle = "blue"; // Adjust color as needed
      const playerSize = 15;
      ctx.fillRect(
        player.position.x - playerSize / 2,
        player.position.y - playerSize / 2,
        playerSize,
        playerSize
      );

      // Apply radial gradient for fog effect
      const gradient = ctx.createRadialGradient(
        player.position.x,
        player.position.y,
        0,
        player.position.x,
        player.position.y,
        200
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)"); // Transparent at the center
      gradient.addColorStop(1, "rgba(0,0,0,1)"); // Opaque at the outer edge

      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(
        player.position.x - 500,
        player.position.y - 500,
        width,
        height
      );
      ctx.globalCompositeOperation = "source-over";
    };

    draw();
  }, [width, height, terrainData, player]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-800"
    />
  );
};

type GameProps = {
  terrainData: number[][];
  player: Player;
  doAction: (action: string) => void;
};

const Game: React.FC<GameProps> = ({ terrainData, player, doAction }) => {
  console.log(player);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="grid grid-cols-3 grid-rows-2 gap-4 absolute bottom-40 select-none">
        <div className="col-start-2">
          <button
            disabled={!player.possibleMoves.includes("up")}
            onClick={() => doAction("up")}
          >
            up
          </button>
        </div>
        <div className="row-start-2">
          <button
            disabled={!player.possibleMoves.includes("left")}
            onClick={() => doAction("left")}
          >
            left
          </button>
        </div>
        <div className="row-start-2">
          <button
            disabled={!player.possibleMoves.includes("down")}
            onClick={() => doAction("down")}
          >
            down
          </button>
        </div>
        <div className="row-start-2">
          <button
            className=""
            disabled={!player.possibleMoves.includes("right")}
            onClick={() => doAction("right")}
          >
            right
          </button>
        </div>
      </div>

      {terrainData && player.position && (
        <TerrainMap
          terrainData={terrainData}
          player={player}
          width={1000}
          height={800}
        />
      )}
    </div>
  );
};

export default Game;
