import { SET_MESSAGE, CLEAR_MESSAGE } from "./types";

export const setMessage = (message, messageType = "danger") => ({
  type: SET_MESSAGE,
  payload: { message, messageType },
});

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});
