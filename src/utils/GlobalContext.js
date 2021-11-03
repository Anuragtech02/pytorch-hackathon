import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [encodedFiles, setEncodedFiles] = useState([]);

  useEffect(() => {
    setEncodedFiles(files);
  }, [files]);

  return (
    <GlobalContext.Provider value={{ files, setFiles, encodedFiles }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
