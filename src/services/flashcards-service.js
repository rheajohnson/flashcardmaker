import AuthService from "./auth-service";
import axios from "axios";

const getAllFlashcards = async (id) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets/${id}/flashcards`;
  const response = await axios.get(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return response.data;
};

const createFlashcard = async (term, definition, id) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets/${id}/flashcards`;

  const response = await axios.post(
    url,
    {
      term,
      definition,
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

const updateFlashcard = async (term, definition, setId, flashcardId) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets/${setId}/flashcards/${flashcardId}`;

  const response = await axios.put(
    url,
    {
      term,
      definition,
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

const deleteFlashcard = async (setId, flashcardId) => {
  const token = await AuthService.getAccessToken();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const url = `${baseUrl}/sets/${setId}/flashcards/${flashcardId}`;

  const response = await axios.delete(url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: JSON.parse(token),
    },
  });
  return response.data;
};

export default {
  getAllFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
};
