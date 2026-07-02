import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCase, updateCase, deleteCase, showConfirm } from "../../store";
import { DICTIONARY, autoTranslate } from "../../data/initialData";
import { 
  Plus, Edit, Trash2, Search, X, Scale, FileText, User, 
  MapPin, HelpCircle, CheckCircle, ShieldAlert, AlertCircle 
} from "lucide-react";

export default function CasesTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const rawCases = useSelector((state) => state.cases.list);
  const rawClients = useSelector((state) => state.clients.list);
  const lawyers = useSelector((state) => state.lawyers.list);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const isLawyer = currentUser?.role === "lawyer";

  // Filter cases and clients for active lawyer
  const cases = isLawyer 
    ? rawCases.filter((c) => c.lawyerId === currentUser.id)
    : rawCases;

  const clients = isLawyer
    ? rawClients.filter((cl) => cl.lawyerId === currentUser.id)
    : rawClients;

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lawyerFilter, setLawyerFilter] = useState(isLawyer ? currentUser.id : "all");

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  // Form Fields
  const [fileNo, setFileNo] = useState("");
  const [court, setCourt] = useState("");
  const [opposingParty, setOpposingParty] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("active");
  const [lawyerId, setLawyerId] = useState(currentUser?.id || "lawyer_1");
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState(null);

  const openAddModal = () => {
    setEditingCase(null);
    setFileNo("");
    setCourt("");
    setOpposingParty("");
    setSubject("");
    setStatus("active");
    setLawyerId(currentUser?.id || "lawyer_1");
    setClientId(clients[0]?.id || "");
    setDescription("");
    setValidationError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCase(c);
    setFileNo(c.fileNo);
    setCourt(c.court);
    setOpposingParty(c.opposingParty);
    setSubject(c.subject);
    setStatus(c.status);
    setLawyerId(c.lawyerId);
    setClientId(c.clientId);
    setDescription(c.description);
    setValidationError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!clientId) {
      setValidationError(
        language === "TR" 
          ? "Dosyayı ilişkilendirmek için bir müvekkil seçmelisiniz. Eğer listede müvekkil yoksa önce müvekkil oluşturun." 
          : "You must select a client to associate this case with. Please add a client first if empty."
      );
      return;
    }

    if (editingCase) {
      const updated = {
        id: editingCase.id,
        fileNo,
        court,
        opposingParty,
        subject,
        status,
        lawyerId: isLawyer ? currentUser.id : lawyerId,
        clientId,
        description,
        createdAt: editingCase.createdAt,
      };
      dispatch(updateCase(updated));
    } else {
      const newCaseObj = {
        id: `case_${Date.now()}`,
        fileNo,
        court,
        opposingParty,
        subject,
        status,
        lawyerId: isLawyer ? currentUser.id : lawyerId,
        clientId,
        description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      dispatch(addCase(newCaseObj));
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(showConfirm({
      message: t.deleteCaseConfirm,
      actionToDispatch: deleteCase(id)
    }));
  };

  // Filtering Logic
  const filteredCases = cases.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      c.fileNo.toLowerCase().includes(term) ||
      c.court.toLowerCase().includes(term) ||
      c.opposingParty.toLowerCase().includes(term) ||
      c.subject.toLowerCase().includes(term);

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesLawyer = isLawyer || lawyerFilter === "all" || c.lawyerId === lawyerFilter;

    return matchesSearch && matchesStatus && matchesLawyer;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#1a237e]">{t.caseList}</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {language === "TR" 
              ? "Bürodaki tüm dava dosyalarını, esas/karar numaralarını ve güncel aşamalarını buradan izleyebilirsiniz." 
              : "Track all legal case files, docket/decision numbers, and their current stages here."}
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-[#d4af37] font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm border border-[#d4af37]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>{t.newCase}</span>
        </button>
      </div>

      {/* Search and Filters Grid */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="relative md:col-span-6">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] font-semibold"
          >
            <option value="all">
              {language === "TR" ? "Tüm Durumlar" : "All Statuses"}
            </option>
            <option value="active">{t.caseStatusActive}</option>
            <option value="pending">{t.caseStatusPending}</option>
            <option value="closed">{t.caseStatusClosed}</option>
          </select>
        </div>

        {/* Lawyer Filter */}
        <div className="md:col-span-3">
          <select
            disabled={isLawyer}
            value={isLawyer ? currentUser.id : lawyerFilter}
            onChange={(e) => setLawyerFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] bg-slate-50 disabled:text-slate-500 font-semibold"
          >
            <option value="all">
              {language === "TR" ? "Tüm Avukatlar" : "All Attorneys"}
            </option>
            {lawyers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCases.length === 0 ? (
          <div className="lg:col-span-2 py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-100 text-xs shadow-sm font-bold">
            {t.noData}
          </div>
        ) : (
          filteredCases.map((c) => {
            const client = clients.find((cl) => cl.id === c.clientId);
            const lawyerObj = lawyers.find((l) => l.id === c.lawyerId);

            return (
              <div 
                key={c.id} 
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Card Header (FileNo + Status Badge) */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="font-serif text-sm font-bold text-[#1a237e] tracking-tight bg-slate-100 px-2.5 py-1 rounded">
                      {c.fileNo}
                    </span>
                    
                    <span 
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        c.status === "active" 
                          ? "bg-blue-50 text-blue-700 border border-blue-100" 
                          : c.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {c.status === "active" && <Scale className="w-3 h-3" />}
                      {c.status === "pending" && <AlertCircle className="w-3 h-3" />}
                      {c.status === "closed" && <CheckCircle className="w-3 h-3" />}
                      {c.status === "active" ? t.caseStatusActive.split(" (")[0] : c.status === "pending" ? t.caseStatusPending : t.caseStatusClosed.split(" (")[0]}
                    </span>
                  </div>

                  {/* Subject and Court */}
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1" title={c.subject}>
                    {c.subject}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-bold mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{c.court}</span>
                  </p>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100 mb-4 font-semibold">
                    {c.description}
                  </p>
                </div>

                {/* Card Footer: Metadata and Action Buttons */}
                <div className="border-t border-slate-50 pt-4 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  <div className="space-y-1 text-[11px] font-semibold">
                    <p className="text-slate-600">
                      <span className="text-slate-400 font-normal">{language === "TR" ? "Müvekkil: " : "Client: "}</span>
                      <strong className="text-slate-700">{client?.name || at("Bilinmeyen Müvekkil")}</strong>
                    </p>
                    <p className="text-slate-600">
                      <span className="text-slate-400 font-normal">{t.assignedLawyer}: </span>
                      <strong 
                        className="font-bold"
                        style={{ color: lawyerObj?.color || "#1a237e" }}
                      >
                        {lawyerObj?.name || at("Atanmamış")}
                      </strong>
                    </p>
                  </div>

                  <div className="flex gap-1.5 justify-end shrink-0">
                    <button
                      onClick={() => openEditModal(c)}
                      className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:text-[#1a237e] hover:bg-slate-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{t.edit}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-2.5 py-1.5 border border-red-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.delete}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white flex justify-between items-center border-b border-[#d4af37]/20">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#d4af37]" />
                {editingCase ? t.editCaseTitle : t.newCase}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 flex-1">
              {validationError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded flex items-center gap-2 font-bold animate-pulse">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.caseFileNo} *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fileNo}
                      onChange={(e) => setFileNo(e.target.value)}
                      placeholder="2026/45 Esas"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.caseCourt} *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                      placeholder="İstanbul 10. Asliye Hukuk Mahkemesi"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.caseOpposing} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={opposingParty}
                      onChange={(e) => setOpposingParty(e.target.value)}
                      placeholder="Mehmet Korkmaz / Sigorta Şirketi"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.caseSubject} *
                  </label>
                  <div className="relative">
                    <HelpCircle className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Alacak ve Tazminat Talebi"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.caseStatus} *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] font-semibold"
                  >
                    <option value="active">{t.caseStatusActive.split(" (")[0]}</option>
                    <option value="pending">{t.caseStatusPending}</option>
                    <option value="closed">{t.caseStatusClosed.split(" (")[0]}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.caseClient} *
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] font-semibold"
                  >
                    <option value="" disabled>
                      {language === "TR" ? "Müvekkil Seçiniz" : "Select Client"}
                    </option>
                    {clients.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.caseLawyer} *
                  </label>
                  <select
                    disabled={isLawyer}
                    value={isLawyer ? currentUser.id : lawyerId}
                    onChange={(e) => setLawyerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] bg-slate-50 disabled:text-slate-500 font-semibold"
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
                  {t.caseDesc}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dava detayları ve sonraki adımlar..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] resize-none"
                />
              </div>

              {/* Modal Footer */}
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
