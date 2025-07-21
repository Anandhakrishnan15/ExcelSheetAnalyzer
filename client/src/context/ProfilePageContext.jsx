// context/ProfilePageContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { getDashboardCounts, getSavedChart } from "../services/AuthAPI";

const ProfilePageContext = createContext();

export const useProfilePage = () => useContext(ProfilePageContext);

export const ProfilePageProvider = ({ children }) => {
  const [state, setState] = useState({
    loadingCounts: true,
    dashboardCounts: {},
    loadingCharts: true,
    recentCharts: [],
  });


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [countsRes, chartsRes] = await Promise.allSettled([
          getDashboardCounts(),
          getSavedChart(),
        ]);

        const dashboardData =
          countsRes.status === "fulfilled" && countsRes.value?.data?.data
            ? countsRes.value.data.data
            : {};

        const chartsData =
          chartsRes.status === "fulfilled" &&
          Array.isArray(chartsRes.value?.data)
            ? chartsRes.value.data
            : [];

        const recentCharts = chartsData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setState({
          loadingCounts: false,
          dashboardCounts: dashboardData,
          loadingCharts: false,
          recentCharts,
        });
      } catch (err) {
        console.error("❌ Unexpected error in ProfilePageContext:", err);
        setState((prev) => ({
          ...prev,
          loadingCounts: false,
          loadingCharts: false,
        }));
      }
    };

    fetchProfileData();
  }, []);

  return (
    <ProfilePageContext.Provider value={state}>
      {children}
    </ProfilePageContext.Provider>
  );
};
