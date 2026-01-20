import axios from "axios";

const API = `https://backonehf.onrender.com/api/v1/admin`;

export const generateReportAPI = (payload) =>
  axios.post(`${API}/export`, payload, { withCredentials: true });

export const fetchReportsAPI = () =>
  axios.get(`${API}/exports`, { withCredentials: true });
