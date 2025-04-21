import axios from "axios";
export const axiosInstance=axios.create({
    baseURL:"https://chat-app-yolh.onrender.com/api",
    withCredentials: true,
})