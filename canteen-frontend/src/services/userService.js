import axios from "axios";

const USER_SERVICE_URL = "http://localhost:8081";

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${USER_SERVICE_URL}/api/users/login`,
    loginData
  );

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${USER_SERVICE_URL}/api/users/register`,
    userData
  );

  return response.data;
};