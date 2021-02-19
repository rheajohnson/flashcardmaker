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

const getPublicSets = async () => {
  const publicSetIds = [];
  const publicSetsResponse = [];
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  for (const publicSetId of publicSetIds) {
    const url = `${baseUrl}/sets/${publicSetId}`;
    const response = await axios.get(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    publicSetsResponse.push(response.data);
  }

  return publicSetsResponse;
};

const createSet = async (name, description) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets`;

  const response = await axios.post(
    url,
    {
      name,
      description,
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

const updateSet = async (name, description, id) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets/${id}`;

  const response = await axios.put(
    url,
    {
      name,
      description,
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

export default { getUserSets, createSet, deleteSet, updateSet, getPublicSets };
