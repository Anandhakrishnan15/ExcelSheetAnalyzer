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
export const uploadExcel = (data) => API.post("/api/uploads",data)

//API get the file data
export const getExceldata = () => API.get("/api/uploads/get")
