import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { compressImage, blobToBase64 } from "./utility";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [encodedFiles, setEncodedFiles] = useState([]);
  const [result, setResult] = useState([]);

  async function handleClickPredict(files = []) {
    const cFiles = await Promise.all(files.map(compressImage));
    const convertedFiles = await Promise.all(cFiles.map(blobToBase64));

    setEncodedFiles(convertedFiles);
  }

  async function getResult(b64File) {
    return await axios("http://164.52.218.27:7080/wfpredict/ocr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        charset: "utf-8",
      },
      data: {
        data: b64File.split(",")[1],
      },
    });
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
      console.log({ encodedFiles });
      if (flag) {
        // console.log("insdie", { encodedFiles });
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
