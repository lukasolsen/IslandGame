import { Noise } from "./utils/noise";
import { getTerrainColor } from "./utils/utils";

class TerrainType {
  public minHeight: number;
  public maxHeight: number;
  public minColor: number[];
  public maxColor: number[];
  public lerpAdjustment: number;

  constructor(minHeight, maxHeight, minColor, maxColor, lerpAdjustment = 2) {
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.minColor = minColor;
    this.maxColor = maxColor;
    this.lerpAdjustment = lerpAdjustment;
  }
}

const waterTerrain = new TerrainType(0.2, 0.4, [30, 176, 251], [40, 255, 255]);
const sandTerrain = new TerrainType(
  0.4,
  0.5,
  [215, 192, 158],
  [255, 246, 193],
  0.3
);
const grassTerrain = new TerrainType(0.5, 0.7, [2, 166, 155], [0, 239, 124]);
const rockTerrain = new TerrainType(0.7, 0.8, [100, 100, 100], [150, 150, 150]);
const generationTerrain = (
  width: number = 500,
  height: number = 500
): {
  terrainData: number[][];
  platformPositions: { x: number; y: number }[];
} => {
  const terrainData: number[][] = [];
  const platformPositions: { x: number; y: number }[] = [];

  // Maximum number of platforms
  const maxPlatforms = 20;

  for (let x = 0; x < width; x++) {
    terrainData[x] = [];
    for (let y = 0; y < height; y++) {
      const noiseValue = Noise(x / 100, y / 100);

      let terrainColor;
      if (noiseValue < waterTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, waterTerrain);
      } else if (noiseValue < sandTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, sandTerrain);
      } else if (noiseValue < grassTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, grassTerrain);
      } else {
        terrainColor = getTerrainColor(noiseValue, rockTerrain);
        // Assume platforms are on rocks, adjust as needed
        if (Math.random() < 0.01 && platformPositions.length < maxPlatforms) {
          // Ensure platforms are spaced out
          if (
            platformPositions.every(
              (position) =>
                Math.abs(position.x - x) > 25 && Math.abs(position.y - y) > 25
            )
          ) {
            platformPositions.push({ x, y });
          }
        }
      }

      // Save the terrain color data to terrainData
      terrainData[x][y] = terrainColor;
    }
  }

  return { terrainData, platformPositions };
};

export { generationTerrain };
