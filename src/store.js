import { configureStore } from "@reduxjs/toolkit";

import authReducer, { login, logout } from "./store/authSlice";
import uiReducer, { toggleLanguage, setLanguage, setActiveTab, setSelectedClient, showToast, hideToast, showConfirm, hideConfirm } from "./store/uiSlice";
import lawyersReducer, { addLawyer, deleteLawyer } from "./store/lawyersSlice";
import clientsReducer, { addClient, updateClient, deleteClient } from "./store/clientsSlice";
import casesReducer, { addCase, updateCase, deleteCase } from "./store/casesSlice";
import hearingsReducer, { addHearing, updateHearing, deleteHearing } from "./store/hearingsSlice";
import documentsReducer, { addDocument, updateDocument, deleteDocument } from "./store/documentsSlice";
import paymentsReducer, { addPayment, updatePaymentStatus, deletePayment } from "./store/paymentsSlice";
import messagesReducer, { addMessage, addMemo, deleteMemo } from "./store/messagesSlice";
import blogsReducer, { addBlog, deleteBlog } from "./store/blogsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    lawyers: lawyersReducer,
    clients: clientsReducer,
    cases: casesReducer,
    hearings: hearingsReducer,
    documents: documentsReducer,
    payments: paymentsReducer,
    messages: messagesReducer,
    blogs: blogsReducer,
  },
});

// Export all actions to maintain backwards compatibility for the rest of the application
export { 
  login, logout,
  toggleLanguage, setLanguage, setActiveTab, setSelectedClient, showToast, hideToast, showConfirm, hideConfirm,
  addLawyer, deleteLawyer,
  addClient, updateClient, deleteClient,
  addCase, updateCase, deleteCase,
  addHearing, updateHearing, deleteHearing,
  addDocument, updateDocument, deleteDocument,
  addPayment, updatePaymentStatus, deletePayment,
  addMessage, addMemo, deleteMemo,
  addBlog, deleteBlog
};
