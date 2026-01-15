import axios from "axios";
import { auth } from "./auth";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

function authHeaders() {
  const token = auth?.getToken?.() || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const BomService = {
  createBom: (payload) => axios.post(`${BASE_URL}/bom`, payload, { headers: authHeaders() }),
  updateBom: (bomId, payload) =>
    axios.put(`${BASE_URL}/bom/${bomId}`, payload, { headers: authHeaders() }),

  getBomById: (bomId) => axios.get(`${BASE_URL}/bom/${bomId}`, { headers: authHeaders() }),
  getActiveBomForPart: (partId) =>
    axios.get(`${BASE_URL}/bom/part/${partId}/active`, { headers: authHeaders() }),
  getAllBomsForPart: (partId) =>
    axios.get(`${BASE_URL}/bom/part/${partId}/all`, { headers: authHeaders() }),
  getFlattenedBom: (bomId) =>
    axios.get(`${BASE_URL}/bom/${bomId}/flattened`, { headers: authHeaders() }),
};

export default BomService;
