import { useState, useRef, useEffect, useContext } from "react";
import styles from "./Result.module.scss";
import { IconButton } from "@mui/material";
import { CircularProgress, Grid } from "@mui/material";
import { getDimensions, colors } from "../../utils/utility";
import { GlobalContext } from "../../utils/GlobalContext";
import { withRouter } from "react-router";
import axios from "axios";

const Result = ({ history }) => {
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
    // const getSomething = async () => {
    //   return await axios.get(
    //     "http://localhost:5000/predict",
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // };
    // getSomething().then((res) => {
    //   console.log({ res });
    // });
  }, [encodedFiles, files]);

  useEffect(() => {
    const drawRect = (out, color) => {
      const { width, height, x1, y1 } = getDimensions(out.bbox);
      ctx.beginPath();
      ctx.strokeStyle = color || "green";
      ctx.lineWidth = color === "rgb(145 145 145)" ? 2 : 3;
      ctx.rect(
        x1 * canvasEl.width,
        y1 * canvasEl.height,
        width * canvasEl.width,
        height * canvasEl.height
      );
      ctx.stroke();
    };

    if (ctx && currentImage) {
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
        // if (canvas) draw(canvas);
      }
      const draw = async (canvas) => {
        result[currentImageIndex]?.data?.predictions?.forEach((out) => {
          //   if (out.key[0] !== "#other") {
          drawRect(out, colors[out.key]);
          //   }
        });
        setElLeft(canvas.offsetLeft + canvas.clientLeft);
        setElTop(canvas.offsetTop + canvas.clientTop);
        setBoxes(
          result[currentImageIndex]?.data?.predictions
            ?.filter((it) => it.key !== "#other")
            .map((out) => {
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

  useEffect(() => {
    if (!files.length) {
      history.push("/");
    }
  }, [files, history]);

  function handleClickImage(index) {
    setCurrentImage(getImageFromFile(files[index]));
    setCurrentImageIndex(index);
    // const what = localStorage.getItem("current");
    // if (what === "receipt") {
    //   setCurrentResult(index === 0 ? receipt1 : receipt2);
    // } else {
    //   setCurrentResult(form);
    // }
  }

  return (
    <div className={styles.container}>
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item md={1}>
          <div className={styles.imagesContainer}>
            <div className={styles.images}>
              {files?.map((image, i) => (
                <div
                  key={i}
                  className={styles.imageItem}
                  style={{
                    background:
                      currentImageIndex === i ? "#e6cbfb" : "transparent",
                  }}
                >
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
              <h3>Document Extraction Tool</h3>
            </header>
            <div className={styles.content}>
              <div className={styles.contentHead}>
                <p>Predicted Result</p>
                {/* <IconButton>
                  <img src={copyIcon} alt="copy" />
                </IconButton> */}
              </div>
              <div className={styles.result}>
                {result?.length
                  ? result[currentImageIndex]?.data?.predictions
                      .filter((it) => it.key !== "#other")
                      .map((res, i) => (
                        <div key={res.ocr + i} className={styles.resultItem}>
                          <p style={{ color: colors[res.key] }}>{res.key}</p>
                          <p>{res.ocr}</p>
                        </div>
                      ))
                  : null}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(Result);

function getImageFromFile(file) {
  return URL.createObjectURL(file);
}
