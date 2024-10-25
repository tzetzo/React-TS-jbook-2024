import { produce } from "immer";

import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      // thx to using immer:
      state.data[id].content = content;
      return;

    // without immer:
    // return {
    //   ...state,
    //   data: {
    //     ...state.data,
    //     [id]: {
    //       ...state.data[id],
    //       content,
    //     },
    //   },
    // };
    case ActionType.DELETE_CELL:
      return state;
    case ActionType.MOVE_CELL:
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    default:
      return state;
  }
});

export default reducer;
