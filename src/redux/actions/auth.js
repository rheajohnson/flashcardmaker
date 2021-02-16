import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
  SET_USER,
} from "./types";

import AuthService from "../../services/auth-service";

export const register = (username, email, password) => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: "",
  });
  return AuthService.register(username, email, password).then(
    (data) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { username: data.username },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: REGISTER_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const login = (username, password) => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: "",
  });
  return AuthService.login(username, password).then(
    (data) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data.username },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const setUser = (username) => ({
  type: SET_USER,
  payload: { user: username },
});

export const logout = () => async (dispatch) => {
  return AuthService.logout().then(
    () => {
      dispatch({
        type: LOGOUT,
      });
      return Promise.resolve();
    },
    (error) => {
      console.error(error);
      return Promise.reject();
    }
  );
};
