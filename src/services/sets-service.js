import AuthService from "./auth-service";
import axios from "axios";

const getUserSets = async (userSetIds = []) => {
  const getUserSetsResponse = [];
  for (const userSetId of userSetIds) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const url = `${baseUrl}/sets/${userSetId}`;
    const response = await axios.get(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    getUserSetsResponse.push(response.data);
  }
  return getUserSetsResponse;
};

const getSet = async (id) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets/${id}`;
  const response = await axios.get(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return response.data;
};

const getPublicSets = async () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets`;
  const response = await axios.get(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  return response.data;
};

const createSet = async (name, type) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets`;

  const response = await axios.post(
    url,
    {
      name,
      type,
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

const updateSet = async (name, item_type, id) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets/${id}`;

  const response = await axios.put(
    url,
    {
      name,
      item_type,
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

const deleteSet = async (id) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets/${id}`;

  const response = await axios.delete(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: JSON.parse(token),
    },
  });
  return response.data;
};

export default {
  getUserSets,
  getSet,
  createSet,
  deleteSet,
  updateSet,
  getPublicSets,
};
