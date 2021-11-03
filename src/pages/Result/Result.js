import { useState, useRef, useEffect, useContext } from "react";
import styles from "./Result.module.scss";
import { IconButton } from "@mui/material";
import { CircularProgress, Grid } from "@mui/material";
import { getDimensions } from "../../utils/utility";
import { GlobalContext } from "../../utils/GlobalContext";

const Result = () => {
  const [currentImage, setCurrentImage] = useState();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { result, encodedFiles, files } = useContext(GlobalContext);

  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState();
  const [canvasEl, setCanvasEl] = useState();

  const [elLeft, setElLeft] = useState();
  const [elTop, setElTop] = useState();

  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const cEl = canvasRef.current;
    setCanvasEl(canvasRef.current);
    setElLeft(cEl.offsetLeft + cEl.clientLeft);
    setElTop(cEl.offsetTop + cEl.clientTop);

    setCtx(cEl.getContext("2d"));
  }, []);

  useEffect(() => {
    console.log({ result });
  }, [result]);

  useEffect(() => {
    if (encodedFiles?.length) {
      console.log({ encodedFiles });
      setCurrentImage(getImageFromFile(files[0]));
      setCurrentImageIndex(0);
    }
  }, [encodedFiles, files]);

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

  useEffect(() => {
    if (ctx) {
      const img = new Image();
      img.src = currentImage;
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
        if (canvas && result?.length) draw(canvas);
      }
      const draw = async (canvas) => {
        result[currentImageIndex].data[0].forEach((out) => {
          drawRect(out);
        });
        setElLeft(canvas.offsetLeft + canvas.clientLeft);
        setElTop(canvas.offsetTop + canvas.clientTop);
        setBoxes(
          result[currentImageIndex].data[0].map((out) => {
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
    }
  }, [ctx, canvasEl, currentImage, result, currentImageIndex]);

  //   useEffect(() => {
  //     if(result?.length){
  //       setBoxes(
  //             result.data[0].map((out) => {
  //               const { width, height, x1, y1 } = getDimensions(out.bbox);
  //               return {
  //                 x: x1 * canvas.width,
  //                 y: y1 * canvas.height,
  //                 width: width * canvas.width,
  //                 height: height * canvas.height,
  //               };
  //             })
  //           );
  //     }
  //   }, [result]);

  function handleClickImage(index) {
    setCurrentImage(getImageFromFile(files[index]));
    setCurrentImageIndex(index);
  }

  return (
    <div className={styles.container}>
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item md={1}>
          <div className={styles.imagesContainer}>
            <div className={styles.images}>
              {files?.map((image, i) => (
                <div className={styles.imageItem}>
                  <IconButton onClick={() => handleClickImage(i)}>
                    <img src={getImageFromFile(image)} alt="item" />
                  </IconButton>
                  {!result[i] && (
                    <div className={styles.progress}>
                      <CircularProgress />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Grid>
        <Grid item md={8}>
          <div className={styles.canvasContainer}>
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
        </Grid>
        <Grid item md={3}>
          <div className={styles.resultContainer}>
            <header>
              <h3>Advance OCR</h3>
            </header>
            <div className={styles.content}>
              <p>Predicted Result</p>
              <div className={styles.result}>
                {result[currentImageIndex]?.data[0]?.reverse().map((res, i) => (
                  <div className={styles.resultItem}>
                    <p>{res.key[0]}</p>
                    <p>{res.ocr[0]}</p>
                    {/* <p>{parseFloat(parseFloat(res.ocr[1]).toFixed(2)) * 100}</p> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Result;

function getImageFromFile(file) {
  return URL.createObjectURL(file);
}
