import { SET_ALL_SETS, SET_SET, CLEAR_SET } from "../actions/types";

const initialState = { allSets: [], selectedSet: {} };

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALL_SETS:
      return {
        ...state,
        allSets: payload,
      };
    case SET_SET:
      return {
        ...state,
        selectedSet: payload,
      };
    case CLEAR_SET:
      return {
        ...state,
        selectedSet: {},
      };
    default:
      return state;
  }
}
