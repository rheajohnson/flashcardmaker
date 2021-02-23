import {
  SET_ALL_FLASHCARDS,
  SET_FLASHCARD,
  CLEAR_FLASHCARD,
  CLEAR_ALL_FLASHCARDS,
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
    case CLEAR_FLASHCARD:
      return {
        ...state,
        selectedFlashcard: {},
      };
    case CLEAR_ALL_FLASHCARDS:
      return {
        ...state,
        allFlashcards: [],
      };
    default:
      return state;
  }
}
