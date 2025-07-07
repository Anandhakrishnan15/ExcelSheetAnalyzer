import { createContext, useContext, useState } from "react";

const FileDataContext = createContext();

export const FileDataProvider = ({ children }) => {
  const [fileData, setFileData] = useState(null);

  return (
    <FileDataContext.Provider value={{ fileData, setFileData }}>
      {children}
    </FileDataContext.Provider>
  );
};

// Hook to use in components
export const useFileData = () => useContext(FileDataContext);
