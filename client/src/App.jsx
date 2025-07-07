import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ChartComponent from "./components/ChartUploads/ChartComponent"
import ChartLayout from "./components/ChartUploads/ChartLayout";
import ReportComponent from "./components/ReportComponent";
import { ChartRefreshProvider } from "./context/ChartRefreshContext";

function App() {
  return (
    <>
      {/* <h1>hello team</h1> */}
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/"
          element={
            // <PrivateRoute>
            <Home />
            // </PrivateRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/upload/chart/:filename"
          element={
            <PrivateRoute>
              <ChartComponent />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/upload/chart/:filename"
          element={
            <ChartRefreshProvider>
              <ChartLayout />
            </ChartRefreshProvider>
          }
        >
          {/* This is the default nested route */}
          <Route index element={<ChartComponent />} />
          {/* This is the /report nested route */}
          <Route path="report" element={<ReportComponent />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
