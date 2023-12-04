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
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const terrainColor = terrainData[x][y];

          ctx.fillStyle = `rgb(${terrainColor[0]}, ${terrainColor[1]}, ${terrainColor[2]})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Draw platform positions
      /*ctx.fillStyle = "white"; // Adjust color as needed
      platformPositions.forEach((position) => {
        ctx.fillRect(position.x, position.y, 25, 25);
      });*/

      // Draw players
      // Players have a position (most likely a platformPosition), just use the Player component we have.
      // We can also use the player's position to draw a circle or something.

      // Draw player
      ctx.fillStyle = "blue"; // Adjust color as needed
      ctx.fillRect(player.position.x, player.position.y, 15, 15);

      // Draw player's name
      //ctx.fillStyle = "white";
      //ctx.font = "12px Arial";
      //ctx.fillText(player.username, player.position.x, player.position.y - 10);
    };

    draw();
  }, [width, height, terrainData, player]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

type GameProps = {
  terrainData: number[][];
  player: Player;
};

const Game: React.FC<GameProps> = ({ terrainData, player }) => {
  console.log(player);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
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
