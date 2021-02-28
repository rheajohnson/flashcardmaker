import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_USER,
} from "../actions/types";

const user = JSON.parse(localStorage.getItem("token"));

const initialState = user
  ? { isLoggedIn: true, user: null, userConfirmed: true }
  : { isLoggedIn: false, user: null, userConfirmed: null };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        userConfirmed: false,
        user: payload.user,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userConfirmed: true,
        user: payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userConfirmed: null,
        user: null,
      };
    case SET_USER:
      return {
        ...state,
        isLoggedIn:
          payload.isLoggedIn !== "undefined"
            ? payload.isLoggedIn
            : state.isLoggedIn,
        userConfirmed:
          payload.userConfirmed !== "undefined"
            ? payload.userConfirmed
            : state.userConfirmed,
        user: payload.user,
      };

    default:
      return state;
  }
}
