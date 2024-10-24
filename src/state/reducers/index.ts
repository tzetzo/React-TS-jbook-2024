import { combineReducers } from "redux";
import cellsReducer from "./cellsReducer";

// we need to export interface CellsState from cellsReducer otherwise reducers here will be underlined(TS complaining)
const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;

// as per react-redux documentation!
// Creates a type that describes the type of data in our redux store
export type RootState = ReturnType<typeof reducers>;
