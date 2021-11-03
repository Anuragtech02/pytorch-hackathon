import imageCompression from "browser-image-compression";

export function getDimensions(coords) {
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
  // console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
  // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    return await imageCompression(imageFile, options);
    //   console.log(
    //     "compressedFile instanceof Blob",
    //     compressedFile instanceof Blob
    //   ); // true
    //   console.log(
    //     `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
    //   ); // smaller than maxSizeMB

    // await uploadToServer(compressedFile); // write your own logic
  } catch (error) {
    console.log(error);
    return error;
  }
}

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
