import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import sets from "./sets";
import flashcards from "./flashcards";

export default combineReducers({
  auth,
  message,
  sets,
  flashcards,
});
