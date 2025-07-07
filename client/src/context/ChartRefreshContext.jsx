import React, { createContext, useContext, useRef } from "react";

const ChartRefreshContext = createContext(null);

export const ChartRefreshProvider = ({ children }) => {
  const savedChartsRef = useRef();

  return (
    <ChartRefreshContext.Provider value={savedChartsRef}>
      {children}
    </ChartRefreshContext.Provider>
  );
};

export const useChartRefresh = () => useContext(ChartRefreshContext);
