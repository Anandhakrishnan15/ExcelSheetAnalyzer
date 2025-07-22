import axios from "axios";

// Dynamically set baseURL from Vite env variable or fallback
const baseURL = "https://excelsheetanalyzer-production.up.railway.app/"|| "http://localhost:5624";
// Create Axios instance
const API = axios.create({
    baseURL,
    withCredentials: true,
});

// Automatically attach JWT token to requests
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

//
// ========== AUTH ==========
//
export const registerUser = (data) => API.post("/Auth/register", data);
export const loginUser = (data) => API.post("/Auth/login", data);
export const getMe = () => API.get("/api/users/me");

//
// ========== FILE UPLOAD ==========
//
export const uploadExcel = (formData) =>
    API.post("/api/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getExceldata = () => API.get("/api/uploads/get");

//
// ========== DOWNLOADS ==========
//
export const incrementDownload = (payload) =>
    API.put("/api/ai-summary/increment-download", payload);

//
// ========== CHARTS ==========
//
export const saveCharts = (payload) =>
    API.post("/api/saved-graphs/save", payload);

export const getSavedChart = () => API.get("/api/saved-graphs/my");

//
// ========== AI REPORTS ==========
//
export const generateAIReport = (payload) =>
    API.post("/api/ai-summary", payload);

export const getAIReports = () => API.get("/api/ai-summary");

export const saveAIReportToChart = (payload) =>
    API.post("/api/ai-summary/save-to-chart", payload);

//
// ========== DASHBOARD ==========
//
export const getDashboardCounts = () => API.get("/api/dashboard/counts");
export const fetchAdminDashboard = () => API.get("/api/admin-dashboard");

export const globalCount = () => API.get("/api/dashboard/global");
export const globalUsers = (page = 1, limit = 5) =>
    API.get(`/api/dashboard/users?page=${page}&limit=${limit}`);
export const AllAdminOnly = () => API.get("/api/admin-dashboard-stats");

//
// ========== SEARCH ==========
//
export const searchUsers = async (query) => {
    const res = await API.get("/api/search-users", { params: { query } });
    return res.data;
};

export const getUserById = async (userId) => {
    const res = await API.get(`/api/admin/user/${userId}`);
    return res.data;
};

export const toggleBlockUser = async (userId) => {
    const res = await API.patch(`/api/users/${userId}/block`);
    return res.data;
};

export const changeUserRole = async (userId, role) => {
    const res = await API.patch(`/api/users/${userId}/role`, { role });
    return res.data;
};

export const deleteUser = async (userId) => {
    const res = await API.delete(`/api/users/${userId}`);
    return res.data;
};

export const revokeUserAccess = async (userId) => {
    const res = await API.patch(`/api/users/${userId}/revoke`);
    return res.data;
};
