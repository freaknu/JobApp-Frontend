import axios from "axios";
export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
