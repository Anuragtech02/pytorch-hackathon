import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { compressImage, blobToBase64, dataURLtoFile } from "./utility";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [encodedFiles, setEncodedFiles] = useState([]);
  const [result, setResult] = useState([]);

  async function handleClickPredict(files = []) {
    const compressedFiles = await Promise.all(files.map(compressImage));
    const convertedFiles = await Promise.all(compressedFiles.map(blobToBase64));

    setEncodedFiles(convertedFiles);
  }

  async function getResult(b64File) {
    const headers = {
      // Accept: "application/json",
      "Content-Type": "multipart/form-data",
      // "Content-Security-Policy": "upgrade-insecure-requests",
    };
    const formData = new FormData();
    const file = dataURLtoFile(b64File);
    formData.append("data", file, file.name);
    return await axios.post(
      "http://164.52.218.27:7080/wfpredict/ocr",
      formData,
      {
        headers,
      }
    );
  }

  useEffect(() => {
    async function getResults() {
      const results = await Promise.all(encodedFiles.map(getResult));
      setResult(results);
    }
    let flag = true;
    if (encodedFiles?.length === files?.length) {
      encodedFiles?.forEach((f) => {
        if (f.then) {
          flag = false;
        }
      });
      // console.log({ encodedFiles });
      if (flag) {
        getResults();
      }
    }
  }, [encodedFiles, files]);

  return (
    <GlobalContext.Provider
      value={{
        handleClickPredict,
        encodedFiles,
        result,
        files,
        uploadFiles: setFiles,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
