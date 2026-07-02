import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, addMemo, deleteMemo, showToast } from "../../store";
import { DICTIONARY, autoTranslate } from "../../data/initialData";
import { 
  Send, MessageSquare, Clipboard, User, Calendar, Plus, 
  Trash2, ShieldCheck, Mail, Pin, Paperclip, CheckCircle2 
} from "lucide-react";

export default function MessagesTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const messages = useSelector((state) => state.messages.list);
  const memos = useSelector((state) => state.messages.memos);
  const rawClients = useSelector((state) => state.clients.list);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const isLawyer = currentUser?.role === "lawyer";

  // Filter clients list for lawyers (Excluding leads/visitors)
  const clients = isLawyer 
    ? rawClients.filter((cl) => cl.lawyerId === currentUser.id && !cl.id.startsWith("lead_"))
    : rawClients.filter((cl) => !cl.id.startsWith("lead_"));

  // Chat States
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [typedMessage, setTypedMessage] = useState("");

  // Memo States
  const [typedMemo, setTypedMemo] = useState("");

  const chatEndRef = useRef(null);

  // Sync selectedClientId if clients list changes
  useEffect(() => {
    if (clients.length > 0 && !clients.some(c => c.id === selectedClientId)) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients]);

  // Scroll to bottom when message list changes or client changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedClientId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedClientId) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || "unknown",
      senderName: currentUser?.name || "Avukat",
      senderRole: "lawyer",
      receiverId: selectedClientId,
      content: typedMessage,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(newMsg));
    setTypedMessage("");
  };

  const handlePublishMemo = (e) => {
    e.preventDefault();
    if (!typedMemo.trim()) return;

    dispatch(addMemo({
      id: `memo_${Date.now()}`,
      authorName: currentUser?.name || "Avukat",
      content: typedMemo,
      timestamp: new Date().toISOString().slice(0, 16),
    }));

    setTypedMemo("");
    dispatch(showToast({
      message: language === "TR" ? "Duyuru ilan panosunda yayınlandı!" : "Announcement posted on notice board!",
      type: "success"
    }));
  };

  const handleDeleteMemo = (id) => {
    dispatch(deleteMemo(id));
  };

  // Filter messages for current selected client & logged in lawyer
  const activeChatMessages = messages.filter((m) => {
    return (
      (m.senderId === selectedClientId && m.receiverId === currentUser?.id) ||
      (m.senderId === currentUser?.id && m.receiverId === selectedClientId) ||
      // fallback in case of legacy initial messages that are linked between specific lawyers
      (m.senderId === selectedClientId && m.receiverId === "lawyer_1" && currentUser?.id === "lawyer_1") ||
      (m.senderId === "lawyer_1" && m.receiverId === selectedClientId && currentUser?.id === "lawyer_1")
    );
  });

  const activeClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* LEFT SECTION: Secure Client Chat (7 Cols) */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[560px]">
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white border-b border-[#d4af37]/20 shrink-0 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-[#d4af37]/30">
              <MessageSquare className="w-4.5 h-4.5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif">{t.messagesTitle}</h3>
              <p className="text-[10px] text-[#d4af37] font-bold tracking-wide uppercase">
                {language === "TR" ? "Müvekkil Güvenli İletişim Hattı" : "Client Encrypted Link"}
              </p>
            </div>
          </div>

          {/* Client Selector Dropdown */}
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-white/10 text-white border border-white/20 rounded px-2.5 py-1 text-xs font-bold focus:outline-none focus:bg-[#1a237e]"
          >
            {clients.length === 0 ? (
              <option className="text-slate-800" disabled>{at("Müvekkil Yok")}</option>
            ) : (
              clients.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-800 font-sans font-bold">
                  {c.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-3.5">
          {clients.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-1.5 text-xs font-bold">
              <Mail className="w-8 h-8 text-slate-300" />
              <p>{at("Görüntülenecek veya mesaj gönderilecek size atanmış müvekkil bulunmuyor.")}</p>
            </div>
          ) : activeChatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-1.5 text-xs font-bold">
              <Mail className="w-8 h-8 text-slate-300" />
              <p>
                {language === "TR" 
                  ? `${activeClient?.name || "Müvekkil"} ile henüz mesajlaşma bulunmuyor.` 
                  : `No messages with ${activeClient?.name || "client"} yet.`}
              </p>
              <p className="text-[10px] text-slate-400 font-bold">
                {language === "TR" ? "Aşağıdan ilk mesajı gönderin." : "Send the first message below."}
              </p>
            </div>
          ) : (
            activeChatMessages.map((m) => {
              const isMe = m.senderId === currentUser?.id;
              const time = new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <div 
                  key={m.id} 
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm border ${
                    isMe 
                      ? "bg-[#1a237e] text-white border-[#1a237e]/10 rounded-tr-none" 
                      : "bg-white text-slate-800 border-slate-100 rounded-tl-none"
                  }`}>
                    {!isMe && (
                      <p className="text-[9px] font-bold text-[#d4af37] uppercase tracking-wider mb-0.5">
                        {m.senderName}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed font-sans font-bold">{m.content}</p>
                    <span className={`text-[8px] block text-right mt-1 font-semibold ${isMe ? "text-white/60" : "text-slate-400"}`}>
                      {time}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Footer */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 shrink-0 flex gap-2">
          <input
            disabled={clients.length === 0}
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] font-semibold"
          />
          <button
            disabled={clients.length === 0}
            type="submit"
            className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] disabled:bg-slate-300 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border-b border-indigo-950"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* RIGHT SECTION: Lawyers Bulletin/Notice Board (5 Cols) */}
      <div className="lg:col-span-5 space-y-5">
        {/* Memo Input Card */}
        <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-serif text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Pin className="w-4.5 h-4.5 text-[#d4af37]" />
            <span>{t.internalMemos}</span>
          </h3>

          <form onSubmit={handlePublishMemo} className="space-y-2.5">
            <textarea
              value={typedMemo}
              onChange={(e) => setTypedMemo(e.target.value)}
              placeholder={t.memoPlaceholder}
              rows={2}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] resize-none font-semibold"
            />
            <button
              type="submit"
              className="w-full py-1.5 px-4 bg-slate-50 hover:bg-[#1a237e] hover:text-white text-[#1a237e] font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addMemoBtn}</span>
            </button>
          </form>
        </div>

        {/* Memos List */}
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {memos.map((m) => {
            const timeFormatted = new Date(m.timestamp).toLocaleDateString(language === "TR" ? "tr-TR" : "en-US", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <div key={m.id} className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-xl relative group hover:border-[#1a237e]/20 transition-all">
                <span className="absolute top-2.5 right-2.5 text-amber-500">
                  <Pin className="w-3.5 h-3.5 rotate-45" />
                </span>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-[#1a237e] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {m.authorName}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-bold">
                    {m.content}
                  </p>
                  
                  <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100">
                    <span>{timeFormatted}</span>
                    <button
                      onClick={() => handleDeleteMemo(m.id)}
                      className="text-slate-300 hover:text-red-500 p-0.5 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
