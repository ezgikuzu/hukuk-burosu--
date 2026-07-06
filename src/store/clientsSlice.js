import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";
import { INITIAL_CLIENTS } from "../data/initialData";

const initialClientsState = {
  list: loadState("clients", INITIAL_CLIENTS),
};

export const clientsSlice = createSlice({
  name: "clients",
  initialState: initialClientsState,
  reducers: {
    addClient: (state, action) => {
      state.list.push(action.payload);
      saveState("clients", state.list);
    },
    updateClient: (state, action) => {
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        saveState("clients", state.list);
      }
    },
    deleteClient: (state, action) => {
      state.list = state.list.filter(c => c.id !== action.payload);
      saveState("clients", state.list);
    },
  },
});

export const { addClient, updateClient, deleteClient } = clientsSlice.actions;
export default clientsSlice.reducer;
