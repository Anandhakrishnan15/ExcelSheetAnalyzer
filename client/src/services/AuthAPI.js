import axios from "axios";

// base Url
const API = axios.create({
    baseURL:
        "http://localhost:5000" , // our backend base URL 5000
    withCredentials: true, 
});

// Api Register user
export const registerUser = (data) => API.post("/Auth/register", data); 

//Api Login USer
export const loginUser = (data) => API.post("/Auth/login", data); 