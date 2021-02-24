import {
  SET_ALL_FLASHCARDS,
  SET_FLASHCARD,
  CLEAR_FLASHCARDS,
} from "../actions/types";

const initialState = { allFlashcards: null, selectedFlashcard: null };

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALL_FLASHCARDS:
      return {
        ...state,
        allFlashcards: payload,
      };
    case SET_FLASHCARD:
      return {
        ...state,
        selectedFlashcard: payload,
      };
    case CLEAR_FLASHCARDS:
      return {
        ...state,
        selectedFlashcard: null,
        allFlashcards: null,
      };
    default:
      return state;
  }
}
