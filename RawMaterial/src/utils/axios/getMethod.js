import api from "../../auth/Api";
const showData = async(API) => {
    try {
        const response = await api.get(`${API}`);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
}
export default showData;