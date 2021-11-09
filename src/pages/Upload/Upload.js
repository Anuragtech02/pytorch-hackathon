import { useState, useRef, useContext, useEffect } from "react";
import styles from "./Upload.module.scss";
import Dropzone from "react-dropzone";
import Grid from "@mui/material/Grid";
import galleryImage from "../../assets/gallery.svg";
import { IconButton, Modal } from "@mui/material";
import closeIcon from "../../assets/close.svg";
import Button from "@mui/material/Button";
import { GlobalContext } from "../../utils/GlobalContext";
import { withRouter } from "react-router";
import clsx from "clsx";
import receiptImage from "../../assets/receipt_1.jpg";
import formImage from "../../assets/form.png";

const Upload = ({ history }) => {
  const [files, setFiles] = useState([]);
  const [sampleOpen, setSampleOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  const options = [
    {
      id: 1,
      name: "Receipt",
      image: receiptImage,
    },
    {
      id: 2,
      name: "Form",
      image: formImage,
    },
  ];

  const dropzone = useRef(null);

  const { handleClickPredict, uploadFiles } = useContext(GlobalContext);

  useEffect(() => {
    setFiles([]);
    uploadFiles([]);
  }, [uploadFiles]);

  function handleDropFiles(acceptedFiles) {
    console.log({ acceptedFiles });
    setFiles(acceptedFiles?.slice(0, 5));
    uploadFiles(acceptedFiles?.slice(0, 5));
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
    handleClickPredict(files, "form");
    history.push("/predict");
  }

  function handleClickPredictReceipt() {
    if (!files?.length) {
      alert("Please upload at least one image");
      return;
    }
    handleClickPredict(files, "receipt");
    history.push("/predict");
  }

  function handleClickUseSample() {
    setSampleOpen(true);
  }

  function handleClickSampleOption(n) {
    setSelectedOption(n);
  }

  function imageToFile(image, props) {
    return new File([image], props.name, {
      type: props.type,
    });
  }

  function handleClickContinue() {
    const a = document.createElement("a");
    if (selectedOption === 1) {
      // const img = new Image();
      // img.src = receiptImage;
      // img.onload = () => {
      //   let fil = imageToFile(img, {
      //     name: "receipt_1.jpg",
      //     type: "image/jpg",
      //   });
      //   console.log({ fil });
      //   handleDropFiles([fil]);
      // };
      // handleClickPredictReceipt();
      // a.href="";
      a.href =
        "https://t3638486.p.clickup-attachments.com/t3638486/152453a1-fed4-4760-87d9-68d356c68555/X00016469676.jpg";
      a.click();
    } else {
      // const img = new Image();
      // img.src = formImage;
      // img.onload = () => {
      //   handleDropFiles([
      //     imageToFile(img, { name: "form.png", type: "image/png" }),
      //   ]);
      // };
      // handleClickPredictForm();
      // a.href="";
      a.href =
        "https://t3638486.p.clickup-attachments.com/t3638486/b644db6d-a329-4d56-b2b9-e9cebf855d71/00040534.png";
      a.click();
    }
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
                variant="outlined"
                className={clsx(styles.btn, styles.outlined)}
                onClick={handleClickUseSample}
              >
                Download Sample
              </Button>
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
              <p style={{ color: "rgba(0,0,0,0.4)" }}>
                * Only 5 images are allowed at a time
              </p>
            </div>
          </aside>
        </Grid>
      </Grid>
      <Modal open={sampleOpen} onClose={() => setSampleOpen(false)}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>Select Sample</h4>
            <div className={styles.options}>
              {options.map((option) => (
                <div
                  className={styles.option}
                  onClick={() => handleClickSampleOption(option.id)}
                >
                  <img
                    src={option.image}
                    alt="sample-receipt"
                    className={
                      selectedOption === option.id ? styles.selected : ""
                    }
                  />
                  <p
                    className={
                      selectedOption === option.id ? styles.selectedText : ""
                    }
                  >
                    {option.name}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="text"
              className={styles.btn}
              onClick={handleClickContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default withRouter(Upload);

function getImageFromFile(file) {
  return URL.createObjectURL(file);
}
