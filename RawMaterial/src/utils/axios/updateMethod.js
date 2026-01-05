import api from "../../auth/Api";
const updateMethod = async (API, data) => {
    try {
        const response = await api.put(`${API}`, data);
        console.log("updateMethod response", response);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};
export default updateMethod;