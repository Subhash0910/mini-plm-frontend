import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api;";


class PartService {
    getAllParts() {
        return axios.get(`${API_BASE_URL}/parts`);
    }
    createPart(partData) {
        return axios.post(`${API_BASE_URL}/parts`, partData);
    }
    updatePart(partId, partData) {
        return axios.put(`${API_BASE_URL}/parts/${partId}`, partData);
    }
    deletePart(partId) {
        return axios.delete(`${API_BASE_URL}/parts/${partId}`);
    }

}
export default new PartService();

