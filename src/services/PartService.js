import axios from "axios";

const API_BASE_URL = "https://mini-plm-backend.onrender.com/api/parts";


class PartService {

  getAllParts() {
    return axios.get(API_BASE_URL);
  }

  createPart(part) {
    return axios.post(API_BASE_URL, part);
  }

  updatePart(id, part) {
    return axios.put(`${API_BASE_URL}/${id}`, part);
  }

  deletePart(id) {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
}


export default new PartService();

console.log("API =", API_BASE_URL);


