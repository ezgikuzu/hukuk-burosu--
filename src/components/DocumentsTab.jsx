import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addDocument, deleteDocument } from "../store";
import { DICTIONARY, autoTranslate } from "../data/initialData";
import { 
  FileText, Plus, Trash2, Folder, Download, Eye, X, UploadCloud, 
  CheckCircle, Edit3, Save, Copy 
} from "lucide-react";

export default function DocumentsTab() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];
  const at = (text) => autoTranslate(text, language);

  const rawDocuments = useSelector((state) => state.documents.list);
  const rawClients = useSelector((state) => state.clients.list);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const isLawyer = currentUser?.role === "lawyer";

  // Filter clients and documents for active lawyer
  const clients = isLawyer 
    ? rawClients.filter((cl) => cl.lawyerId === currentUser.id)
    : rawClients;

  const documents = isLawyer
    ? rawDocuments.filter((d) => 
        (d.clientId && clients.some(c => c.id === d.clientId)) || 
        d.uploadedBy === currentUser.name
      )
    : rawDocuments;

  // Filter State
  const [activeCategory, setActiveCategory] = useState("all");

  // Drag-and-drop states
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Editor states (creating inline templates)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("pleading");
  const [clientId, setClientId] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");

  // Viewer states
  const [viewingDoc, setViewingDoc] = useState(null);

  // Form templates definition
  const TEMPLATES = {
    blank: "",
    ihtarname: `İHTARNAME\n\nİHTAR EDEN: [Müvekkil Adı]\nVEKİLİ: Av. ${currentUser?.name}\nMUHATAP: [Karşı Taraf Adı]\n\nKONU: Ödenmeyen alacakların ihtarından ibarettir.\n\nAÇIKLAMALAR:\n1- Müvekkilimiz ile aranızdaki ticari ilişki kapsamında faturası kesilen ... tutarlı alacak vadesinde ödenmemiştir.\n2- İşbu ihtarnamenin tebliğinden itibaren 3 (üç) gün içinde söz konusu borcun ödenmesini, aksi halde yasal yollara başvurulacağını ihtar ederiz.\n\nİHTAR EDEN VEKİLİ\nAv. ${currentUser?.name}`,
    bosanma: `ANLAŞMALI BOŞANMA PROTOKOLÜ\n\nTARAFLAR:\n1- [Müvekkil Adı]\n2- [Karşı Taraf Adı]\n\nHükümler:\nMadde 1- Boşanma ve Velayet:\nTaraflar karşılıklı olarak boşanmayı kabul ederler. Müşterek çocuğun velayeti anneye verilecektir.\n\nMadde 2- Nafaka ve Tazminat:\nDavalı taraf, davacıya aylık ... tutarında iştirak nafakası ödemeyi taahhüt eder. Maddi ve manevi tazminat talebi bulunmamaktadır.\n\nTARAFLAR\n[Müvekkil İmza]      [Karşı Taraf İmza]`,
    dilekce: `İSTANBUL NÖBETÇİ İŞ MAHKEMESİ HAKİMLİĞİ'NE\n\nDAVACI: [Müvekkil Adı]\nVEKİLİ: Av. ${currentUser?.name}\nDAVALI: [Karşı Taraf Adı]\n\nKONU: Kıdem, ihbar tazminatı ve ödenmeyen işçilik alacaklarının tahsili talebidir.\n\nAÇIKLAMALAR:\nMüvekkilimiz, davalı şirkette ... tarihleri arasında çalışmış olup, iş akdi haksız şekilde feshedilmiştir. Ödenmeyen alacaklarımızın faiziyle birlikte tahsilini talep ederiz.\n\nHUKUKİ SEBEPLER: İş Kanunu ve ilgili mevzuat.\n\nNETİCE-İ TALEP: Davamızın kabulü ile yargılama giderlerinin davalıya yükletilmesine karar verilmesini vekaleten talep ederiz.\n\nDAVACI VEKİLİ\nAv. ${currentUser?.name}`
  };

  const handleTemplateChange = (e) => {
    const val = e.target.value;
    setSelectedTemplate(val);
    
    // Auto-fill template placeholders
    const currentClient = clients.find(c => c.id === clientId)?.name || "[Müvekkil Adı]";
    let rawText = TEMPLATES[val] || "";
    rawText = rawText.replace("[Müvekkil Adı]", currentClient);
    setEditorContent(rawText);
  };

  const handleClientChangeInEditor = (e) => {
    const cId = e.target.value;
    setClientId(cId);
    
    // Auto replace client name
    const selectedName = clients.find(c => c.id === cId)?.name || "[Müvekkil Adı]";
    let text = editorContent;
    text = text.replace("[Müvekkil Adı]", selectedName);
    setEditorContent(text);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    const sizeKB = Math.round(file.size / 1024);
    const sizeStr = sizeKB > 1024 
      ? `${(sizeKB / 1024).toFixed(1)} MB` 
      : `${sizeKB} KB`;

    const newDoc = {
      id: `doc_${Date.now()}`,
      name: file.name,
      category: file.name.includes("Karar") || file.name.includes("Rapor") ? "decision" : "pleading",
      fileType: file.name.split(".").pop() || "pdf",
      size: sizeStr,
      uploadedBy: currentUser?.name || "Sistem",
      uploadedAt: new Date().toISOString().split("T")[0],
      content: `${file.name} ${at("isimli harici dosya başarıyla sisteme yüklendi.")}`
    };

    dispatch(addDocument(newDoc));
    alert(language === "TR" ? "Dosya başarıyla yüklendi!" : "File uploaded successfully!");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Inline drafting save
  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!docName) {
      alert(language === "TR" ? "Lütfen belge adı giriniz." : "Please enter document name.");
      return;
    }

    const newDoc = {
      id: `doc_${Date.now()}`,
      name: docName.endsWith(".txt") ? docName : `${docName}.txt`,
      category: docCategory,
      fileType: "txt",
      size: `${Math.round(editorContent.length / 1024 * 10) / 10} KB`,
      uploadedBy: currentUser?.name || "Sistem",
      uploadedAt: new Date().toISOString().split("T")[0],
      clientId: clientId || undefined,
      content: editorContent
    };

    dispatch(addDocument(newDoc));
    setIsEditorOpen(false);
    setDocName("");
    setEditorContent("");
  };

  const handleDeleteDoc = (id) => {
    if (window.confirm(language === "TR" ? "Bu evrakı silmek istediğinize emin misiniz?" : "Are you sure you want to delete this document?")) {
      dispatch(deleteDocument(id));
      if (viewingDoc?.id === id) {
        setViewingDoc(null);
      }
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(editorContent || viewingDoc?.content || "");
    alert(language === "TR" ? "Yazı panoya kopyalandı!" : "Text copied to clipboard!");
  };

  // Filter list
  const filteredDocs = documents.filter(d => activeCategory === "all" || d.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Add Draft Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#1a237e]">{t.documentList}</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {language === "TR" 
              ? "Dava dilekçeleri, ihtarname ve sözleşme taslakları oluşturun; müvekkil evrak havuzuna dosya ekleyin." 
              : "Draft petitions, notifications, and contracts; upload files to the client document repository."}
          </p>
        </div>
        
        <button
          onClick={() => {
            setDocName("");
            setEditorContent("");
            setClientId(clients[0]?.id || "");
            setSelectedTemplate("blank");
            setIsEditorOpen(true);
          }}
          className="px-4 py-2 bg-[#1a237e] hover:bg-[#12185c] text-[#d4af37] font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm border border-[#d4af37]/30 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>{t.newDocument}</span>
        </button>
      </div>

      {/* Main Grid: Upload Area & Category Toggles (Top) + Document Table & Viewer (Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Document Repository List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Categories Tab Bar */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto gap-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === "all" ? "bg-white text-[#1a237e] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setActiveCategory("pleading")}
              className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === "pleading" ? "bg-white text-[#1a237e] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.docCategoryPleading}
            </button>
            <button
              onClick={() => setActiveCategory("contract")}
              className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === "contract" ? "bg-white text-[#1a237e] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.docCategoryContract}
            </button>
            <button
              onClick={() => setActiveCategory("decision")}
              className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === "decision" ? "bg-white text-[#1a237e] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.docCategoryDecision}
            </button>
          </div>

          {/* List Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {filteredDocs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold">{t.noData}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">{t.docName}</th>
                      <th className="py-3 px-4">{t.docCategory}</th>
                      <th className="py-3 px-4">{t.docSize} / {language === "TR" ? "Tür" : "Type"}</th>
                      <th className="py-3 px-4">{t.docUploadedBy}</th>
                      <th className="py-3 px-4 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-semibold">
                    {filteredDocs.map((d) => {
                      const relatedCl = clients.find(c => c.id === d.clientId);
                      return (
                        <tr key={d.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800">
                            <div className="flex items-center gap-2.5">
                              <FileText className="w-4 h-4 text-[#1a237e] shrink-0" />
                              <div>
                                <p>{d.name}</p>
                                {relatedCl && (
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    {language === "TR" ? "İlişkili: " : "Ref: "} {relatedCl.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {d.category === "pleading" 
                                ? t.docCategoryPleading 
                                : d.category === "contract"
                                ? t.docCategoryContract
                                : d.category === "decision"
                                ? t.docCategoryDecision
                                : t.docCategoryOther}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] font-bold">
                            {d.size} ({d.fileType.toUpperCase()})
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            <p className="font-bold">{d.uploadedBy}</p>
                            <span className="text-[10px] text-slate-400 font-bold">{d.uploadedAt}</span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-0.5">
                            <button
                              onClick={() => setViewingDoc(d)}
                              className="p-1 hover:bg-slate-100 text-[#1a237e] rounded cursor-pointer"
                              title={language === "TR" ? "Görüntüle" : "View"}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(d.id)}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded cursor-pointer"
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
        </div>

        {/* Right Side: Mock Drag & Drop File Uploader (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm space-y-4 animate-fade-in">
            <h3 className="font-serif text-sm font-bold text-slate-800">
              {t.uploadDocBtn}
            </h3>

            {/* Drag & Drop Area */}
            <div 
              id="file-drop-area"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
                dragActive 
                  ? "border-[#1a237e] bg-blue-50/50" 
                  : "border-slate-200 hover:border-[#1a237e]/40 hover:bg-slate-50/50"
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                multiple={false}
                onChange={handleFileChange}
                className="hidden" 
                accept=".pdf,.docx,.doc,.txt,.jpg"
              />
              <UploadCloud className="w-9 h-9 text-slate-400 mb-2.5" />
              <p className="text-xs text-slate-600 font-bold mb-1">
                {t.dragDropText}
              </p>
              <p className="text-[10px] text-slate-400 font-bold">
                PDF, DOCX, TXT, JPG (max 10MB)
              </p>
            </div>
          </div>

          {/* Quick Informational Box */}
          <div className="p-4 rounded-xl bg-slate-100/60 border border-slate-200/40 text-xs text-slate-600 leading-relaxed space-y-2 font-medium">
            <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-[#d4af37]" />
              {language === "TR" ? "Büro Evrak Standartları" : "Firm Document Standards"}
            </h4>
            <p>
              {language === "TR" 
                ? "Büromuzda düzenlenen dilekçelerin başlığına T.C. numaraları eklenmeli ve mahkeme kararları gerekçeli haliyle arşive yüklenmelidir." 
                : "Petitions drafted in our office must contain Turkish IDs in their headers and court decisions should be uploaded with full reasoning."}
            </p>
          </div>
        </div>
      </div>

      {/* Viewing Document Modal (Sleek Drawer / Overlay) */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[85vh]">
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
              <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-wrap min-h-full">
                {viewingDoc.content || at("Bu belgenin içeriği bulunmuyor.")}
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                {language === "TR" ? "Oluşturan: " : "Author: "} {viewingDoc.uploadedBy} | {viewingDoc.uploadedAt}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === "TR" ? "Metni Kopyala" : "Copy Text"}</span>
                </button>
                <button
                  onClick={() => setViewingDoc(null)}
                  className="px-4 py-1.5 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  {at("Kapat")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal (Pleading Drafter) */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#1a237e] to-[#283593] text-white flex justify-between items-center border-b border-[#d4af37]/20">
              <h3 className="font-serif text-base font-bold flex items-center gap-2">
                <Edit3 className="w-4.5 h-4.5 text-[#d4af37]" />
                {t.newDocument}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Inputs bar */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {language === "TR" ? "Evrak Başlığı" : "Document Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Is_Sozlesmesi_Taslagi.txt"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {at("Kategori")} *
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white font-semibold"
                >
                  <option value="pleading">{t.docCategoryPleading}</option>
                  <option value="contract">{t.docCategoryContract}</option>
                  <option value="decision">{t.docCategoryDecision}</option>
                  <option value="other">{t.docCategoryOther}</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {language === "TR" ? "İlişkili Müvekkil" : "Associated Client"}
                </label>
                <select
                  value={clientId}
                  onChange={handleClientChangeInEditor}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white font-semibold"
                >
                  <option value="">{language === "TR" ? "Müvekkil Yok" : "No Client"}</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {language === "TR" ? "Hukuki Taslak Şablonu" : "Template Suite"}
                </label>
                <select
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-[#1a237e]/5 text-[#1a237e] font-bold"
                >
                  <option value="blank">{language === "TR" ? "Boş Belge" : "Blank Document"}</option>
                  <option value="ihtarname">{language === "TR" ? "İhtarname Örneği" : "Notice / Warning"}</option>
                  <option value="bosanma">{language === "TR" ? "Boşanma Protokolü" : "Divorce Protocol"}</option>
                  <option value="dilekce">{language === "TR" ? "Dava Dilekçesi" : "Petition Draft"}</option>
                </select>
              </div>
            </div>

            {/* Text Editor Arena */}
            <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder={at("Yazmaya başlayın veya sağ üstten bir şablon seçin...")}
                className="w-full h-full bg-white p-6 border border-slate-200 rounded-xl shadow-inner font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1a237e] resize-none"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{language === "TR" ? "Metni Kopyala" : "Copy Text"}</span>
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-1.5 bg-[#1a237e] hover:bg-[#12185c] text-[#d4af37] font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#d4af37]/30 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{t.save}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
