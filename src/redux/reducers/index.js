import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import sets from "./sets";

export default combineReducers({
  auth,
  message,
  sets,
});
