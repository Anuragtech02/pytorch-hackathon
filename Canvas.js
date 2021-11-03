import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styles from "./App.module.scss";
import testImage from "./assets/ReceiptSwiss.jpg";
import { output } from "./assets/output";
import axios from "axios";
import imageCompression from "browser-image-compression";

const App = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState();
  const [canvasEl, setCanvasEl] = useState();

  const [elLeft, setElLeft] = useState();
  const [elTop, setElTop] = useState();

  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const cEl = canvasRef.current;
    setCanvasEl(canvasRef.current);
    // cEl.width = cEl.clientWidth;
    // cEl.height = cEl.clientHeight;
    setElLeft(cEl.offsetLeft + cEl.clientLeft);
    setElTop(cEl.offsetTop + cEl.clientTop);

    setCtx(cEl.getContext("2d"));
  }, []);

  const drawRect = (out) => {
    const { width, height, x1, y1 } = getDimensions(out.bbox);
    console.log({ width, height, out });
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.rect(
      x1 * canvasEl.width,
      y1 * canvasEl.height,
      width * canvasEl.width,
      height * canvasEl.height
    );
    ctx.stroke();
  };

  async function compressImage(event) {
    const imageFile = event.target.files[0];
    console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      // await uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (ctx) {
      const img = new Image();
      img.src = testImage;
      img.onload = drawImageScaled.bind(null, img, ctx);

      function drawImageScaled(img, ctx) {
        var canvas = ctx.canvas;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio
        );
        const fetchData = async () => {
          console.log({
            b6: canvasEl.toDataURL("image/jpeg", 1.0).split(",")[1],
          });
          const options = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const img = new Image();
          img.src = canvasEl.toDataURL("image/jpeg", 1.0);
          const file = await imageCompression.canvasToFile(
            canvasEl,
            "image/jpeg"
          );
          const compressedFile = await imageCompression(file, options);

          const cFile = await blobToBase64(compressedFile);

          console.log({ cFile });

          const res = await axios("http://localhost:8010/proxy/ocr-deploy", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              data: cFile.split(",")[1],
            },
          });
          console.log({ res });

          res.data[0].forEach((out) => {
            drawRect(out);
          });

          setElLeft(canvas.offsetLeft + canvas.clientLeft);
          setElTop(canvas.offsetTop + canvas.clientTop);

          setBoxes(
            res.data[0].map((out) => {
              const { width, height, x1, y1 } = getDimensions(out.bbox);
              return {
                x: x1 * canvas.width,
                y: y1 * canvas.height,
                width: width * canvas.width,
                height: height * canvas.height,
              };
            })
          );
        };
        if (canvas) fetchData();
      }
    }
  }, [ctx, canvasEl]);

  useEffect(() => {
    console.log({ boxes });
  }, [boxes]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await axios(
  //       "https://asia-southeast1-acquired-vector-330317.cloudfunctions.net/ocr-deploy",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         data: canvasEl.toDataURL("image/jpeg", 1.0).split(",")[1],
  //       }
  //     );
  //     console.log({ res });
  //   };
  //   if (canvasEl) fetchData();
  // }, [canvasEl]);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        onClick={(e) => {
          var x = e.pageX - elLeft;
          var y = e.pageY - elTop;

          boxes.forEach((box) => {
            const { width, height, x: x1, y: y1 } = box;

            if (y > y1 && y < y1 + height && x > x1 && x < x1 + width) {
              alert("clicked an element " + width);
            }
          });
        }}
      ></canvas>
    </div>
  );
};

export default App;

const getDimensions = (coords) => {
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

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
