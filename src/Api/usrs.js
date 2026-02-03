import authApi from "./Api";



export const get_all_users = async () => {
  try {
    const res = await authApi.get("/users");
    return res.data;
  } catch (error) {
    console.error("Get users failed:", error);
    throw error;
  }
};


 //! Get Current users 

 export const getCurrentUser = async () =>{
  try {
    const res = await authApi.get("/users/me")
    console.log("Current user : " , res.data)
    return res.data
  } catch (error) {
    console.error("Current user Fetching  Failed:", error.response?.data || error.message);
    throw error; 
  }
 }