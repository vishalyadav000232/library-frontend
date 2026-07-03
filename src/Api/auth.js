import authApi from "./Api";
import { notifySuccess } from "./errorHandler";

export const login_user = async (loginData) => {
  const formData = new URLSearchParams();
  formData.append("username", loginData.email);
  formData.append("password", loginData.password);

  const res = await authApi.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    skipAutoLogout: true,
  });

  const accessToken = res.data?.access_token;
  const role = res.data?.role || res.data?.user?.role;

  if (accessToken) localStorage.setItem("access_token", accessToken);
  if (role) localStorage.setItem("role", role);

  notifySuccess("Login successful");
  return { ...res.data, role };
};

export const register_user = async (registerData) => {
  const res = await authApi.post("/auth/signup", registerData);
  notifySuccess("Account created successfully");
  console.log(res)
  return res.data;
};

export const logout_user = async () => {
  try {
    const res = await authApi.post("/auth/logout", {}, { skipToast: true, skipAutoLogout: true });
    notifySuccess("Logged out successfully");
    return res.data;
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
  }
};
