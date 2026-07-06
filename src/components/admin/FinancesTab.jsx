import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPayment, updatePaymentStatus, deletePayment, showToast, showConfirm } from "../../store";
import { DICTIONARY, autoTranslate } from "../../data/initialData";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Plus, Trash2, CheckCircle2, AlertCircle, Landmark, CreditCard, 
  DollarSign, ChevronDown, Check, X, FileText, User, Calendar, Users, Percent 
} from "lucide-react";

export default function FinancesTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const rawPayments = useSelector((state) => state.payments.list);
  const rawClients = useSelector((state) => state.clients.list);
  const rawCases = useSelector((state) => state.cases.list);
  const rawLawyers = useSelector((state) => state.lawyers?.list || []);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const isLawyer = currentUser?.role === "lawyer";

  const clients = isLawyer 
    ? rawClients.filter((cl) => cl.lawyerId === currentUser.id)
    : rawClients;

  const cases = isLawyer
    ? rawCases.filter((c) => c.lawyerId === currentUser.id)
    : rawCases;

  const payments = isLawyer
    ? rawPayments.filter((p) => clients.some(c => c.id === p.clientId))
    : rawPayments;

  const [filterStatus, setFilterStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("invoice");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [lawyerSharePct, setLawyerSharePct] = useState(50);

  const openAddModal = () => {
    setClientId(clients[0]?.id || "");
    setCaseId(cases[0]?.id || "");
    setAmount("");
    setType("invoice");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setStatus("pending");
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!clientId) {
      dispatch(showToast({
        message: language === "TR" ? "Lütfen bir müvekkil seçiniz." : "Please select a client.",
        type: "error"
      }));
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      dispatch(showToast({
        message: language === "TR" ? "Lütfen geçerli bir tutar giriniz." : "Please enter a valid amount.",
        type: "error"
      }));
      return;
    }

    const newPaymentObj = {
      id: `pay_${Date.now()}`,
      clientId,
      caseId,
      amount: value,
      type,
      date,
      description,
      status: type === "payment" ? "paid" : status,
    };

    dispatch(addPayment(newPaymentObj));
    setIsModalOpen(false);
  };

  const handleMarkAsPaid = (id) => {
    dispatch(updatePaymentStatus({ id, status: "paid" }));
  };

  const handleDelete = (id) => {
    dispatch(showConfirm({
      message: language === "TR" ? "Bu cari hareketi silmek istediğinize emin misiniz?" : "Are you sure you want to delete this financial ledger?",
      actionToDispatch: deletePayment(id)
    }));
  };

  const totalInvoiced = payments
    .filter(p => p.type === "invoice")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalCollected = payments
    .filter(p => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPending = payments
    .filter(p => p.type === "invoice" && p.status === "pending")
    .reduce((acc, p) => acc + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "paid") return p.status === "paid" || p.type === "payment";
    if (filterStatus === "pending") return p.status === "pending" && p.type === "invoice";
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const chartData = clients.map((client) => {
    const clientPayments = payments.filter((p) => p.clientId === client.id);
    const paidSum = clientPayments
      .filter((p) => p.status === "paid" || p.type === "payment")
      .reduce((acc, p) => acc + p.amount, 0);
    const pendingSum = clientPayments
      .filter((p) => p.type === "invoice" && p.status === "pending")
      .reduce((acc, p) => acc + p.amount, 0);

    return {
      name: client.name.split(" ")[0],
      [language === "TR" ? "Tahsil Edilen" : "Collected"]: paidSum,
      [language === "TR" ? "Bekleyen" : "Pending"]: pendingSum,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#1a237e]">{t.financeList}</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {language === "TR" 
              ? "Müvekkil vekalet alacaklarını, yapılan ödemeleri, mahkeme harç giderlerini ve cari hesapları yönetin." 
              : "Manage client retainer receivables, payments made, court fees, and client accounts ledger."}
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-[#d4af37] font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm border border-[#d4af37]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>{t.newInvoice}</span>
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 animate-fade-in">
          <div className="p-3.5 rounded-lg bg-indigo-50 text-[#1a237e]">
            <FileText className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{language === "TR" ? "Toplam Talep Edilen" : "Total Billed"}</p>
            <p className="text-xl font-bold text-slate-800">{totalInvoiced.toLocaleString("tr-TR")} ₺</p>
          </div>
        </div>

        
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 animate-fade-in">
          <div className="p-3.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t.totalRevenue}</p>
            <p className="text-xl font-bold text-emerald-600">+{totalCollected.toLocaleString("tr-TR")} ₺</p>
          </div>
        </div>

        
        <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 animate-fade-in">
          <div className="p-3.5 rounded-lg bg-amber-50 text-amber-600">
            <AlertCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{t.pendingRevenue}</p>
            <p className="text-xl font-bold text-amber-600">{totalPending.toLocaleString("tr-TR")} ₺</p>
          </div>
        </div>
      </div>

      
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
        <h3 className="font-serif text-sm font-bold text-[#1a237e] mb-4">
          {t.revenueChart}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }} />
              <Tooltip contentStyle={{ fontSize: 11, fontWeight: 700 }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, fontWeight: 700 }} />
              <Bar 
                dataKey={language === "TR" ? "Tahsil Edilen" : "Collected"} 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey={language === "TR" ? "Bekleyen" : "Pending"} 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
        
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-xs font-bold text-slate-700">
            {language === "TR" ? "Cari Hesap Ekstresi" : "Cari Account Statement"}
          </h3>

          <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200 gap-1">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === "all" ? "bg-white text-[#1a237e] shadow-sm" : "text-slate-500"
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setFilterStatus("paid")}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === "paid" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
              }`}
            >
              {t.finStatusPaid}
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === "pending" ? "bg-white text-amber-700 shadow-sm" : "text-slate-500"
              }`}
            >
              {t.finStatusPending}
            </button>
          </div>
        </div>

        
        {filteredPayments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">{t.noData}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">{t.clientName}</th>
                  <th className="py-3 px-4">{t.finDesc}</th>
                  <th className="py-3 px-4">{t.finDate}</th>
                  <th className="py-3 px-4">{t.finType}</th>
                  <th className="py-3 px-4">{t.finAmount}</th>
                  <th className="py-3 px-4">{t.finStatus}</th>
                  <th className="py-3 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-semibold">
                {filteredPayments.map((p) => {
                  const client = clients.find(c => c.id === p.clientId);
                  const isPaid = p.status === "paid" || p.type === "payment";

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {client?.name || at("Bilinmeyen Müvekkil")}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {p.description}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {p.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.type === "payment" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : "bg-indigo-50 text-indigo-700"
                        }`}>
                          {p.type === "payment" ? t.finTypePayment.split(" (")[0] : t.finTypeInvoice.split(" (")[0]}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 font-mono font-bold ${isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                        {p.amount.toLocaleString("tr-TR")} ₺
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isPaid 
                            ? "bg-emerald-50 text-emerald-700" 
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {isPaid ? t.finStatusPaid : t.finStatusPending}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1 shrink-0">
                        {!isPaid && p.type === "invoice" && (
                          <button
                            onClick={() => handleMarkAsPaid(p.id)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded text-[10px] transition-colors cursor-pointer"
                          >
                            {at("Ödendi Yap")}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer inline-block"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      
      {!isLawyer && (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm animate-fade-in mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1a237e] flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-[#d4af37]" />
                {at("Kâr ve Pay Dağıtımı (Avukat Hak edişleri)")}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {at("Tahsil edilen ödemeler (ödendi olanlar) üzerinden avukat ve büro paylarını hesaplayın.")}
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5" />
                {at("Avukat Komisyon Oranı:")}
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={lawyerSharePct} 
                  onChange={(e) => setLawyerSharePct(Number(e.target.value))}
                  className="w-24 accent-[#1a237e] cursor-pointer"
                />
                <span className="text-sm font-extrabold text-[#1a237e] w-12 text-right">
                  %{lawyerSharePct}
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">{at("Avukat Adı")}</th>
                  <th className="py-3 px-4 text-right">{at("Toplam Tahsilat")}</th>
                  <th className="py-3 px-4 text-right text-[#1a237e]">{at("Büro Payı")} (%{100 - lawyerSharePct})</th>
                  <th className="py-3 px-4 text-right text-emerald-600">{at("Avukat Hak Edisi")} (%{lawyerSharePct})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                {rawLawyers.map(lawyer => {
                  const lawyerClients = rawClients.filter(c => c.lawyerId === lawyer.id);
                  const lawyerCollected = rawPayments
                    .filter(p => lawyerClients.some(c => c.id === p.clientId))
                    .filter(p => p.status === "paid" || p.type === "payment")
                    .reduce((acc, p) => acc + p.amount, 0);
                    
                  if(lawyerCollected === 0) return null;
                  
                  const lawyerShare = lawyerCollected * (lawyerSharePct / 100);
                  const firmShare = lawyerCollected - lawyerShare;
                  
                  return (
                    <tr key={lawyer.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-[10px] shrink-0">
                           {lawyer.name.charAt(0)}
                         </div>
                         {lawyer.name}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        {lawyerCollected.toLocaleString("tr-TR")} ₺
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1a237e]">
                        {firmShare.toLocaleString("tr-TR")} ₺
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 bg-emerald-50/30">
                        {lawyerShare.toLocaleString("tr-TR")} ₺
                      </td>
                    </tr>
                  )
                })}
                {rawLawyers.every(lawyer => {
                   const lawyerClients = rawClients.filter(c => c.lawyerId === lawyer.id);
                   return rawPayments
                    .filter(p => lawyerClients.some(c => c.id === p.clientId))
                    .filter(p => p.status === "paid" || p.type === "payment")
                    .reduce((acc, p) => acc + p.amount, 0) === 0;
                }) && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 text-xs font-bold">
                      {at("Henüz hiçbir avukatın dosyasından tahsilat yapılmamış.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden">
            
            <div className="px-6 py-4 bg-[#1a237e] text-white flex justify-between items-center border-b border-[#d4af37]/20">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Landmark className="w-4.5 h-4.5 text-[#d4af37]" />
                {t.addFinanceBtn}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.caseClient} *
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] font-semibold"
                >
                  <option value="" disabled>{at("Müvekkil Seçiniz")}</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === "TR" ? "Dosya Numarası" : "Case File"}
                </label>
                <select
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-semibold"
                >
                  <option value="">{language === "TR" ? "Dosya Yok (Danışmanlık)" : "No Case (Consultancy)"}</option>
                  {cases.filter(c => c.clientId === clientId).map(c => (
                    <option key={c.id} value={c.id}>{c.fileNo} - {c.court.split(" ")[0]}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.finType} *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-semibold"
                  >
                    <option value="invoice">{t.finTypeInvoice.split(" (")[0]}</option>
                    <option value="payment">{t.finTypePayment.split(" (")[0]}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.finAmount} (TRY) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.finDate} *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-semibold"
                  />
                </div>

                {type === "invoice" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.finStatus} *
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-semibold"
                    >
                      <option value="pending">{t.finStatusPending}</option>
                      <option value="paid">{t.finStatusPaid}</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.finDesc} *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Danışmanlık Hizmet Ücreti"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e]"
                />
              </div>

              
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-xs font-bold cursor-pointer border-b-2 border-indigo-950"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
