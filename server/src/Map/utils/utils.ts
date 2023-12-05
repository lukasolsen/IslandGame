const normalize = (value, max, min) => {
  if (value > max) {
    return 1;
  }
  if (value < min) {
    return 0;
  }
  return (value - min) / (max - min);
};

const getTerrainColor = (noiseValue, mapType) => {
  const normalized = normalize(
    noiseValue,
    mapType.maxHeight,
    mapType.minHeight
  );
  return lerpColor(
    mapType.minColor,
    mapType.maxColor,
    normalized + mapType.lerpAdjustment
  );
};

const lerpColor = (color1, color2, weight) => {
  return color1.map((channel, i) =>
    Math.round((1 - weight) * channel + weight * color2[i])
  );
};

const findPlatformNearby = (platformPositions, x: number, y: number) => {
  const maxDistance = 1000;

  // The player is already on a platform, so remove that from the list
  const playerPlatform = platformPositions.find(
    (platform) => platform.x === x && platform.y === y
  );
  if (playerPlatform) {
    platformPositions.splice(platformPositions.indexOf(playerPlatform), 1);
  }

  for (const platform of platformPositions) {
    const distance = Math.sqrt((platform.x - x) ** 2 + (platform.y - y) ** 2);
    if (distance <= maxDistance) {
      console.log("Found platform nearby", platform);
      return platform;
    }
  }

  return null;
};

export { getTerrainColor, findPlatformNearby };
