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
// import { useAuth } from "./context/AuthContext";
import ChartDetail from "./components/ChartDetail";
import { Bounce, ToastContainer} from "react-toastify";
// import { DashboardProvider } from "./context/DashboardContext";
import AdminUserProfile from "./pages/AdminUserProfile";
import { ProfilePageProvider } from "./context/ProfilePageContext";
import { AdminUserActionsProvider } from "./context/AdminUserActionsContext";
import Charts from "./pages/Charts";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      {/* <h1>hello team</h1> */}
      <Navbar />
      <ScrollToTop />
      <ToastContainer
        ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route path="/" element={<Home />} />
        <Route
          path="/charts"
          element={
            <ProfilePageProvider>
              <Charts />
            </ProfilePageProvider>
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
            <PrivateRoute adminOnly={true}>
              <AdminUserActionsProvider>
                <Dashboard />
              </AdminUserActionsProvider>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminUserActionsProvider>
                <AdminUserProfile />
              </AdminUserActionsProvider>
            </PrivateRoute>
          }
        />
        <Route path="/chart/:chartId" element={<ChartDetail />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePageProvider>
                <Profile />
              </ProfilePageProvider>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
