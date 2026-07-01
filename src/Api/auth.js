import authApi from "./Api";


export const login_user = async (loginData) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", loginData.email);
    formData.append("password", loginData.password);

    const res = await authApi.post(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true   
      }
    );

    
    localStorage.setItem("access_token", res.data.access_token);

    return res.data;

  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};


export const register_user = async (registerData) => {
  try {
    const res = await authApi.post("/auth/signup", registerData);
    return res.data;
  } catch (error) {
    console.error("Registration failed. :", error);
    throw error;
  }
};


export const logout_user = async () => {
  try {
    const res = await authApi.post(
      "/auth/logout",
      {},
      { withCredentials: true }
    );
    
    localStorage.removeItem("access_token");
    return res.data;
  } catch (error) {
    console.error("Logout failed:", error);
    localStorage.removeItem("access_token");
    throw error;
  }
};
