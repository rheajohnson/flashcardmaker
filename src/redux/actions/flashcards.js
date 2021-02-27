import { SET_FLASHCARD, CLEAR_FLASHCARDS, SET_ALL_FLASHCARDS } from "./types";
import FlashcardsService from "../../services/flashcards-service";

export const setFlashcard = (data) => ({
  type: SET_FLASHCARD,
  payload: data,
});

export const clearFlashcards = () => ({
  type: CLEAR_FLASHCARDS,
});

export const getAllFlashcards = (id) => {
  return async (dispatch) => {
    try {
      const response = await FlashcardsService.getAllFlashcards(id);
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
  type: CLEAR_FLASHCARDS,
});

export const updateFlashcard = (term, definition, setId, flashcardId) => {
  return async (dispatch, getState) => {
    try {
      await FlashcardsService.updateFlashcard(
        term,
        definition,
        setId,
        flashcardId
      );
      const { allFlashcards } = getState().flashcards;
      const updatedAllFlashcards = allFlashcards.map((flashcard) => {
        if (flashcard.id === flashcardId) {
          flashcard.term = term;
          flashcard.definition = definition;
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

export const addFlashcard = (term, definition, id) => {
  return async (dispatch, getState) => {
    try {
      const response = await FlashcardsService.createFlashcard(
        term,
        definition,
        id
      );
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
      await FlashcardsService.deleteFlashcard(setId, flashcardId);
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
