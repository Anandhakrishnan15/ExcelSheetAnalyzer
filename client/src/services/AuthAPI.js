import axios from "axios";

// Create Axios instance
const API = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

// Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// API Register User
export const registerUser = (data) => API.post("/Auth/register", data);

// API Login User
export const loginUser = (data) => API.post("/Auth/login", data);

// API Get User Info
export const getMe = () => API.get("/api/users/me");

//API upload FileData
// export const uploadExcel = (data) => API.post("/api/uploads",data)
export const uploadExcel = (formData) =>
    API.post("/api/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

//API get the file data
export const getExceldata = () => API.get("/api/uploads/get")

export const saveCharts = (payload) => API.post("/api/saved-graphs/save",payload)
export const getSavedChart = () => API.get("api/saved-graphs/my")

// API Generate AI Report (POST)
export const generateAIReport = (payload) =>
    API.post("/api/ai-summary", payload);

// API Get All AI Reports (GET)
export const getAIReports = () =>
    API.get("/api/ai-summary");

export const saveAIReportToChart = (payload) =>
    API.post("/api/ai-summary/save-to-chart", payload);
