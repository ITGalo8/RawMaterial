import api from "../../auth/Api";
const deleteMethod = async (API, data) => {
    try {
        const response = await api.delete(API, {
            data
        });
        alert(response?.data?.message);
        return response?.data;
    } catch (error) {
        return error?.response?.data;
    }
};
export default deleteMethod;