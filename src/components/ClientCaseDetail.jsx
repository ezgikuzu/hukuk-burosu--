import React from "react";
import { useSelector } from "react-redux";
import { DICTIONARY, autoTranslate } from "../data/initialData";
import { 
  ArrowLeft, Scale, MapPin, User, FileText, 
  Calendar, Landmark, Clock, CheckCircle, AlertCircle, Video
} from "lucide-react";
import VideoMeeting from "./VideoMeeting";

export default function ClientCaseDetail({ caseId, onBack }) {
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const [videoRoom, setVideoRoom] = React.useState(null);

  const cases = useSelector((state) => state.cases.list);
  const lawyers = useSelector((state) => state.lawyers.list);
  const hearings = useSelector((state) => state.hearings.list);
  const payments = useSelector((state) => state.payments.list);

  const caseData = cases.find((c) => c.id === caseId);

  if (!caseData) return null;

  const lawyerObj = lawyers.find((l) => l.id === caseData.lawyerId);
  const caseHearings = hearings.filter((h) => h.caseId === caseId);
  const casePayments = payments.filter((p) => p.caseId === caseId);

  const isClosed = caseData.status === "closed";
  const isActive = caseData.status === "active";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1a237e]">
            {language === "TR" ? "Dava Dosyası Detayı" : "Case File Details"}
          </h2>
          <p className="text-xs text-slate-500 font-semibold">{caseData.fileNo}</p>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Scale className="w-48 h-48" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 justify-between">
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  isActive ? "bg-blue-50 text-blue-700 border border-blue-100" :
                  isClosed ? "bg-slate-100 text-slate-500 border border-slate-200" :
                  "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {isActive && <Scale className="w-3 h-3" />}
                  {isClosed && <CheckCircle className="w-3 h-3" />}
                  {!isActive && !isClosed && <AlertCircle className="w-3 h-3" />}
                  {isActive ? t.caseStatusActive.split(" (")[0] : isClosed ? t.caseStatusClosed.split(" (")[0] : t.caseStatusPending}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {language === "TR" ? "Açılış: " : "Opened: "} {caseData.createdAt}
                </span>
              </div>
              
              <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">{caseData.subject}</h3>
              
              <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
                <MapPin className="w-4 h-4" />
                <span>{caseData.court}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">{t.caseOpposing}</p>
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{caseData.opposingParty}</span>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">{t.assignedLawyer}</p>
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-[#1a237e]/10 text-[#1a237e] flex items-center justify-center font-bold text-[10px]">
                    {lawyerObj?.name?.charAt(0) || "A"}
                  </div>
                  <span>{lawyerObj?.name || at("Bilinmiyor")}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-bold mb-2">{t.caseDesc}</p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {caseData.description || at("Bu dosya için eklenmiş bir açıklama bulunmuyor.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hearings */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h4 className="font-serif text-sm font-bold text-[#1a237e] pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span>{t.recentHearings}</span>
          </h4>
          
          {caseHearings.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-bold">
              {language === "TR" ? "Bu dosyaya ait duruşma bulunmuyor." : "No hearings found for this case."}
            </div>
          ) : (
            <div className="space-y-3">
              {caseHearings.map(h => {
                const dt = new Date(h.dateTime);
                const formattedDate = dt.toLocaleDateString(language === "TR" ? "tr-TR" : "en-US", {
                  day: "numeric", month: "long", year: "numeric"
                });
                const formattedTime = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={h.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        {h.title}
                        {h.isVideoCall && (
                          <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 border border-indigo-100">
                            <Video className="w-3 h-3" />
                            {t.videoCallTitle || "Görüntülü Görüşme"}
                          </span>
                        )}
                      </h5>
                      <p className="text-[10px] text-[#d4af37] font-bold flex items-center gap-1">
                        {h.isVideoCall ? <Video className="w-3 h-3 text-indigo-400" /> : <MapPin className="w-3 h-3" />}
                        <span>{h.location}</span>
                      </p>
                      {h.notes && (
                        <p className="text-[10px] text-slate-500 mt-2 font-semibold bg-white p-2 border border-slate-100 rounded">
                          {h.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 font-bold text-[#1a237e] bg-blue-50 px-2 py-1 rounded text-xs">
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

        {/* Payments / Financials */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h4 className="font-serif text-sm font-bold text-[#1a237e] pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#d4af37]" />
            <span>{language === "TR" ? "Dosya Finansal Kayıtları" : "Case Financial Records"}</span>
          </h4>

          {casePayments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-bold">
              {language === "TR" ? "Bu dosyaya ait finansal kayıt bulunmuyor." : "No financial records found for this case."}
            </div>
          ) : (
            <div className="space-y-3">
              {casePayments.map(p => {
                const isPaid = p.status === "paid" || p.type === "payment";
                return (
                  <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{p.description}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.date}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`text-sm font-bold ${isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                        {p.amount.toLocaleString("tr-TR")} ₺
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {isPaid ? t.finStatusPaid : t.finStatusPending}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Video Meeting */}
      {videoRoom && (
        <VideoMeeting 
          roomName={videoRoom} 
          onClose={() => setVideoRoom(null)} 
          subject={t.videoCallTitle}
        />
      )}
    </div>
  );
}
