import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../../store";
import { DICTIONARY, autoTranslate } from "../../data/initialData";
import { Send, Mail, User } from "lucide-react";

export default function WebMessagesTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const messages = useSelector((state) => state.messages.list);
  const rawClients = useSelector((state) => state.clients.list);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const isLawyer = currentUser?.role === "lawyer";

  const leads = isLawyer 
    ? rawClients.filter((cl) => (cl.lawyerId === currentUser.id || cl.lawyerId === "all") && cl.id.startsWith("lead_"))
    : rawClients.filter((cl) => cl.id.startsWith("lead_"));

  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || "");
  const [typedMessage, setTypedMessage] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (leads.length > 0 && !leads.some(c => c.id === selectedLeadId)) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedLeadId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedLeadId) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || "unknown",
      senderName: currentUser?.name || "Avukat",
      senderRole: "lawyer",
      receiverId: selectedLeadId,
      content: typedMessage,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(newMsg));
    setTypedMessage("");
  };

  const activeLead = leads.find(c => c.id === selectedLeadId);

  const activeChatMessages = messages.filter((m) => {
    if (m.senderId === selectedLeadId) {
      return m.receiverId === currentUser?.id || m.receiverId === "all";
    }
    if (m.receiverId === selectedLeadId) {
      if (activeLead?.lawyerId === "all") {
        return true;
      }
      return m.senderId === currentUser?.id;
    }
    return false;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      
      <div className="lg:col-span-12 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
        
        <div className="px-5 py-4 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white border-b border-[#d4af37]/20 shrink-0 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif">{language === "TR" ? "Gelen Form Mesajları" : "Inbox (Web Forms)"}</h3>
              <p className="text-[10px] text-[#d4af37] font-bold tracking-wide uppercase">
                {language === "TR" ? "Web Sitesi İletişim Formları" : "Website Contact Forms"}
              </p>
            </div>
          </div>

          
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="bg-white/10 text-white border border-white/30 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:bg-[#1a237e]"
          >
            {leads.length === 0 ? (
              <option className="text-slate-800" disabled>{at("Mesaj Yok")}</option>
            ) : (
              leads.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-800 font-sans font-bold">
                  {c.name}
                </option>
              ))
            )}
          </select>
        </div>

        
        <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-slate-50 space-y-4">
          {leads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 text-xs font-bold">
              <Mail className="w-10 h-10 text-slate-300 mb-2" />
              <p>{language === "TR" ? "İletişim formundan gelen herhangi bir mesaj bulunmuyor." : "No messages from the contact form."}</p>
            </div>
          ) : activeChatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 text-xs font-bold">
              <Mail className="w-10 h-10 text-slate-300 mb-2" />
              <p>{language === "TR" ? "Bu kişiyle henüz bir konuşma başlatmadınız." : "No conversation with this person yet."}</p>
            </div>
          ) : (
            activeChatMessages.map((msg, idx) => {
              const isMine = msg.senderId === currentUser?.id;
              
              let displayContent = msg.content;
              if (!isMine && msg.content.includes("İletişim Formu:")) {
                const parts = msg.content.split('\n');
                displayContent = (
                  <div className="bg-[#1a237e]/5 p-3 rounded border border-[#1a237e]/10 font-medium">
                    {parts.map((p, i) => <div key={i} className={i===0 ? "font-bold text-[#1a237e] mb-1" : "text-slate-700"}>{p}</div>)}
                  </div>
                );
              }

              return (
                <div key={msg.id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"} animate-fade-in`}>
                  {!isMine && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center mr-2 shrink-0 mt-1 text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm text-xs font-medium leading-relaxed border ${
                    isMine 
                      ? "bg-[#1a237e] text-white border-[#12185c] rounded-tr-none" 
                      : "bg-white text-slate-800 border-slate-200 rounded-tl-none"
                  }`}>
                    {typeof displayContent === "string" ? displayContent : displayContent}
                    <div className={`text-[9px] mt-1.5 font-bold text-right ${isMine ? "text-indigo-200" : "text-slate-400"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        
        {leads.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder={language === "TR" ? "Ziyaretçiye cevap yaz..." : "Type a reply to visitor..."}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1a237e] font-medium"
              />
              <button 
                type="submit"
                disabled={!typedMessage.trim()}
                className="bg-[#1a237e] hover:bg-[#12185c] disabled:bg-slate-200 disabled:cursor-not-allowed text-white w-12 h-12 flex items-center justify-center rounded-xl transition-all border-b-2 border-[#12185c] disabled:border-slate-300 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
