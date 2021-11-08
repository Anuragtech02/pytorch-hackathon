import imageCompression from "browser-image-compression";

export function getDimensions(coords) {
  const x1 = coords[0];
  const x3 = coords[2];

  const y1 = coords[1];
  const y3 = coords[3];

  return {
    width: Math.abs(x3 - x1),
    height: Math.abs(y3 - y1),
    x1,
    y1,
  };
}

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export async function compressImage(file) {
  const imageFile = file;

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    return await imageCompression(imageFile, options);
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime });
};

export const colors = {
  company: "blue",
  address: "green",
  total: "orange",
  "#other": "rgb(145 145 145)",
  date: "violet",
  question: "blue",
  answer: "green",
  header: "orange",
};
