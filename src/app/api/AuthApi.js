import axios from "axios";
const BASE_URL = "http://localhost:5000";

// Register 
export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Server not responding" };
    }
  }
};

// login
export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {

    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Server not responding" };
    }
  }
};



