import axios from "axios";
import { getCookie } from "./cookie";

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.headers.common["X-CSRFToken"] = getCookie("csrftoken");

// 나중에 baseURL 도메인으로 지정 필요
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  // baseURL: "https://popping.world",
});

export default axiosInstance;
