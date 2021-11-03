export const getDimensions = (coords) => {
  const x1 = coords[0][0];
  const x2 = coords[1][0];
  const x3 = coords[2][0];
  const x4 = coords[3][0];

  const y1 = coords[0][1];
  const y2 = coords[1][1];
  const y3 = coords[2][1];
  const y4 = coords[3][1];

  return {
    width: Math.abs(x3 - x1),
    height: Math.abs(y3 - y1),
    x1,
    y1,
  };
};

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
