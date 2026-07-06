import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";
import { INITIAL_CASES } from "../data/initialData";

const initialCasesState = {
  list: loadState("cases", INITIAL_CASES),
};

export const casesSlice = createSlice({
  name: "cases",
  initialState: initialCasesState,
  reducers: {
    addCase: (state, action) => {
      state.list.push(action.payload);
      saveState("cases", state.list);
    },
    updateCase: (state, action) => {
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        saveState("cases", state.list);
      }
    },
    deleteCase: (state, action) => {
      state.list = state.list.filter(c => c.id !== action.payload);
      saveState("cases", state.list);
    },
  },
});

export const { addCase, updateCase, deleteCase } = casesSlice.actions;
export default casesSlice.reducer;
