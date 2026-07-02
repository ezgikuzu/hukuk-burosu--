import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, addMessage, showToast } from "../store";
import { DICTIONARY, autoTranslate } from "../data/initialData";
import { 
  Scale, LogOut, FileText, Calendar, Landmark, MessageSquare, 
  User, Phone, Mail, MapPin, Clock, Send, Eye, X, Copy, 
  LayoutDashboard, FileDigit, HelpCircle, ChevronRight, Download, Video
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import ClientCaseDetail from "./ClientCaseDetail";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import VideoMeeting from "./VideoMeeting";

export default function ClientDashboard() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  // Store lists
  const cases = useSelector((state) => state.cases.list);
  const documents = useSelector((state) => state.documents.list);
  const payments = useSelector((state) => state.payments.list);
  const lawyers = useSelector((state) => state.lawyers.list);
  const messages = useSelector((state) => state.messages.list);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("overview");
  
  // Selected case for details view
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Selected document viewer
  const [viewingDoc, setViewingDoc] = useState(null);
  const [videoRoom, setVideoRoom] = useState(null);

  // Chat message input
  const [typedMessage, setTypedMessage] = useState("");
  const chatEndRef = useRef(null);

  // Filter client-specific records
  const myCases = cases.filter(c => c.clientId === currentUser?.id);
  const myDocuments = documents.filter(d => d.clientId === currentUser?.id);
  const myPayments = payments.filter(p => p.clientId === currentUser?.id);
  
  // Find my assigned lawyer
  const myLawyer = lawyers.find(l => l.id === currentUser?.lawyerId) || lawyers[0];

  // My hearings (hearings linked to my cases)
  const myCaseIds = myCases.map(c => c.id);
  const hearings = useSelector((state) => state.hearings.list);
  const myHearings = hearings.filter(h => myCaseIds.includes(h.caseId));

  // Chat messages between me and my lawyer
  const myChatMessages = messages.filter(m => {
    return (
      (m.senderId === currentUser?.id && m.receiverId === myLawyer.id) ||
      (m.senderId === myLawyer.id && m.receiverId === currentUser?.id) ||
      // legacy initial messages logic
      (m.senderId === currentUser?.id && m.receiverId === "lawyer_1" && myLawyer.id === "lawyer_1") ||
      (m.senderId === "lawyer_1" && m.receiverId === currentUser?.id && myLawyer.id === "lawyer_1")
    );
  });

  // Auto scroll chat to bottom
  useEffect(() => {
    if (activeTab === "messages") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || "unknown",
      senderName: currentUser?.name || "Müvekkil",
      senderRole: "client",
      receiverId: myLawyer.id,
      content: typedMessage,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(newMsg));
    setTypedMessage("");
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    dispatch(showToast({
      message: language === "TR" ? "Metni Kopyala" : "Copy Text",
      type: "success"
    }));
  };

  const handleDownloadPDF = async (doc) => {
    // Determine which document to download (either passed doc or the currently viewing doc)
    const documentObj = doc && doc.id ? doc : viewingDoc;
    if (!documentObj) return;

    // Create a temporary off-screen element for perfect formatting
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.style.width = "800px"; // Fixed width for A4 aspect ratio approximation
    tempDiv.style.padding = "40px";
    tempDiv.style.backgroundColor = "white";
    tempDiv.style.fontFamily = "serif";
    tempDiv.style.fontSize = "14px";
    tempDiv.style.lineHeight = "1.6";
    tempDiv.style.whiteSpace = "pre-wrap";
    tempDiv.style.color = "#1e293b";
    
    // Header
    const header = document.createElement("h2");
    header.style.fontSize = "24px";
    header.style.fontWeight = "bold";
    header.style.marginBottom = "20px";
    header.style.borderBottom = "1px solid #e2e8f0";
    header.style.paddingBottom = "10px";
    header.style.color = "#1a237e";
    header.innerText = documentObj.name;
    
    // Content
    const content = document.createElement("div");
    content.innerText = documentObj.content || (language === "TR" ? "İçerik bulunamadı." : "No content found.");
    
    // Footer
    const footer = document.createElement("div");
    footer.style.marginTop = "40px";
    footer.style.paddingTop = "10px";
    footer.style.borderTop = "1px solid #e2e8f0";
    footer.style.fontSize = "12px";
    footer.style.color = "#64748b";
    footer.innerText = (language === "TR" ? "Oluşturulma Tarihi: " : "Created: ") + (documentObj.uploadedAt || "") + 
                       (language === "TR" ? " | Oluşturan: " : " | Author: ") + (documentObj.uploadedBy || "Sistem");

    tempDiv.appendChild(header);
    tempDiv.appendChild(content);
    tempDiv.appendChild(footer);
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(documentObj.name.endsWith(".pdf") ? documentObj.name : `${documentObj.name}.pdf`);
      
      dispatch(showToast({
        message: language === "TR" ? "PDF olarak indirildi" : "Downloaded as PDF",
        type: "success"
      }));
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-fade-in">
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="w-full bg-[#1a237e] text-white sticky top-0 z-30 border-b border-[#d4af37]/25 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-[#d4af37]/30">
              <Scale className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm tracking-tight sm:text-base">EDBM HUKUK PORTALI</span>
              <p className="text-[8px] tracking-widest text-[#d4af37] font-bold -mt-1 uppercase">MÜVEKKİL GİRİŞİ</p>
            </div>
          </div>

          {/* Quick tab switch (Tablet/Desktop) */}
          <nav className="hidden md:flex gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => { setActiveTab("overview"); setSelectedCase(null); }}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "overview" ? "bg-[#d4af37] text-[#1a237e]" : "text-slate-300 hover:text-white"
              }`}
            >
              {t.tabOverview}
            </button>
            <button
              onClick={() => { setActiveTab("cases"); setSelectedCase(null); }}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "cases" ? "bg-[#d4af37] text-[#1a237e]" : "text-slate-300 hover:text-white"
              }`}
            >
              {t.tabCases}
            </button>
            <button
              onClick={() => { setActiveTab("documents"); setSelectedCase(null); }}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "documents" ? "bg-[#d4af37] text-[#1a237e]" : "text-slate-300 hover:text-white"
              }`}
            >
              {t.tabDocuments}
            </button>
            <button
              onClick={() => { setActiveTab("finances"); setSelectedCase(null); }}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "finances" ? "bg-[#d4af37] text-[#1a237e]" : "text-slate-300 hover:text-white"
              }`}
            >
              {t.tabFinances}
            </button>
            <button
              onClick={() => { setActiveTab("messages"); setSelectedCase(null); }}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeTab === "messages" ? "bg-[#d4af37] text-[#1a237e]" : "text-slate-300 hover:text-white"
              }`}
            >
              {t.tabMessages}
            </button>
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            
            <button
              onClick={() => dispatch(logout())}
              className="p-1.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title={t.logout}
            >
              <LogOut className="w-4.5 h-4.5 text-red-400" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MOBILE NAVIGATION TABS (Visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-slate-100 flex overflow-x-auto p-2 scrollbar-none gap-1 shrink-0">
        <button
          onClick={() => { setActiveTab("overview"); setSelectedCase(null); }}
          className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "overview" ? "bg-[#1a237e] text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t.tabOverview}
        </button>
        <button
          onClick={() => { setActiveTab("cases"); setSelectedCase(null); }}
          className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "cases" ? "bg-[#1a237e] text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t.tabCases}
        </button>
        <button
          onClick={() => { setActiveTab("documents"); setSelectedCase(null); }}
          className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "documents" ? "bg-[#1a237e] text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t.tabDocuments}
        </button>
        <button
          onClick={() => { setActiveTab("finances"); setSelectedCase(null); }}
          className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "finances" ? "bg-[#1a237e] text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t.tabFinances}
        </button>
        <button
          onClick={() => { setActiveTab("messages"); setSelectedCase(null); }}
          className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "messages" ? "bg-[#1a237e] text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t.tabMessages}
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* Welcome banner */}
            <div className="p-6 bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-2xl text-white border border-[#d4af37]/20 shadow-md">
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">{at("Müvekkil Güvenli Portalı")}</span>
              <h2 className="font-serif text-2xl font-bold mt-1">
                {t.welcome} {currentUser?.name}
              </h2>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed max-w-2xl font-semibold">
                {language === "TR" 
                  ? "Size özel açılan bu portaldan davanızın aşamalarını izleyebilir, duruşma tarihlerinizi görebilir, evraklarınızı okuyabilir ve avukatınızla güvenli yazışabilirsiniz." 
                  : "Through this personal portal, you can follow your case status, view scheduled court hearings, download folders, and text your lawyer securely."}
              </p>
            </div>

            {/* Subgrid: Assigned lawyer card + Next hearings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* My Lawyer (Assigned Attorney Card) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1a237e] pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#d4af37]" />
                    <span>{t.assignedLawyer}</span>
                  </h3>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#1a237e]/10 text-[#1a237e] flex items-center justify-center font-serif text-lg font-bold border border-[#1a237e]/20 shadow-sm">
                      {myLawyer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{myLawyer.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === "TR" ? "Büro Ortağı Avukat" : "Partner Attorney"}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600 font-bold mb-6">
                    <p className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>{myLawyer.phone}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>{myLawyer.email}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Scale className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span className="text-slate-500 font-semibold">{myLawyer.specialization}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("messages")}
                  className="w-full py-2.5 bg-slate-50 hover:bg-[#1a237e] hover:text-white border border-slate-200 text-[#1a237e] font-bold text-xs rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === "TR" ? "Avukatıma Mesaj Gönder" : "Send Lawyer Message"}</span>
                </button>
              </div>

              {/* Next Court dates & Status */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-serif text-sm font-bold text-[#1a237e] pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>{t.recentHearings}</span>
                </h3>

                {myHearings.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-bold">
                    {language === "TR" ? "Yaklaşan duruşmanız veya randevunuz bulunmuyor." : "No upcoming hearings or conferences."}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myHearings.map((h) => {
                      const dt = new Date(h.dateTime);
                      const formattedDate = dt.toLocaleDateString(language === "TR" ? "tr-TR" : "en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      });
                      const formattedTime = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                      return (
                        <div key={h.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-[#1a237e]/20 transition-all flex justify-between items-start gap-4 text-xs">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                              {h.title}
                              {h.isVideoCall && (
                                <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 border border-indigo-100">
                                  <Video className="w-3 h-3" />
                                  {t.videoCallTitle || "Görüntülü Görüşme"}
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] text-[#d4af37] font-bold flex items-center gap-1.5">
                              {h.isVideoCall ? <Video className="w-3.5 h-3.5 shrink-0 text-indigo-400" /> : <MapPin className="w-3.5 h-3.5 shrink-0" />}
                              <span>{h.location}</span>
                            </p>
                            {h.notes && (
                              <p className="text-[10px] text-slate-500 italic mt-1 bg-white p-2 rounded border border-slate-100 font-semibold">
                                <strong>{language === "TR" ? "Notlar: " : "Notes: "}</strong> {h.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 font-bold text-[#1a237e] bg-blue-50 px-2 py-1 rounded">
                              <Clock className="w-3 h-3" />
                              {formattedTime}
                            </span>
                            <p className="text-[10px] text-slate-500 font-bold mt-1">{formattedDate}</p>
                            
                            {h.isVideoCall && (
                              <button
                                onClick={() => setVideoRoom(`EDBM-${h.id}`)}
                                className="mt-2 bg-[#1a237e] text-white hover:bg-[#12185c] px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full flex justify-center items-center gap-1 cursor-pointer"
                              >
                                <Video className="w-3 h-3" />
                                {t.joinVideoCall || "Katıl"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* MY CASES TAB */}
        {activeTab === "cases" && (
          selectedCase ? (
            <ClientCaseDetail caseId={selectedCase} onBack={() => setSelectedCase(null)} />
          ) : (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-[#1a237e]">{t.caseList}</h3>
              {myCases.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-100 text-xs shadow-sm font-bold">
                  {t.noData}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myCases.map((c) => (
                    <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start border-b border-slate-50 pb-3 mb-3">
                          <span className="font-serif text-sm font-bold text-[#1a237e] bg-slate-100 px-2.5 py-1 rounded">
                            {c.fileNo}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            c.status === "active" ? "bg-blue-50 text-blue-700" : c.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {c.status === "active" ? t.caseStatusActive.split(" (")[0] : c.status === "pending" ? t.caseStatusPending : t.caseStatusClosed.split(" (")[0]}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs">
                          <p className="text-slate-400 font-bold">{t.caseSubject}</p>
                          <h4 className="font-bold text-slate-800">{c.subject}</h4>
                          <p className="text-[11px] text-[#d4af37] font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {c.court}
                          </p>
                        </div>

                        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100 whitespace-pre-wrap leading-relaxed font-semibold mt-4 line-clamp-2">
                          {c.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-50 flex justify-between items-center">
                        <div className="text-[11px] text-slate-400 font-bold flex flex-col gap-0.5">
                          <span>{language === "TR" ? "Dava Açılış: " : "Opened: "} {c.createdAt}</span>
                          <span>{t.assignedLawyer}: {myLawyer.name}</span>
                        </div>
                        <button
                          onClick={() => setSelectedCase(c.id)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-[#1a237e] hover:text-white border border-slate-200 text-[#1a237e] text-[11px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          <span>{language === "TR" ? "Detayları Gör" : "View Details"}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {/* MY DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1a237e]">{t.documentList}</h3>
            
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              {myDocuments.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-bold">{t.noData}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">{t.docName}</th>
                        <th className="py-3 px-4">{t.docCategory}</th>
                        <th className="py-3 px-4">{t.docSize} / Type</th>
                        <th className="py-3 px-4">{t.docUploadedAt}</th>
                        <th className="py-3 px-4 text-right">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-bold">
                      {myDocuments.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#1a237e] shrink-0" />
                              <span>{d.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                              {d.category === "pleading" 
                                ? t.docCategoryPleading 
                                : d.category === "contract"
                                ? t.docCategoryContract
                                : t.docCategoryDecision}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            {d.size} ({d.fileType.toUpperCase()})
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {d.uploadedAt}
                          </td>
                          <td className="py-3 px-4 text-right space-x-0.5">
                            <button
                              onClick={() => setViewingDoc(d)}
                              className="p-1 hover:bg-slate-100 text-[#1a237e] rounded cursor-pointer animate-fade-in"
                              title={language === "TR" ? "Görüntüle" : "View"}
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(d)}
                              className="p-1 hover:bg-green-50 text-green-600 rounded cursor-pointer animate-fade-in"
                              title={language === "TR" ? "PDF İndir" : "Download PDF"}
                            >
                              <Download className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY FINANCES TAB */}
        {activeTab === "finances" && (
          <div className="space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#1a237e]">{t.financeList}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === "TR" ? "Ödediğiniz Tutar" : "Your Payments"}</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {myPayments.filter(p => p.status === "paid" || p.type === "payment").reduce((acc, p) => acc + p.amount, 0).toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === "TR" ? "Bekleyen Borç" : "Your Pending Balance"}</p>
                  <p className="text-xl font-bold text-amber-600">
                    {myPayments.filter(p => p.type === "invoice" && p.status === "pending").reduce((acc, p) => acc + p.amount, 0).toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">{t.finDesc}</th>
                    <th className="py-3 px-4">{t.finDate}</th>
                    <th className="py-3 px-4">{t.finType}</th>
                    <th className="py-3 px-4">{t.finAmount}</th>
                    <th className="py-3 px-4">{t.finStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-bold">
                  {myPayments.map((p) => {
                    const isPaid = p.status === "paid" || p.type === "payment";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/20">
                        <td className="py-3.5 px-4 font-bold text-slate-800">{p.description}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">{p.date}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.type === "payment" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"
                          }`}>
                            {p.type === "payment" ? t.finTypePayment.split(" (")[0] : t.finTypeInvoice.split(" (")[0]}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 font-mono font-bold ${isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                          {p.amount.toLocaleString("tr-TR")} ₺
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {isPaid ? t.finStatusPaid : t.finStatusPending}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MESSAGE ATTORNEY TAB */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[520px]">
            {/* Chat header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white border-b border-[#d4af37]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-full bg-white/10 flex items-center justify-center border border-[#d4af37]/30">
                  <User className="w-4.5 h-4.5 text-[#d4af37]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm leading-tight">{myLawyer.name}</h4>
                  <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-wider">{t.assignedLawyer}</p>
                </div>
              </div>
              <span className="text-[9px] text-slate-300 font-bold uppercase font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                SECURE PORTAL CHAT
              </span>
            </div>

            {/* Chat Messages stream */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-3">
              {myChatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs font-bold">
                  <MessageSquare className="w-8 h-8 text-slate-300 mb-1" />
                  <p>{language === "TR" ? "Avukatınız ile henüz bir yazışma kaydı bulunmuyor." : "No chat history with your attorney yet."}</p>
                </div>
              ) : (
                myChatMessages.map((m) => {
                  const isMe = m.senderId === currentUser?.id;
                  const time = new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-xs shadow-sm border ${
                        isMe 
                          ? "bg-[#1a237e] text-white border-[#1a237e]/10 rounded-tr-none" 
                          : "bg-white text-slate-800 border-slate-100 rounded-tl-none"
                      }`}>
                        <p className="leading-relaxed font-bold">{m.content}</p>
                        <span className={`text-[8px] block text-right mt-1 font-bold ${isMe ? "text-white/60" : "text-slate-400"}`}>
                          {time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat footer input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder={t.messagePlaceholder}
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#1a237e] font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center border-b border-indigo-950"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Document Reader dialog */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col h-[75vh]">
            <div className="px-6 py-4 bg-[#1a237e] text-white flex justify-between items-center border-b border-[#d4af37]/20">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#d4af37]" />
                {viewingDoc.name}
              </h3>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <div id="document-content" className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-wrap min-h-full">
                {viewingDoc.content || at("Bu belgenin içeriği bulunmuyor.")}
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 font-bold">{viewingDoc.uploadedAt}</span>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-[#1a237e] rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === "TR" ? "İndir (PDF)" : "Download (PDF)"}</span>
                </button>
                <button
                  onClick={() => handleCopyText(viewingDoc.content || "")}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === "TR" ? "Kopyala" : "Copy"}</span>
                </button>
                <button
                  onClick={() => setViewingDoc(null)}
                  className="px-4 py-1.5 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {at("Kapat")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Meeting */}
      {videoRoom && (
        <VideoMeeting 
          roomName={videoRoom} 
          onClose={() => setVideoRoom(null)} 
          subject={t.videoCallTitle}
        />
      )}

      {/* Corporate footer */}
      <footer className="w-full text-center py-5 bg-white border-t border-slate-100 text-xs text-slate-400 font-bold">
        © 2026 EDBM Hukuk Bürosu. Güvenli Müvekkil Bilgilendirme Portalı.
      </footer>
    </div>
  );
}
