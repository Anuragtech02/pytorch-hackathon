import { useState, useRef, useContext } from "react";
import styles from "./Upload.module.scss";
import Dropzone from "react-dropzone";
import Grid from "@mui/material/Grid";
import galleryImage from "../../assets/gallery.svg";
import { IconButton } from "@mui/material";
import closeIcon from "../../assets/close.svg";
import Button from "@mui/material/Button";
import { GlobalContext } from "../../utils/GlobalContext";
import { withRouter } from "react-router";

const Upload = ({ history }) => {
  const [files, setFiles] = useState([]);

  const dropzone = useRef(null);

  const { handleClickPredict, uploadFiles } = useContext(GlobalContext);

  function handleDropFiles(acceptedFiles) {
    setFiles(acceptedFiles);
    uploadFiles(acceptedFiles);
    if (dropzone.current) {
      dropzone.current.style.backgroundColor = "var(--clr-bg-light)";
    }
  }

  function handleDrag(e) {
    if (dropzone.current) {
      dropzone.current.style.backgroundColor = "#f2e9fa";
    }
  }

  function leaveDrag(e) {
    if (dropzone.current) {
      dropzone.current.style.backgroundColor = "var(--clr-bg-light)";
    }
  }

  function handleClickDelete(file) {
    setFiles(files.filter((f) => f !== file));
  }

  function handleClickPredictForm() {
    if (!files?.length) {
      alert("Please upload at least one image");
      return;
    }
    handleClickPredict(files);
    history.push("/predict");
  }

  function handleClickPredictReceipt() {
    if (!files?.length) {
      alert("Please upload at least one image");
      return;
    }
    handleClickPredict(files);
    history.push("/predict");
  }

  return (
    <div className={styles.container}>
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item md={9}>
          <div className={styles.uploadContainer}>
            <Dropzone
              onDrop={handleDropFiles}
              onDragOver={handleDrag}
              onDragLeave={leaveDrag}
            >
              {({ getRootProps, getInputProps }) => (
                <section ref={dropzone}>
                  <div {...getRootProps()}>
                    <input
                      {...getInputProps()}
                      accept="image/png, image/jpg, image/jpeg, image/webp"
                    />
                    <div className={styles.info}>
                      <img src={galleryImage} alt="gallery" />

                      <p>Drag & Drop to upload image(s)</p>
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        </Grid>
        <Grid item md={3}>
          <aside className={styles.sidebarImages}>
            <header>
              <h3>Document Extraction Tool</h3>
            </header>
            <div className={styles.content}>
              <p>Selected Images</p>
              <div className={styles.images}>
                {files.map((file, i) => (
                  <div key={i} className={styles.image}>
                    <img src={getImageFromFile(file)} alt="gallery-item" />
                    <IconButton onClick={() => handleClickDelete(file)}>
                      <img src={closeIcon} alt="close" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.btns}>
              <Button
                variant="text"
                className={styles.btn}
                onClick={handleClickPredictForm}
              >
                Predict Form
              </Button>
              <Button
                variant="text"
                className={styles.btn}
                onClick={handleClickPredictReceipt}
              >
                Predict Receipt
              </Button>
            </div>
          </aside>
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(Upload);

function getImageFromFile(file) {
  return URL.createObjectURL(file);
}
