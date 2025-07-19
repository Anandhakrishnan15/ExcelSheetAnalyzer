import axios from "axios";

// Create Axios instance
const API = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

// Automatically attach JWT token + log request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    // // Debug log for all API requests
    // console.log(
    //     `[Axios] ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`,
    //     req.data || ""
    // );

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
export const uploadExcel = (formData) =>
    API.post("/api/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getExceldata = () => API.get("/api/uploads/get");

//
// ========== DOWNLOADS ==========
export const incrementDownload = (payload) =>
    API.put("/api/ai-summary/increment-download", payload);

//
// ========== CHARTS ==========
export const saveCharts = (payload) =>
    API.post("/api/saved-graphs/save", payload);

export const getSavedChart = () => API.get("/api/saved-graphs/my");

//
// ========== AI REPORTS ==========
export const generateAIReport = (payload) =>
    API.post("/api/ai-summary", payload);

export const getAIReports = () => API.get("/api/ai-summary");

export const saveAIReportToChart = (payload) =>
    API.post("/api/ai-summary/save-to-chart", payload);

//
// ========== DASHBOARD ==========
export const getDashboardCounts = () => API.get("/api/dashboard/counts");

export const fetchAdminDashboard = () =>
    API.get("/api/admin-dashboard", {}); // Empty body for now

// ========== all global count of user and etc ==========
export const globalCount =()=>
    API.get('/api/dashboard/global')

// ========== all global users data only ==========
// backend endpoint: /api/dashboard/users?page=1&limit=20
export const globalUsers = (page = 1, limit = 5) =>
    API.get(`/api/dashboard/users?page=${page}&limit=${limit}`);


// ========== all Admin only ==========
export const AllAdminOnly = () => API.get("/api/admin-dashboard-stats")

// ========== SEARCH ==========
export const searchUsers = async (query) => {
    const response = await API.get("/api/search-users", {
        params: { query },
    });
    return response.data;
};

export const getUserById = async (userId) => {
    const res = await API.get(`/api/admin/user/${userId}`); 
    return res.data;
};

// Block or unblock a user
export const toggleBlockUser = async (userId) => {
    const res = await API.patch(`/api/users/${userId}/block`);
    return res.data;
};

// Change user role (pass "admin", "user", etc.)
export const changeUserRole = async (userId, role) => {
    const res = await API.patch(`/api/users/${userId}/role`, { role });
    return res.data;
};

// Delete a user
export const deleteUser = async (userId) => {
    const res = await API.delete(`/api/users/${userId}`);
    return res.data;
};

// Revoke user access (invalidate token)
export const revokeUserAccess = async (userId) => {
    const res = await API.patch(`/api/users/${userId}/revoke`);
    return res.data;
};