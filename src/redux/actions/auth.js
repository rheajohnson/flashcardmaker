import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  SET_MESSAGE,
  SET_USER,
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

export const confirm = (username, code) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SET_MESSAGE,
        payload: "",
      });
      const response = await AuthService.confirmSignUp(username, code);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: { username: response.username } },
      });
    } catch (err) {
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
      const response = await AuthService.login(username, password);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: { username: response.username } },
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

export const setUser = (user, isLoggedIn, userConfirmed) => ({
  type: SET_USER,
  payload: { user, isLoggedIn, userConfirmed },
});

export const logout = () => {
  return async (dispatch) => {
    try {
      await AuthService.logout();
      dispatch({
        type: LOGOUT,
      });
    } catch (err) {
      console.error(err);
    }
  };
};
