import { configureStore, createSlice } from "@reduxjs/toolkit";
import { 
  INITIAL_CLIENTS, INITIAL_CASES, INITIAL_HEARINGS, INITIAL_DOCUMENTS, INITIAL_PAYMENTS, INITIAL_MESSAGES, INITIAL_LAWYERS 
} from "./data/initialData";

// Helper to load state from localStorage
const loadState = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(`edbm_${key}`);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return defaultValue;
  }
};

// Helper to save state to localStorage
const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`edbm_${key}`, serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

// 1. Auth Slice
const initialAuthState = {
  currentUser: loadState("currentUser", {
    id: "admin_1",
    name: "Genel Yönetici",
    email: "admin@edbm.com",
    role: "admin",
    phone: "+90 212 999 8877",
  }),
  isAuthenticated: loadState("isAuthenticated", true),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      saveState("currentUser", state.currentUser);
      saveState("isAuthenticated", true);
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      saveState("currentUser", null);
      saveState("isAuthenticated", false);
    },
  },
});

// 2. UI Slice
const initialUIState = {
  language: loadState("language", "TR"),
  activeTab: "overview",
  selectedClientId: null,
};

const uiSlice = createSlice({
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
    }
  },
});

// 3. Lawyers Slice (with persistence so admin can add new lawyers!)
const lawyersSlice = createSlice({
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

// 4. Clients Slice
const initialClientsState = {
  list: loadState("clients", INITIAL_CLIENTS),
};

const clientsSlice = createSlice({
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

// 5. Cases Slice
const initialCasesState = {
  list: loadState("cases", INITIAL_CASES),
};

const casesSlice = createSlice({
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

// 6. Hearings Slice
const initialHearingsState = {
  list: loadState("hearings", INITIAL_HEARINGS),
};

const hearingsSlice = createSlice({
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

// 7. Documents Slice
const initialDocumentsState = {
  list: loadState("documents", INITIAL_DOCUMENTS),
};

const documentsSlice = createSlice({
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

// 8. Payments Slice
const initialPaymentsState = {
  list: loadState("payments", INITIAL_PAYMENTS),
};

const paymentsSlice = createSlice({
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

// 9. Messages Slice (Chat & Internal Memos)
const defaultMemos = [
  {
    id: "memo_1",
    authorName: "Beyza Mensur",
    content: "Pazartesi günü saat 10:00'da haftalık olağan büro toplantımız yapılacaktır. Tüm avukatlarımızın katılımı rica olunur.",
    timestamp: "2026-06-29T14:00",
  },
  {
    id: "memo_2",
    authorName: "Muhammet Görkem İşkenceli",
    content: "Vergi davalarındaki yeni kanun yolu düzenlemesi hakkında bir bilgi notu hazırladım, evrak havuzuna (Yönetmelik/Raporlar) ekledim.",
    timestamp: "2026-06-30T10:15",
  },
];

const initialMessagesState = {
  list: loadState("messages", INITIAL_MESSAGES),
  memos: loadState("memos", defaultMemos),
};

const messagesSlice = createSlice({
  name: "messages",
  initialState: initialMessagesState,
  reducers: {
    addMessage: (state, action) => {
      state.list.push(action.payload);
      saveState("messages", state.list);
    },
    addMemo: (state, action) => {
      state.memos.unshift(action.payload);
      saveState("memos", state.memos);
    },
    deleteMemo: (state, action) => {
      state.memos = state.memos.filter(m => m.id !== action.payload);
      saveState("memos", state.memos);
    }
  },
});

// Configure Store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    lawyers: lawyersSlice.reducer,
    clients: clientsSlice.reducer,
    cases: casesSlice.reducer,
    hearings: hearingsSlice.reducer,
    documents: documentsSlice.reducer,
    payments: paymentsSlice.reducer,
    messages: messagesSlice.reducer,
  },
});

// Export actions
export const { login, logout } = authSlice.actions;
export const { toggleLanguage, setLanguage, setActiveTab, setSelectedClient } = uiSlice.actions;
export const { addLawyer, deleteLawyer } = lawyersSlice.actions;
export const { addClient, updateClient, deleteClient } = clientsSlice.actions;
export const { addCase, updateCase, deleteCase } = casesSlice.actions;
export const { addHearing, updateHearing, deleteHearing } = hearingsSlice.actions;
export const { addDocument, updateDocument, deleteDocument } = documentsSlice.actions;
export const { addPayment, updatePaymentStatus, deletePayment } = paymentsSlice.actions;
export const { addMessage, addMemo, deleteMemo } = messagesSlice.actions;
