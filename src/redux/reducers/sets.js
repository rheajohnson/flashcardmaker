import {
  SET_USER_SETS,
  SET_SET,
  CLEAR_SETS,
  SET_PUBLIC_SETS,
} from "../actions/types";

const initialState = { userSets: null, publicSets: null, selectedSet: null };

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_USER_SETS:
      return {
        ...state,
        userSets: payload,
      };
    case SET_PUBLIC_SETS:
      return {
        ...state,
        publicSets: payload,
      };
    case SET_SET:
      return {
        ...state,
        selectedSet: payload,
      };
    case CLEAR_SETS:
      return {
        ...state,
        selectedSet: null,
        userSets: null,
        publicSets: null,
      };
    default:
      return state;
  }
}
