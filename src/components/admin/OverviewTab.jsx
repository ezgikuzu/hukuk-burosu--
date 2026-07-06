import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../store";
import { DICTIONARY, autoTranslate } from "../../data/initialData";
import { 
  Users, Scale, Calendar, Landmark, CreditCard, ChevronRight, 
  ArrowUpRight, Clock, Plus, UserPlus, FileText, AlertCircle 
} from "lucide-react";

export default function OverviewTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const rawClients = useSelector((state) => state.clients.list);
  const rawCases = useSelector((state) => state.cases.list);
  const rawHearings = useSelector((state) => state.hearings.list);
  const rawPayments = useSelector((state) => state.payments.list);

  // Listeleri aktif avukata göre filtrele
  const isLawyer = currentUser?.role === "lawyer";
  
  const clients = isLawyer 
    ? rawClients.filter(c => c.lawyerId === currentUser.id)
    : rawClients;

  const cases = isLawyer
    ? rawCases.filter(c => c.lawyerId === currentUser.id)
    : rawCases;

  const hearings = isLawyer
    ? rawHearings.filter(h => h.lawyerId === currentUser.id)
    : rawHearings;

  const payments = isLawyer
    ? rawPayments.filter(p => clients.some(c => c.id === p.clientId))
    : rawPayments;

  // Metrikleri filtrele veya işle
  const activeCasesCount = cases.filter(c => c.status === "active").length;
  
  const totalReceived = payments
    .filter(p => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === "pending")
    .reduce((acc, p) => acc + p.amount, 0);

  // Aktif avukat için yaklaşan duruşmalar
  const lawyerHearings = hearings
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Son ödemeler
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Karşılama Alanı */}
      <div className="p-6 bg-gradient-to-r from-[#1a237e] to-[#283593] rounded-xl text-white shadow-md relative overflow-hidden border border-[#d4af37]/20 animate-fade-in">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
        <h2 className="font-serif text-2xl font-bold">
          {t.welcome} {currentUser?.name}
        </h2>
        <p className="text-slate-300 text-xs mt-1 max-w-xl font-medium">
          {language === "TR" 
            ? "EDBM Hukuk Otomasyon paneline hoş geldiniz. Bugün planlanmış duruşmalarınızı ve cari hareketlerinizi buradan takip edebilirsiniz." 
            : "Welcome to EDBM Legal Automation Panel. You can track your scheduled hearings and current financial movements here."}
        </p>
      </div>

      {/* Metrikler Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Müvekkiller Metriği */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.totalClients}</p>
            <p className="text-2xl font-bold text-[#1a237e]">{clients.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 text-[#1a237e]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Aktif Davalar Metriği */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.totalCases}</p>
            <p className="text-2xl font-bold text-[#1a237e]">{activeCasesCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Duruşmalar Metriği */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.totalHearings}</p>
            <p className="text-2xl font-bold text-[#1a237e]">{lawyerHearings.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Finans Metriği */}
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.totalRevenue}</p>
            <p className="text-xl font-bold text-[#1a237e]">{totalReceived.toLocaleString("tr-TR")} ₺</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Ana Izgara: Yaklaşan Duruşmalar + Finans ve Hızlı İşlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol Sütun: Duruşmalar (7 sütun) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1a237e]" />
                {t.recentHearings}
              </h3>
              <button 
                onClick={() => dispatch(setActiveTab("calendar"))}
                className="text-xs text-[#1a237e] hover:text-[#d4af37] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{language === "TR" ? "Tümünü Gör" : "View All"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {lawyerHearings.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-bold">
                {t.noHearings}
              </div>
            ) : (
              <div className="space-y-3">
                {lawyerHearings.slice(0, 3).map((h) => {
                  const relatedCase = cases.find(c => c.id === h.caseId);
                  const client = clients.find(c => c.id === relatedCase?.clientId);
                  const dt = new Date(h.dateTime);
                  const formattedDate = dt.toLocaleDateString(language === "TR" ? "tr-TR" : "en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  });
                  const formattedTime = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                  return (
                    <div key={h.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-[#1a237e]/20 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                            {relatedCase?.fileNo || at("Dosya Yok (Danışmanlık)")}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800">{h.title}</h4>
                          <p className="text-xs text-slate-500 font-semibold">{h.location}</p>
                          <p className="text-xs text-slate-400 mt-1 italic font-semibold">
                            {language === "TR" ? "Müvekkil: " : "Client: "} {client?.name || at("Müvekkil Yok")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a237e] bg-blue-50 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            {formattedTime}
                          </span>
                          <p className="text-[10px] text-slate-500 font-bold mt-1">{formattedDate}</p>
                        </div>
                      </div>
                      {h.notes && (
                        <div className="mt-3 p-2 bg-white rounded border border-slate-100 text-xs text-slate-600 flex items-start gap-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{h.notes}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hızlı İşlem Paneli */}
          <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-serif text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-50">
              {t.quickActions}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => dispatch(setActiveTab("clients"))}
                className="p-4 rounded-lg bg-blue-50/50 hover:bg-blue-50 border border-blue-100/40 text-center transition-all group cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-slate-700 block">{t.newClient}</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab("cases"))}
                className="p-4 rounded-lg bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/40 text-center transition-all group cursor-pointer"
              >
                <Scale className="w-5 h-5 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-slate-700 block">{t.newCase}</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab("calendar"))}
                className="p-4 rounded-lg bg-amber-50/50 hover:bg-amber-50 border border-amber-100/40 text-center transition-all group cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-slate-700 block">{t.newHearing}</span>
              </button>

              <button
                onClick={() => dispatch(setActiveTab("documents"))}
                className="p-4 rounded-lg bg-purple-50/50 hover:bg-purple-50 border border-purple-100/40 text-center transition-all group cursor-pointer"
              >
                <FileText className="w-5 h-5 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-slate-700 block">{t.newDocument}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Sütun: Finansal Özet ve Cari Liste (5 sütun) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-slate-800 mb-4 pb-3 border-b border-slate-50 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#1a237e]" />
                {t.financialSummary}
              </h3>

              {/* Mini Fatura Halkası */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">{t.totalRevenue}</span>
                    <span className="text-sm font-bold text-emerald-600">
                      +{totalReceived.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full" 
                      style={{ width: `${(totalReceived / (totalReceived + totalPending || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">{t.pendingRevenue}</span>
                    <span className="text-sm font-bold text-amber-600">
                      {totalPending.toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{ width: `${(totalPending / (totalReceived + totalPending || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={() => dispatch(setActiveTab("finances"))}
                className="w-full py-2 bg-slate-50 hover:bg-[#1a237e] hover:text-white border border-slate-200 text-[#1a237e] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer"
              >
                <span>{at("Cari Hesap Ekstresi")}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Son Cari Hareket Günlükleri */}
          <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-serif text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-50">
              {at("Son Cari Hareketler")}
            </h3>
            <div className="space-y-2.5">
              {recentPayments.length === 0 ? (
                <p className="text-slate-400 text-xs font-bold text-center py-4">{at("Kayıt bulunamadı.")}</p>
              ) : (
                recentPayments.map((p) => {
                  const client = clients.find(c => c.id === p.clientId);
                  return (
                    <div key={p.id} className="flex justify-between items-center p-2.5 rounded bg-slate-50/50 hover:bg-slate-50 border border-slate-100 text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 line-clamp-1">{client?.name || at("Müvekkil Yok")}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1 font-semibold">{p.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-bold ${p.status === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                          {p.status === "paid" ? "+" : ""}{p.amount.toLocaleString("tr-TR")} ₺
                        </span>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-bold">{p.date}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
