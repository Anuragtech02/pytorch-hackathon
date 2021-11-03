import { useState, useEffect, useRef } from "react";
import styles from "./Upload.module.scss";
import Dropzone from "react-dropzone";
import Grid from "@mui/material/Grid";
import galleryImage from "../../assets/gallery.svg";
import { IconButton } from "@mui/material";
import closeIcon from "../../assets/close.svg";
import Button from "@mui/material/Button";

const Upload = () => {
  const [files, setFiles] = useState([]);

  const dropzone = useRef(null);

  function handleDropFiles(acceptedFiles) {
    console.log(acceptedFiles);
    setFiles(acceptedFiles);
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
                    <input {...getInputProps()} />
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
              <h3>Advance OCR</h3>
            </header>
            <div className={styles.content}>
              <p>Selected Images</p>
              <div className={styles.images}>
                {files.map((file) => (
                  <div className={styles.image}>
                    <img src={getImageFromFile(file)} alt="gallery-item" />
                    <IconButton onClick={() => handleClickDelete(file)}>
                      <img src={closeIcon} alt="close" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="text" className={styles.btn}>
              Predict
            </Button>
          </aside>
        </Grid>
      </Grid>
    </div>
  );
};

export default Upload;

function getImageFromFile(file) {
  return URL.createObjectURL(file);
}
