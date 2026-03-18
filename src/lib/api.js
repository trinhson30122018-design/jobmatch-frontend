import axios from "axios";

const api = axios.create({
  baseURL: "https://jobmatch-backend-1-lrv0.onrender.com/api"
});

export default api;