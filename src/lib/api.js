import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://jobmatch-backend-1-lrv0.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
});

export default api;