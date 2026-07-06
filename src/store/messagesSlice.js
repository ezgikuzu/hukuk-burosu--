import { createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./utils";
import { INITIAL_MESSAGES } from "../data/initialData";

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

export const messagesSlice = createSlice({
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

export const { addMessage, addMemo, deleteMemo } = messagesSlice.actions;
export default messagesSlice.reducer;
