import AuthService from "./auth-service";
import axios from "axios";

const getUser = async (id) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/users/${id}`;

  const response = await axios.get(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: JSON.parse(token),
    },
  });
  return response.data;
};

const createUser = async (id, username, email) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/users`;

  const response = await axios.post(
    url,
    {
      id,
      username,
      email,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: JSON.parse(token),
      },
    }
  );
  return response.data;
};

const updateUser = async (id, sets) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/users/${id}`;

  const response = await axios.put(
    url,
    {
      sets,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: JSON.parse(token),
      },
    }
  );
  return response.data;
};

export default {
  getUser,
  createUser,
  updateUser,
};
