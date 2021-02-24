import {
  SET_SET,
  CLEAR_SETS,
  SET_USER_SETS,
  SET_PUBLIC_SETS,
  SET_MESSAGE,
  CLEAR_MESSAGE,
} from "./types";
import SetsService from "../../services/sets-service";
import UserService from "../../services/user-service";

export const clearSets = () => ({
  type: CLEAR_SETS,
});

export const setSet = (id) => {
  return async (dispatch) => {
    try {
      const getSetResponse = await SetsService.getSet(id);
      dispatch({
        type: SET_SET,
        payload: getSetResponse,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const getUserSets = () => {
  return async (dispatch, getState) => {
    try {
      const { user } = await getState().auth;
      if (user) {
        const userDDB = await UserService.getUser(user.sub);
        const userSets = [];
        for (const setId of userDDB.sets) {
          userSets.push(await SetsService.getSet(setId));
        }
        dispatch({
          type: SET_USER_SETS,
          payload: userSets,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
};

export const getPublicSets = () => {
  return async (dispatch) => {
    try {
      const response = await SetsService.getPublicSets();
      dispatch({
        type: SET_PUBLIC_SETS,
        payload: response,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const updateSet = (name, type, id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CLEAR_MESSAGE,
      });
      const setType = `type#${type || "private"}#set#${id}`;
      await SetsService.updateSet(name, setType, id);
      dispatch(getPublicSets());
      dispatch(getUserSets());
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: { message },
      });
      throw new Error(err);
    }
  };
};

export const addSet = (name, type) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: CLEAR_MESSAGE,
      });
      const createSetResponse = await SetsService.createSet(name, type);
      const { user } = await getState().auth;
      const userDDB = await UserService.getUser(user.sub);
      const userSetIds = userDDB.sets;
      await UserService.updateUser(user.sub, [
        ...userSetIds,
        createSetResponse.id,
      ]);
      dispatch(getPublicSets());
      dispatch(getUserSets());
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: { message },
      });
      throw new Error(err);
    }
  };
};

export const deleteSet = (id) => {
  return async (dispatch, getState) => {
    try {
      await SetsService.deleteSet(id);
      const { user } = await getState().auth;
      const userDDB = await UserService.getUser(user.sub);
      const userSetIds = userDDB.sets;
      const userSetIdsFiltered = userSetIds.filter((setId) => setId !== id);
      await UserService.updateUser(user.sub, userSetIdsFiltered);
      dispatch(getPublicSets());
      dispatch(getUserSets());
    } catch (err) {
      console.error(err);
    }
  };
};
