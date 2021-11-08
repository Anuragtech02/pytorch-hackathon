import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { compressImage, blobToBase64 } from "./utility";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [encodedFiles, setEncodedFiles] = useState([]);
  const [result, setResult] = useState([]);

  async function handleClickPredict(files = []) {
    // const cFiles = await Promise.all(files.map(compressImage));
    const convertedFiles = await Promise.all(files.map(blobToBase64));

    setEncodedFiles(convertedFiles);
  }

  // async function getResult(b64File) {
  //   return await axios({
  //     method: "POST",
  //     url: "http://localhost:8080/wfpredict/ocr",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(b64File.split(",")[1]),
  //   });
  // }

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1)
      n -= 1 // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime })
  }

  async function getResult(b64File) {
    const headers = {
      // Accept: "application/json",
      "Content-Type": "multipart/form-data"
    }
    const data= new FormData()
    const file= dataURLtoFile(b64File)
    data.append('data',file,file.name)
    return await axios.post("http://164.52.218.27:7080/wfpredict/ocr",data, {headers});
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