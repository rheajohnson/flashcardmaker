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

export const getAllFlashcards = (id) => (dispatch) => {
  return flashcardsService.getAllFlashcards(id).then(
    (data) => {
      dispatch({
        type: SET_ALL_FLASHCARDS,
        payload: data,
      });

      return Promise.resolve();
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );
};

export const clearAllFlashcards = () => ({
  type: CLEAR_ALL_FLASHCARDS,
});

export const updateFlashcard = (front, back, setId, flashcardId) => (
  dispatch,
  getState
) => {
  return flashcardsService
    .updateFlashcard(front, back, setId, flashcardId)
    .then(
      () => {
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

        return Promise.resolve();
      },
      (error) => {
        console.log(error);
        return Promise.reject();
      }
    );
};

export const addFlashcard = (front, back, id) => (dispatch, getState) => {
  return flashcardsService.createFlashcard(front, back, id).then(
    (data) => {
      const { allFlashcards } = getState().flashcards;

      const updatedAllFlashcards = [...allFlashcards, data];
      dispatch({
        type: SET_ALL_FLASHCARDS,
        payload: updatedAllFlashcards,
      });

      return Promise.resolve();
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );
};

export const deleteFlashcard = (setId, flashcardId) => (dispatch, getState) => {
  return flashcardsService.deleteFlashcard(setId, flashcardId).then(
    () => {
      const { allFlashcards } = getState().flashcards;

      const updatedAllFlashcards = allFlashcards.filter(
        (flashcard) => flashcard.id !== flashcardId
      );
      dispatch({
        type: SET_ALL_FLASHCARDS,
        payload: updatedAllFlashcards,
      });

      return Promise.resolve();
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );
};
