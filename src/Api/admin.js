import authApi from "./Api";

export const getUser = async () => {
    try {
        const res = await authApi.get("/users/me");
        return res.data;
    } catch (error) {
        console.error("Error fetching seat/user info:", error);
        throw error; 
        }
};

export const getDashboardData = async () => {
    try {
        const res = await authApi.get("/admin/dashboard");
        return res.data;
    } catch (error) {
        console.error("Error fetching seat/user info:", error);
        throw error; }
};