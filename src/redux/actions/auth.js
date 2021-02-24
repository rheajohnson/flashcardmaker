import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_MESSAGE,
  SET_USER,
  CLEAR_SETS,
  CLEAR_FLASHCARDS,
} from "./types";
import AuthService from "../../services/auth-service";

export const register = (username, email, password) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_MESSAGE,
        payload: { message: "", status: "" },
      });
      const response = await AuthService.register(username, email, password);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: { user: { username: response.username } },
      });
    } catch (err) {
      if (err.code === "UsernameExistsException") {
        try {
          login(username, password);
        } catch (err) {
          console.error(err);
        }
      }
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: { message },
      });
    }
  };
};

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_MESSAGE,
        payload: { message: "", status: "" },
      });
      await AuthService.login(username, password);
      const user = await AuthService.getUser();
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user },
      });
    } catch (err) {
      if (err.code === "UserNotConfirmedException") {
        return dispatch({
          type: SET_USER,
          payload: {
            user: { username },
            isLoggedIn: false,
            userConfirmed: false,
          },
        });
      }
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: { message },
      });
    }
  };
};

export const getUser = () => {
  return async (dispatch) => {
    try {
      const user = await AuthService.getUser();
      dispatch({
        type: SET_USER,
        payload: { user },
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await AuthService.logout();
      dispatch({
        type: LOGOUT,
      });
      dispatch({
        type: CLEAR_SETS,
      });
      dispatch({
        type: CLEAR_FLASHCARDS,
      });
      dispatch(getUser());
      localStorage.removeItem("token");
      sessionStorage.clear();
    } catch (err) {
      console.error(err);
    }
  };
};
