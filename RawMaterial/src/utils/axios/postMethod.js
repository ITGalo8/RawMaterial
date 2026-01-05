import api from "../../auth/Api";

const postMethod = async (API, data) => {
    try {
        const response = await api.post(`${API}`, data);
        console.log("postMethod response", response);
        alert(response?.data?.message);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};
export default postMethod;