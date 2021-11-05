import { useState, useRef, useEffect, useContext } from "react";
import styles from "./Result.module.scss";
import { Icon, IconButton } from "@mui/material";
import { CircularProgress, Grid } from "@mui/material";
import { getDimensions, colors } from "../../utils/utility";
import { GlobalContext } from "../../utils/GlobalContext";
import receipt1 from "../../assets/output_receipt_1.json";
import receipt2 from "../../assets/output_receipt_2.json";
import form from "../../assets/form.json";
import copyIcon from "../../assets/copy.svg";

const Result = () => {
  const [currentImage, setCurrentImage] = useState();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { result, encodedFiles, files } = useContext(GlobalContext);

  const [currentResult, setCurrentResult] = useState(() => {
    if (localStorage.getItem("current") === "form") {
      return form;
    } else {
      return receipt1;
    }
  });

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
    // console.log({ testRes });
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

  const drawRect = (out, color) => {
    const { width, height, x1, y1 } = getDimensions(out.bbox);
    // console.log({ width, height, out });
    ctx.beginPath();
    ctx.strokeStyle = color || "green";
    ctx.lineWidth = color === "rgb(145 145 145)" ? 1 : 2;
    ctx.rect(
      x1 * canvasEl.width,
      y1 * canvasEl.height,
      width * canvasEl.width,
      height * canvasEl.height
    );
    ctx.stroke();
  };

  useEffect(() => {
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
        currentResult.predictions.forEach((out) => {
          //   if (out.key[0] !== "#other") {
          drawRect(out, colors[out.key[0]]);
          //   }
        });
        setElLeft(canvas.offsetLeft + canvas.clientLeft);
        setElTop(canvas.offsetTop + canvas.clientTop);
        setBoxes(
          currentResult.predictions
            .filter((it) => it.key[0] !== "#other")
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
  }, [ctx, canvasEl, currentImage, result, currentImageIndex, currentResult]);

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
    const what = localStorage.getItem("current");
    if (what === "receipt") {
      setCurrentResult(index === 0 ? receipt1 : receipt2);
    } else {
      setCurrentResult(form);
    }
  }

  return (
    <div className={styles.container}>
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item md={1}>
          <div className={styles.imagesContainer}>
            <div className={styles.images}>
              {files?.map((image, i) => (
                <div
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
                  ? currentResult.predictions
                      .filter((it) => it.key[0] !== "#other")
                      .map((res, i) => (
                        <div className={styles.resultItem}>
                          <p style={{ color: colors[res.key[0]] }}>
                            {res.key[0]}
                          </p>
                          <p>{res.ocr[0]}</p>
                          {/* <p>{parseFloat(parseFloat(res.ocr[1]).toFixed(2)) * 100}</p> */}
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

export default Result;

function getImageFromFile(file) {
  return URL.createObjectURL(file);
}
