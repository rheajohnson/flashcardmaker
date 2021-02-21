import {
  SET_FLASHCARD,
  CLEAR_FLASHCARD,
  CLEAR_ALL_FLASHCARDS,
  SET_ALL_FLASHCARDS,
} from "./types";
import flashcardsService from "../../services/flashcards-service";

export const setFlashcard = (data) => ({
  type: SET_FLASHCARD,
  payload: data,
});

export const clearFlashcard = () => ({
  type: CLEAR_FLASHCARD,
});

export const getAllFlashcards = (id) => {
  return async (dispatch) => {
    try {
      const response = await flashcardsService.getAllFlashcards(id);
      dispatch({
        type: SET_ALL_FLASHCARDS,
        payload: response,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const clearAllFlashcards = () => ({
  type: CLEAR_ALL_FLASHCARDS,
});

export const updateFlashcard = (front, back, setId, flashcardId) => {
  return async (dispatch, getState) => {
    try {
      await flashcardsService.updateFlashcard(front, back, setId, flashcardId);
      const { allFlashcards } = getState().flashcards;
      const updatedAllFlashcards = allFlashcards.map((flashcard) => {
        if (flashcard.id === flashcardId) {
          flashcard.front = front;
          flashcard.back = back;
        }
        return flashcard;
      });
      dispatch({
        type: SET_ALL_FLASHCARDS,
        payload: updatedAllFlashcards,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const addFlashcard = (front, back, id) => {
  return async (dispatch, getState) => {
    try {
      const response = await flashcardsService.createFlashcard(front, back, id);
      const { allFlashcards } = getState().flashcards;
      const updatedAllFlashcards = [...allFlashcards, response];
      dispatch({
        type: SET_ALL_FLASHCARDS,
        payload: updatedAllFlashcards,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const deleteFlashcard = (setId, flashcardId) => {
  return async (dispatch, getState) => {
    try {
      await flashcardsService.deleteFlashcard(setId, flashcardId);
      const { allFlashcards } = getState().flashcards;

      const updatedAllFlashcards = allFlashcards.filter(
        (flashcard) => flashcard.id !== flashcardId
      );
      dispatch({
        type: SET_ALL_FLASHCARDS,
        payload: updatedAllFlashcards,
      });
    } catch (err) {
      console.error(err);
    }
  };
};
