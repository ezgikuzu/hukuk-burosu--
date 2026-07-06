import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";
import { INITIAL_HEARINGS } from "../data/initialData";

const initialHearingsState = {
  list: loadState("hearings", INITIAL_HEARINGS),
};

export const hearingsSlice = createSlice({
  name: "hearings",
  initialState: initialHearingsState,
  reducers: {
    addHearing: (state, action) => {
      state.list.push(action.payload);
      saveState("hearings", state.list);
    },
    updateHearing: (state, action) => {
      const index = state.list.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        saveState("hearings", state.list);
      }
    },
    deleteHearing: (state, action) => {
      state.list = state.list.filter(h => h.id !== action.payload);
      saveState("hearings", state.list);
    },
  },
});

export const { addHearing, updateHearing, deleteHearing } = hearingsSlice.actions;
export default hearingsSlice.reducer;
