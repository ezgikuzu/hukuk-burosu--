import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";

const initialUIState = {
  language: loadState("language", "TR"),
  activeTab: "overview",
  selectedClientId: null,
  toast: { message: "", type: "info", isVisible: false },
  confirmDialog: { message: "", actionToDispatch: null, isVisible: false },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUIState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === "TR" ? "EN" : "TR";
      saveState("language", state.language);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      saveState("language", state.language);
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedClient: (state, action) => {
      state.selectedClientId = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || "info",
        isVisible: true
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    showConfirm: (state, action) => {
      state.confirmDialog = {
        message: action.payload.message,
        actionToDispatch: action.payload.actionToDispatch,
        isVisible: true
      };
    },
    hideConfirm: (state) => {
      state.confirmDialog.isVisible = false;
    }
  },
});

export const { toggleLanguage, setLanguage, setActiveTab, setSelectedClient, showToast, hideToast, showConfirm, hideConfirm } = uiSlice.actions;
export default uiSlice.reducer;
