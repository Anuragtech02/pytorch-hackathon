import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { compressImage, blobToBase64 } from "./utility";

export const GlobalContext = createContext({});

const API_RECEIPT =
  "https://document-extraction-middleware.herokuapp.com/predictReceipt";
const API_FORM =
  "https://document-extraction-middleware.herokuapp.com/predictForm";

const GlobalContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [encodedFiles, setEncodedFiles] = useState([]);
  const [result, setResult] = useState([]);
  const [what, setWhat] = useState("");

  async function handleClickPredict(files = [], type) {
    if (files.length === 0) {
      setEncodedFiles([]);
      return;
    }
    setWhat(type);
    const compressedFiles = await Promise.all(files.map(compressImage));
    const convertedFiles = await Promise.all(compressedFiles.map(blobToBase64));

    setEncodedFiles(convertedFiles);
  }

  async function getResult(b64File) {
    return await axios(what === "receipt" ? API_RECEIPT : API_FORM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        charset: "utf-8",
      },
      data: {
        data: b64File,
      },
    });
  }

  useEffect(() => {
    if (!files?.length) {
      setEncodedFiles([]);
    }
  }, [files]);

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
