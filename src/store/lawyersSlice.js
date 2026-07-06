import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";
import { INITIAL_LAWYERS } from "../data/initialData";

export const lawyersSlice = createSlice({
  name: "lawyers",
  initialState: {
    list: loadState("lawyers", INITIAL_LAWYERS)
  },
  reducers: {
    addLawyer: (state, action) => {
      state.list.push(action.payload);
      saveState("lawyers", state.list);
    },
    deleteLawyer: (state, action) => {
      state.list = state.list.filter(l => l.id !== action.payload);
      saveState("lawyers", state.list);
    }
  }
});

export const { addLawyer, deleteLawyer } = lawyersSlice.actions;
export default lawyersSlice.reducer;
