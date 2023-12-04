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

export { getTerrainColor };
