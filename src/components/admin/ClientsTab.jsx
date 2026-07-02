import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addClient, updateClient, deleteClient, showConfirm } from "../../store";
import { DICTIONARY, autoTranslate } from "../../data/initialData";
import { 
  Plus, Edit, Trash2, Search, X, User, Phone, Mail, MapPin, 
  ShieldAlert, Fingerprint, Lock, ShieldCheck 
} from "lucide-react";

export default function ClientsTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const rawClients = useSelector((state) => state.clients.list);
  const lawyers = useSelector((state) => state.lawyers.list);
  const currentUser = useSelector((state) => state.auth.currentUser);

  // Filter clients based on lawyer role
  const isLawyer = currentUser?.role === "lawyer";
  const clients = isLawyer 
    ? rawClients.filter((c) => c.lawyerId === currentUser.id)
    : rawClients;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Form Field States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [lawyerId, setLawyerId] = useState(currentUser?.id || "lawyer_1");
  const [validationError, setValidationError] = useState(null);

  const openAddModal = () => {
    setEditingClient(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNationalId("");
    setPassword(Math.random().toString(36).slice(-6)); // auto-generate a sleek password
    setLawyerId(currentUser?.id || "lawyer_1");
    setValidationError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setNationalId(client.nationalId);
    setPassword(client.password || "123456");
    setLawyerId(client.lawyerId);
    setValidationError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    // Basic validation
    if (nationalId.length !== 11 || !/^\d+$/.test(nationalId)) {
      setValidationError(
        language === "TR" 
          ? "T.C. Kimlik Numarası tam 11 haneli ve sadece rakamlardan oluşmalıdır." 
          : "National ID must be exactly 11 digits and numeric."
      );
      return;
    }

    if (editingClient) {
      const updated = {
        id: editingClient.id,
        name,
        email,
        phone,
        address,
        nationalId,
        password,
        lawyerId: isLawyer ? currentUser.id : lawyerId,
      };
      dispatch(updateClient(updated));
    } else {
      const newCl = {
        id: `client_${Date.now()}`,
        name,
        email,
        phone,
        address,
        nationalId,
        password,
        lawyerId: isLawyer ? currentUser.id : lawyerId,
        createdAt: new Date().toISOString(),
      };
      dispatch(addClient(newCl));
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(showConfirm({
      message: t.deleteClientConfirm,
      actionToDispatch: deleteClient(id)
    }));
  };

  // Filter clients based on search
  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.nationalId.includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#1a237e]">{t.clientList}</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {language === "TR" 
              ? "Büromuzun kayıtlı tüm müvekkillerini yönetebilir, portal giriş şifrelerini güncelleyebilirsiniz." 
              : "Manage all registered clients of our firm and update their portal login passwords."}
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-[#d4af37] font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm border border-[#d4af37]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>{t.newClient}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e]"
          />
        </div>
      </div>

      {/* Clients Table / Grid */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">{t.noData}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">{t.clientName}</th>
                  <th className="py-4 px-4">{t.clientNationalId}</th>
                  <th className="py-4 px-4">{t.clientPhone} / {t.clientEmail}</th>
                  <th className="py-4 px-4">{t.clientLawyer}</th>
                  <th className="py-4 px-6 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filteredClients.map((c) => {
                  const assignedLawyer = lawyers.find((l) => l.id === c.lawyerId);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1a237e]/5 text-[#1a237e] flex items-center justify-center font-bold font-serif text-sm border border-[#1a237e]/10">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p>{c.name}</p>
                            <span className="text-[10px] text-slate-400 font-semibold line-clamp-1 block max-w-[180px]">
                              {c.address}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-600">
                        {c.nationalId}
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <p className="font-bold text-slate-700">{c.phone}</p>
                        <p className="text-slate-400 text-[11px] font-semibold">{c.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span 
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold"
                          style={{ 
                            color: assignedLawyer?.color || "#1e3a8a", 
                            backgroundColor: `${assignedLawyer?.color || "#1e3a8a"}15` 
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: assignedLawyer?.color }} />
                          {assignedLawyer?.name || at("Bilinmiyor")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1 shrink-0">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-[#1a237e] transition-colors cursor-pointer"
                          title={t.edit}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title={t.delete}
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
        )}
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white flex justify-between items-center border-b border-[#d4af37]/20">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-[#d4af37]" />
                {editingClient ? t.editClientTitle : t.newClient}
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
                    {t.clientName} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ahmet Yılmaz"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.clientNationalId} ({at("T.C. Kimlik / Vergi No")}) *
                  </label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="12345678901"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.clientPhone} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+90 532 123 4567"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.clientEmail} *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.clientLawyer} ({at("Atanan Avukat")}) *
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
                  {t.clientAddress}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Kadıköy, İstanbul"
                    rows={2}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] resize-none"
                  />
                </div>
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
                  className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer border-b-2 border-indigo-950"
                >
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>{t.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
