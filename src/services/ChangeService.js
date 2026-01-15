import axios from "axios";
import { auth } from "./auth";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

function authHeaders() {
  const token = auth?.getToken?.() || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const ChangeService = {
  getAllChanges: () => axios.get(`${BASE_URL}/changes`, { headers: authHeaders() }),
  getChangeById: (id) => axios.get(`${BASE_URL}/changes/${id}`, { headers: authHeaders() }),
  getChangesByStatus: (status) =>
    axios.get(`${BASE_URL}/changes/status/${status}`, { headers: authHeaders() }),

  createChange: (payload) => axios.post(`${BASE_URL}/changes`, payload, { headers: authHeaders() }),
  approveChange: (id, payload) =>
    axios.post(`${BASE_URL}/changes/${id}/approve`, payload, { headers: authHeaders() }),
  implementChange: (id) => axios.post(`${BASE_URL}/changes/${id}/implement`, {}, { headers: authHeaders() }),
};

export default ChangeService;
