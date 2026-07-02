import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, addLawyer, deleteLawyer, addClient, updateClient, deleteClient, showToast, showConfirm } from "../store";
import { DICTIONARY, autoTranslate } from "../data/initialData";
import { 
  Scale, LogOut, Users, Briefcase, Calendar, FileText, 
  DollarSign, Landmark, Plus, Trash2, Eye, ShieldCheck, CheckCircle2, TrendingUp, RefreshCw, Layers,
  UserCheck, Edit, Lock, X
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const currentUser = useSelector((state) => state.auth.currentUser);
  
  // Select firm-wide lists from Redux store
  const lawyers = useSelector((state) => state.lawyers.list);
  const clients = useSelector((state) => state.clients.list);
  const cases = useSelector((state) => state.cases.list);
  const hearings = useSelector((state) => state.hearings.list);
  const documents = useSelector((state) => state.documents.list);
  const payments = useSelector((state) => state.payments.list);
  const memos = useSelector((state) => state.messages.memos);

  // Translate helper
  const at = (text) => autoTranslate(text, language);

  // Local states
  const [activeTab, setActiveTab] = useState("overview");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);
  const [showAddLawyerModal, setShowAddLawyerModal] = useState(false);
  
  // Form states for new lawyer
  const [newLawyerName, setNewLawyerName] = useState("");
  const [newLawyerEmail, setNewLawyerEmail] = useState("");
  const [newLawyerPhone, setNewLawyerPhone] = useState("");
  const [newLawyerSpec, setNewLawyerSpec] = useState("");
  const [newLawyerColor, setNewLawyerColor] = useState("#1a237e");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleAddLawyerSubmit = (e) => {
    e.preventDefault();
    if (!newLawyerName || !newLawyerEmail || !newLawyerPhone || !newLawyerSpec) {
      dispatch(showToast({
        message: at("Lütfen tüm alanları doldurunuz."),
        type: "error"
      }));
      return;
    }

    const newL = {
      id: `lawyer_${Date.now()}`,
      name: newLawyerName,
      email: newLawyerEmail,
      phone: newLawyerPhone,
      specialization: newLawyerSpec,
      color: newLawyerColor
    };

    dispatch(addLawyer(newL));
    
    // Reset form
    setNewLawyerName("");
    setNewLawyerEmail("");
    setNewLawyerPhone("");
    setNewLawyerSpec("");
    setShowAddLawyerModal(false);

    setSuccessMsg(at("Avukat başarıyla eklendi!"));
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Client Management States
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientNationalId, setClientNationalId] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [clientLawyerId, setClientLawyerId] = useState("");

  const handleOpenAddClient = () => {
    setEditingClient(null);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientAddress("");
    setClientNationalId("");
    setClientPassword(Math.random().toString(36).slice(-6));
    setClientLawyerId(lawyers[0]?.id || "lawyer_1");
    setShowClientModal(true);
  };

  const handleOpenEditClient = (c) => {
    setEditingClient(c);
    setClientName(c.name);
    setClientEmail(c.email);
    setClientPhone(c.phone);
    setClientAddress(c.address || "");
    setClientNationalId(c.nationalId);
    setClientPassword(c.password || "123456");
    setClientLawyerId(c.lawyerId || lawyers[0]?.id || "lawyer_1");
    setShowClientModal(true);
  };

  const handleDeleteClientClick = (id) => {
    dispatch(showConfirm({
      message: at("Bu müvekkili silmek istediğinize emin misiniz?"),
      actionToDispatch: deleteClient(id)
    }));
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !clientNationalId || !clientPassword) {
      dispatch(showToast({
        message: at("Lütfen zorunlu alanları doldurunuz."),
        type: "error"
      }));
      return;
    }

    if (clientNationalId.length !== 11 || !/^\d+$/.test(clientNationalId)) {
      dispatch(showToast({
        message: at("T.C. Kimlik Numarası tam 11 haneli ve sadece rakamlardan oluşmalıdır."),
        type: "error"
      }));
      return;
    }

    if (editingClient) {
      dispatch(updateClient({
        id: editingClient.id,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        address: clientAddress,
        nationalId: clientNationalId,
        password: clientPassword,
        lawyerId: clientLawyerId,
      }));
      setSuccessMsg(at("Müvekkil bilgileri güncellendi!"));
    } else {
      dispatch(addClient({
        id: `client_${Date.now()}`,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        address: clientAddress,
        nationalId: clientNationalId,
        password: clientPassword,
        lawyerId: clientLawyerId,
        createdAt: new Date().toISOString(),
      }));
      setSuccessMsg(at("Müvekkil başarıyla eklendi!"));
    }

    setShowClientModal(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Global calculations
  const totalBilled = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  // Generate All Movements Log across lawyers and clients (sorted chronologically)
  const systemMovements = [
    ...clients.map(cl => {
      const assignedLawyer = lawyers.find(l => l.id === cl.lawyerId)?.name || "Avukat / Form";
      // Try to extract timestamp from ID if createdAt is missing
      let timestamp = cl.createdAt;
      if (!timestamp) {
        const idTime = parseInt(cl.id.split('_').pop());
        if (!isNaN(idTime) && idTime > 1600000000000) {
          timestamp = new Date(idTime).toISOString();
        } else {
          timestamp = "2026-06-01T10:00:00.000Z"; // Fallback for initial mock data
        }
      }
      return {
        id: `move_client_${cl.id}`,
        type: "client",
        title: at("Yeni Müvekkil Kaydı"),
        detail: `${cl.name} (${cl.nationalId || 'Misafir'})`,
        actor: assignedLawyer,
        target: cl.name,
        date: timestamp,
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100"
      };
    }),
    ...cases.map(c => {
      const assignedLawyer = lawyers.find(l => l.id === c.lawyerId)?.name || "Avukat";
      const affectedClient = clients.find(cl => cl.id === c.clientId)?.name || "Müvekkil";
      return {
        id: `move_case_${c.id}`,
        type: "case",
        title: at("Yeni Dava Dosyası"),
        detail: `${c.fileNo} - ${c.court} (${c.subject})`,
        actor: assignedLawyer,
        target: affectedClient,
        date: c.createdAt,
        badgeColor: "bg-blue-50 text-blue-700 border-blue-100"
      };
    }),
    ...documents.map(d => {
      const affectedClient = clients.find(cl => cl.id === d.clientId)?.name || "Müvekkil";
      return {
        id: `move_doc_${d.id}`,
        type: "document",
        title: at("Evrak ve Belgeler"),
        detail: `${d.name} (${d.category === "pleading" ? at("Dava Dilekçesi / Beyan") : at("Sözleşme / Protokol")})`,
        actor: d.uploadedBy,
        target: affectedClient,
        date: d.uploadedAt,
        badgeColor: "bg-teal-50 text-teal-700 border-teal-100"
      };
    }),
    ...payments.map(p => {
      const affectedClient = clients.find(cl => cl.id === p.clientId)?.name || "Müvekkil";
      return {
        id: `move_pay_${p.id}`,
        type: "payment",
        title: at("Fatura / Ödeme Kaydı"),
        detail: `${p.description}: ${p.amount.toLocaleString('tr-TR')} TRY (${p.status === "paid" ? at("Aktif") : at("Beklemede")})`,
        actor: at("Sistem Yetkilisi"),
        target: affectedClient,
        date: p.date,
        badgeColor: "bg-amber-50 text-amber-700 border-amber-100"
      };
    })
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-[#1a237e] text-white border-b border-[#d4af37]/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#d4af37] flex items-center justify-center shadow">
              <Scale className="w-5 h-5 text-[#1a237e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold tracking-tight">EDBM HUKUK</span>
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {at("Yönetici")}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 -mt-0.5 font-medium">{at("Adalet, Bilgi ve Güvenle Yönetim")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-100">{currentUser.name}</p>
              <p className="text-[10px] text-amber-400 font-semibold">{at("Genel Yönetici")}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors cursor-pointer shadow flex items-center gap-1.5 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{at("Güvenli Çıkış")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs font-bold rounded flex items-center gap-2 shadow-sm animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dashboard Introduction Alert */}
        <div className="bg-gradient-to-r from-slate-900 to-[#1a237e] text-white p-5 rounded-2xl shadow-lg border border-[#d4af37]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
              <h2 className="text-lg font-serif font-bold tracking-tight">
                {at("Yönetim Paneli")} (EDBM Global Admin Panel)
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              {at("Tüm sistemi gözlemleyebilir ve aktiviteleri takip edebilirsiniz.")}
            </p>
          </div>
          <button
            onClick={() => setShowAddLawyerModal(true)}
            className="px-4 py-2 bg-[#d4af37] text-[#1a237e] font-bold text-xs rounded-lg hover:bg-[#ffe680] hover:scale-105 transition-all flex items-center gap-2 shadow cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>{at("Yeni Avukat Ekle")}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-px">
          {[
            { id: "overview", label: at("Genel Özet"), icon: Layers },
            { id: "lawyers", label: at("Tüm Avukatlar"), icon: Users },
            { id: "clients", label: at("Tüm Müvekkiller"), icon: UserCheck },
            { id: "cases", label: at("Dosyalar"), icon: Briefcase },
            { id: "hearings", label: at("Duruşmalar / Randevular"), icon: Calendar },
            { id: "finances", label: at("Finansal Alacaklar"), icon: DollarSign },
            { id: "movements", label: at("Tüm Hareketler"), icon: RefreshCw },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3.5 rounded-t-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
                  activeTab === tab.id
                    ? "bg-white text-[#1a237e] border-slate-200 border-b-white -mb-px shadow-sm font-extrabold"
                    : "bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200/60 hover:text-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#d4af37]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stat Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{at("Tüm Avukatlar")}</p>
                  <p className="text-2xl font-bold text-[#1a237e] mt-1">{lawyers.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#1a237e]/5 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#1a237e]" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{at("Tüm Müvekkiller")}</p>
                  <p className="text-2xl font-bold text-[#1a237e] mt-1">{clients.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-teal-600" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{at("Toplam Dava")}</p>
                  <p className="text-2xl font-bold text-[#1a237e] mt-1">{cases.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{at("Ajanda")}</p>
                  <p className="text-2xl font-bold text-[#1a237e] mt-1">{hearings.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#d4af37]" />
                </div>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white to-indigo-50/20 p-6 rounded-xl border border-indigo-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{at("Toplam Talep Edilen")}</span>
                  <DollarSign className="w-5 h-5 text-[#d4af37]" />
                </div>
                <p className="text-3xl font-extrabold text-slate-900 mt-2 font-serif">{totalBilled.toLocaleString('tr-TR')} TRY</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>{at("Toplam Alacak")}</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-emerald-50/20 p-6 rounded-xl border border-emerald-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{at("Ödediğiniz Tutar")}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-800 mt-2 font-serif">{totalPaid.toLocaleString('tr-TR')} TRY</p>
                <div className="mt-3 text-xs text-slate-500 font-semibold">
                  {at("Tahsil Edilen Ciro")}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-amber-50/20 p-6 rounded-xl border border-amber-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">{at("Bekleyen Borç")}</span>
                  <Landmark className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-3xl font-extrabold text-amber-700 mt-2 font-serif">{totalPending.toLocaleString('tr-TR')} TRY</p>
                <div className="mt-3 text-xs text-slate-500 font-semibold">
                  {at("Bekleyen Tahsilatlar")}
                </div>
              </div>
            </div>

            {/* General Lists preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lawyers summary */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif font-bold text-base text-[#1a237e]">{at("Büro Ortakları")} ({lawyers.length})</h3>
                  <button onClick={() => setActiveTab("lawyers")} className="text-xs text-[#1a237e] hover:underline font-bold">{at("Tümünü Gör")}</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {lawyers.map(l => (
                    <div key={l.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color || "#1a237e" }} />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{l.name}</p>
                          <p className="text-[10px] text-slate-500">{l.specialization}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{l.phone}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memos Summary */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif font-bold text-base text-[#1a237e]">{at("Büro Evrak Standartları")} & {at("Duyurular")}</h3>
                  <span className="text-[10px] font-mono bg-indigo-50 text-[#1a237e] px-2.5 py-0.5 rounded-full font-bold">{at("Aktif")}</span>
                </div>
                <div className="space-y-3">
                  {memos.slice(0, 3).map(m => (
                    <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-700">{m.authorName}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{m.timestamp.replace("T", " ")}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{m.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LAWYERS LIST */}
        {activeTab === "lawyers" && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-[#1a237e]">
                {at("Büro Ortakları")} & {at("Tüm Avukatlar")} ({lawyers.length})
              </h3>
              <button
                onClick={() => setShowAddLawyerModal(true)}
                className="px-3 py-1.5 bg-[#1a237e] text-white font-bold text-xs rounded hover:bg-[#12185c] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>{at("Yeni Avukat Ekle")}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lawyers.map(l => {
                const lawyerCases = cases.filter(c => c.lawyerId === l.id);
                const lawyerClients = clients.filter(c => c.lawyerId === l.id);
                return (
                  <div key={l.id} className="border border-slate-200/60 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="p-4" style={{ borderTop: `4px solid ${l.color || "#1a237e"}` }}>
                      <p className="text-sm font-bold text-slate-800">{l.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-medium h-8 line-clamp-2">{l.specialization}</p>
                      <div className="mt-4 space-y-2 text-xs font-medium text-slate-600">
                        <p>📞 {l.phone}</p>
                        <p className="truncate">✉️ {l.email}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                      <span>{lawyerCases.length} {at("Dosyalar")}</span>
                      <span>•</span>
                      <span>{lawyerClients.length} {at("Müvekkiller")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CLIENTS LIST */}
        {activeTab === "clients" && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-[#1a237e]">{at("Tüm Müvekkiller")} ({clients.length})</h3>
              <button
                onClick={handleOpenAddClient}
                className="px-3.5 py-1.5 bg-[#1a237e] hover:bg-[#12185c] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border border-[#d4af37]/25"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{at("Müvekkil Ekle")}</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3 font-semibold">{at("Müvekkil")}</th>
                    <th className="p-3 font-semibold">{at("T.C. Kimlik / Vergi No")}</th>
                    <th className="p-3 font-semibold">{at("Telefon Numarası")}</th>
                    <th className="p-3 font-semibold">{at("E-Posta Adresi")}</th>
                    <th className="p-3 font-semibold">{at("Vekil Avukat")}</th>
                    <th className="p-3 font-semibold">{at("Dosyalar")}</th>
                    <th className="p-3 font-semibold">{at("Portal Şifresi")}</th>
                    <th className="p-3 font-semibold text-right">{at("İşlemler")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map(c => {
                    const assignedLawyer = lawyers.find(l => l.id === c.lawyerId);
                    const clientCases = cases.filter(ca => ca.clientId === c.id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors font-medium text-slate-700">
                        <td className="p-3 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3 font-mono text-slate-500">{c.nationalId}</td>
                        <td className="p-3">{c.phone}</td>
                        <td className="p-3">{c.email}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${assignedLawyer?.color}15`, color: assignedLawyer?.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: assignedLawyer?.color }} />
                            {assignedLawyer?.name || at("Sorumlu")}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-500">{clientCases.length} {at("Dosyalar")}</td>
                        <td className="p-3 font-mono font-bold text-amber-700 bg-amber-50/20 rounded">
                          {c.password || "123456"}
                        </td>
                        <td className="p-3 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditClient(c)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-[#1a237e] cursor-pointer"
                            title={at("Düzenle")}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClientClick(c.id)}
                            className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                            title={at("Sil")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CASES */}
        {activeTab === "cases" && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#1a237e]">{at("Dava Dosyaları")} ({cases.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3 font-semibold">{at("Dosya Numarası")}</th>
                    <th className="p-3 font-semibold">{at("Mahkeme")}</th>
                    <th className="p-3 font-semibold">{at("Müvekkil")}</th>
                    <th className="p-3 font-semibold">{at("Karşı Taraf")}</th>
                    <th className="p-3 font-semibold">{at("Atanan Avukat")}</th>
                    <th className="p-3 font-semibold">{at("Ödeme Durumu")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cases.map(c => {
                    const assignedLawyer = lawyers.find(l => l.id === c.lawyerId);
                    const client = clients.find(cl => cl.id === c.clientId);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors font-medium text-slate-700">
                        <td className="p-3 font-bold text-[#1a237e] font-mono">{c.fileNo}</td>
                        <td className="p-3 font-bold">{c.court}</td>
                        <td className="p-3 font-semibold text-slate-900">{client?.name || "-"}</td>
                        <td className="p-3">{c.opposingParty}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${assignedLawyer?.color}15`, color: assignedLawyer?.color }}>
                            {assignedLawyer?.name}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.status === "active" ? "bg-emerald-50 text-emerald-700" :
                            c.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {c.status === "active" ? at("Aktif") : c.status === "pending" ? at("Beklemede") : at("Kapalı")}
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

        {/* TAB 5: HEARINGS */}
        {activeTab === "hearings" && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#1a237e]">{at("Hukuki Ajanda ve Duruşma Takvimi")} ({hearings.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hearings.map(h => {
                const assignedLawyer = lawyers.find(l => l.id === h.lawyerId);
                const relatedCase = cases.find(c => c.id === h.caseId);
                return (
                  <div key={h.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono">
                          {relatedCase?.fileNo || at("Dosya Yok (Danışmanlık)")}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{h.dateTime.replace("T", " ")}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-2.5 h-10 line-clamp-2">{h.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">📍 {h.location}</p>
                      <p className="text-[11px] text-slate-600 mt-2 italic bg-white p-2 rounded border border-slate-100 line-clamp-3">
                        {h.notes}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100/80 flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400">{at("Sorumlu")}</span>
                      <span className="text-slate-700" style={{ color: assignedLawyer?.color }}>
                        👤 {assignedLawyer?.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: FINANCES */}
        {activeTab === "finances" && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#1a237e]">{at("Cari Hesap Ekstresi")} & {at("Tüm Ödemeler")} ({payments.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3 font-semibold">{at("Açıklama")}</th>
                    <th className="p-3 font-semibold">{at("Müvekkil")}</th>
                    <th className="p-3 font-semibold">{at("Tarih")}</th>
                    <th className="p-3 font-semibold">{at("Tutar")}</th>
                    <th className="p-3 font-semibold">{at("İşlem Türü")}</th>
                    <th className="p-3 font-semibold">{at("Ödeme Durumu")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {payments.map(p => {
                    const client = clients.find(cl => cl.id === p.clientId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{p.description}</td>
                        <td className="p-3 font-semibold text-slate-900">{client?.name || "-"}</td>
                        <td className="p-3 font-mono text-slate-500">{p.date}</td>
                        <td className="p-3 font-bold text-slate-900">{p.amount.toLocaleString('tr-TR')} TRY</td>
                        <td className="p-3 font-bold uppercase tracking-wider text-slate-500">{p.type}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {p.status === "paid" ? at("Aktif") : at("Beklemede")}
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

        {/* TAB 7: ALL MOVEMENTS / ACTIVITY LOG */}
        {activeTab === "movements" && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1a237e]">{at("Tüm Hareketler & Aktivite Günlüğü")}</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {at("Yönetim paneli tüm sistem hareketlerini kaydeder.")}
              </p>
            </div>

            <div className="relative border-l border-slate-200 pl-6 ml-3 space-y-6">
              {systemMovements.map(move => (
                <div key={move.id} className="relative">
                  {/* Timeline bullet */}
                  <span className="absolute -left-9.5 top-0.5 bg-white border-2 border-[#1a237e] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#1a237e]">{move.actor}</span>
                      <span className="text-xs text-slate-400">→</span>
                      <span className="text-xs font-semibold text-slate-600">{at("Müvekkil")}: {move.target}</span>
                      <span className={`ml-auto text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border ${move.badgeColor}`}>
                        {move.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 mt-1 font-semibold">{move.detail}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">{move.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto">
        <p>© 2026 EDBM Hukuk Bürosu. Tüm Hakları Saklıdır. | Global Administrator Interface</p>
      </footer>

      {/* MODAL: ADD LAWYER */}
      {showAddLawyerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="bg-[#1a237e] p-5 text-white flex justify-between items-center border-b border-[#d4af37]/30">
              <h4 className="font-serif font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-[#d4af37]" />
                {at("Yeni Avukat Oluştur")}
              </h4>
              <button
                onClick={() => setShowAddLawyerModal(false)}
                className="text-white/80 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLawyerSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{at("Avukat Adı")}</label>
                <input
                  type="text"
                  required
                  placeholder="Ezgi Kaya"
                  value={newLawyerName}
                  onChange={(e) => setNewLawyerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{at("E-Posta Adresi")}</label>
                <input
                  type="email"
                  required
                  placeholder="ezgi.kaya@edbm.com"
                  value={newLawyerEmail}
                  onChange={(e) => setNewLawyerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{at("Telefon Numarası")}</label>
                <input
                  type="text"
                  required
                  placeholder="+90 532 999 0000"
                  value={newLawyerPhone}
                  onChange={(e) => setNewLawyerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{at("Uzmanlık Alanı")}</label>
                <input
                  type="text"
                  required
                  placeholder="Ceza Hukuku (Criminal Law)"
                  value={newLawyerSpec}
                  onChange={(e) => setNewLawyerSpec(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{at("Tema Rengi")}</label>
                <div className="flex gap-2.5 mt-1">
                  {["#1a237e", "#0f766e", "#b45309", "#6d28d9", "#be123c", "#15803d"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewLawyerColor(color)}
                      className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all ${
                        newLawyerColor === color ? "border-slate-800 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLawyerModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {at("Kapat")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-xs font-bold shadow cursor-pointer border-b-2 border-indigo-950"
                >
                  {at("Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Client Modal (Admin) */}
      {showClientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white flex justify-between items-center border-b border-[#d4af37]/20">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#d4af37]" />
                {editingClient ? at("Müvekkil Düzenle") : at("Yeni Müvekkil Ekle")}
              </h3>
              <button
                onClick={() => setShowClientModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleClientSubmit} className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {at("Müvekkil Adı")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {at("T.C. Kimlik / Vergi No")} *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={clientNationalId}
                    onChange={(e) => setClientNationalId(e.target.value)}
                    placeholder="12345678901"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {at("Telefon Numarası")} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+90 532 123 4567"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {at("E-Posta Adresi")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {at("Portal Şifresi")} *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={clientPassword}
                      onChange={(e) => setClientPassword(e.target.value)}
                      placeholder="şifre"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {at("Atanan Avukat")} *
                  </label>
                  <select
                    value={clientLawyerId}
                    onChange={(e) => setClientLawyerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] bg-slate-50 font-semibold text-slate-700"
                  >
                    {lawyers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {at("Müvekkil Adresi")}
                </label>
                <textarea
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Kadıköy, İstanbul"
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {at("İptal")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer border-b-2 border-indigo-950"
                >
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>{at("Kaydet")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
