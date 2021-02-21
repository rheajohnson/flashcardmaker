import { SET_SET, CLEAR_SET, SET_ALL_SETS, SET_PUBLIC_SETS } from "./types";
import SetsService from "../../services/sets-service";

export const setSet = (data) => ({
  type: SET_SET,
  payload: data,
});

export const clearSet = () => ({
  type: CLEAR_SET,
});

export const getUserSets = () => {
  return async (dispatch) => {
    try {
      const response = await SetsService.getUserSets();
      dispatch({
        type: SET_ALL_SETS,
        payload: response,
      });
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

export const updateSet = (name, description, id) => {
  return async (dispatch, getState) => {
    try {
      await SetsService.updateSet(name, description, id);
      const { allSets } = getState().sets;
      const updatedAllSets = allSets.map((set) => {
        if (set.id === id) {
          set.name = name;
          set.description = description;
        }
        return set;
      });
      dispatch({
        type: SET_ALL_SETS,
        payload: updatedAllSets,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const addSet = (name, description) => {
  return async (dispatch, getState) => {
    try {
      const response = await SetsService.createSet(name, description);
      const { allSets } = getState().sets;
      const updatedAllSets = [...allSets, response];
      dispatch({
        type: SET_ALL_SETS,
        payload: updatedAllSets,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const deleteSet = (id) => {
  return async (dispatch, getState) => {
    try {
      await SetsService.deleteSet(id);
      const { allSets } = getState().sets;

      const updatedAllSets = allSets.filter((set) => set.id !== id);
      dispatch({
        type: SET_ALL_SETS,
        payload: updatedAllSets,
      });
    } catch (err) {
      console.error(err);
    }
  };
};
