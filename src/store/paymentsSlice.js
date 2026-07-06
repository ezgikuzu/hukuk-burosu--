import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";
import { INITIAL_PAYMENTS } from "../data/initialData";

const initialPaymentsState = {
  list: loadState("payments", INITIAL_PAYMENTS),
};

export const paymentsSlice = createSlice({
  name: "payments",
  initialState: initialPaymentsState,
  reducers: {
    addPayment: (state, action) => {
      state.list.push(action.payload);
      saveState("payments", state.list);
    },
    updatePaymentStatus: (state, action) => {
      const index = state.list.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index].status = action.payload.status;
        saveState("payments", state.list);
      }
    },
    deletePayment: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload);
      saveState("payments", state.list);
    },
  },
});

export const { addPayment, updatePaymentStatus, deletePayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;
