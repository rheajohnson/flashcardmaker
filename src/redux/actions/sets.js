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
    const getSetResponse = await SetsService.getSet(id);
    dispatch({
      type: SET_SET,
      payload: getSetResponse,
    });
  };
};

export const getSets = () => {
  return async (dispatch, getState) => {
    try {
      const { user } = await getState().auth;
      if (user && user.sub) {
        const userDDB = await UserService.getUser(user.sub);
        const userSets = [];
        // get user sets from set ids in user obj
        for (const setId of userDDB.sets) {
          userSets.push(await SetsService.getSet(setId));
        }
        dispatch({
          type: SET_USER_SETS,
          payload: userSets,
        });
      }
      const getPublicSetsResponse = await SetsService.getPublicSets();
      dispatch({
        type: SET_PUBLIC_SETS,
        payload: getPublicSetsResponse,
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
      await dispatch(getSets());
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
      await dispatch(getSets());
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

export const deleteSet = (id) => {
  return async (dispatch, getState) => {
    try {
      await SetsService.deleteSet(id);
      const { user } = await getState().auth;
      const userDDB = await UserService.getUser(user.sub);
      const userSetIds = userDDB.sets;
      const userSetIdsFiltered = userSetIds.filter((setId) => setId !== id);
      await UserService.updateUser(user.sub, userSetIdsFiltered);
      await dispatch(getSets());
    } catch (err) {
      console.error(err);
    }
  };
};
