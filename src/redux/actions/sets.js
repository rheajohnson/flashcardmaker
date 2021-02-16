import { SET_SET, CLEAR_SET, SET_ALL_SETS } from "./types";
import SetsService from "../../services/sets-service";

export const setSet = (data) => ({
  type: SET_SET,
  payload: data,
});

export const clearSet = () => ({
  type: CLEAR_SET,
});

export const getAllSets = () => (dispatch) => {
  return SetsService.getAllSets().then(
    (data) => {
      dispatch({
        type: SET_ALL_SETS,
        payload: data,
      });

      return Promise.resolve();
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );
};

export const updateSet = (name, description, id) => (dispatch, getState) => {
  return SetsService.updateSet(name, description, id).then(
    () => {
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

      return Promise.resolve();
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );
};

export const addSet = (name, description) => (dispatch, getState) => {
  return SetsService.createSet(name, description).then(
    (data) => {
      const { allSets } = getState().sets;

      const updatedAllSets = [...allSets, data];
      dispatch({
        type: SET_ALL_SETS,
        payload: updatedAllSets,
      });

      return Promise.resolve();
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );
};

export const deleteSet = (id) => (dispatch, getState) => {
  return SetsService.deleteSet(id).then(
    () => {
      const { allSets } = getState().sets;

      const updatedAllSets = allSets.filter((set) => set.id !== id);
      dispatch({
        type: SET_ALL_SETS,
        payload: updatedAllSets,
      });

      return Promise.resolve();
    },
    (error) => {
      console.log(error);
      return Promise.reject();
    }
  );
};
