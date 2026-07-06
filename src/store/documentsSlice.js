import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";
import { INITIAL_DOCUMENTS } from "../data/initialData";

const initialDocumentsState = {
  list: loadState("documents", INITIAL_DOCUMENTS),
};

export const documentsSlice = createSlice({
  name: "documents",
  initialState: initialDocumentsState,
  reducers: {
    addDocument: (state, action) => {
      state.list.push(action.payload);
      saveState("documents", state.list);
    },
    updateDocument: (state, action) => {
      const index = state.list.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        saveState("documents", state.list);
      }
    },
    deleteDocument: (state, action) => {
      state.list = state.list.filter(d => d.id !== action.payload);
      saveState("documents", state.list);
    },
  },
});

export const { addDocument, updateDocument, deleteDocument } = documentsSlice.actions;
export default documentsSlice.reducer;
