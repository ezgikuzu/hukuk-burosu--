import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FileSignature, CheckCircle, ArrowRight } from "lucide-react";
import { documentCategories, generateDraftContent } from "./documentTemplates";
import DocumentTemplatePreview from "./DocumentTemplatePreview";

export default function DocumentGenerator() {
  const language = useSelector((state) => state.ui.language);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  
  const [formData, setFormData] = useState({
    clientName: "",
    clientId: "",
    phone: "",
    address: "",
    opposingParty: "",
    date: "",
    location: "",
    subject: "",
    summary: "",
    request: "",
    urgency: "normal",
    notes: ""
  });

  const [generatedDraft, setGeneratedDraft] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedTemplateId(""); // Kategori değiştiğinde şablonu sıfırla
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !selectedTemplateId) return;

    const category = documentCategories.find(c => c.id === selectedCategoryId);
    const template = category?.templates.find(t => t.id === selectedTemplateId);
    
    if (category && template) {
      const draft = generateDraftContent(formData, category.title, template.title, template.defaultAuthority);
      setGeneratedDraft(draft);
      setDocumentTitle(`${template.title} - ${formData.clientName || "Taslak"}`);
    }
  };

  const handleReset = () => {
    setGeneratedDraft("");
    // İsteğe bağlı olarak formData'yı tutun veya temizleyin. Yeni bir başlangıç için temizleyeceğiz.
    setFormData({
      clientName: "", clientId: "", phone: "", address: "", opposingParty: "",
      date: "", location: "", subject: "", summary: "", request: "",
      urgency: "normal", notes: ""
    });
    setSelectedTemplateId("");
    setSelectedCategoryId("");
  };

  if (generatedDraft) {
    return (
      <DocumentTemplatePreview 
        draftContent={generatedDraft} 
        documentTitle={documentTitle} 
        onReset={handleReset} 
      />
    );
  }

  const selectedCategoryObj = documentCategories.find(c => c.id === selectedCategoryId);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Başlık (Header) */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#1a237e] flex items-center gap-2">
          <FileSignature className="w-6 h-6 text-[#d4af37]" />
          Evrak Oluştur / Dilekçe Taslağı
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Hızlı bir şekilde ön bilgilendirme ve taslak amacıyla hukuki metinler oluşturun.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Taraf: Seçimler */}
        <div className="lg:col-span-4 space-y-6">
          {/* Adım 1: Kategori */}
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-serif font-bold text-slate-800 text-sm mb-4 flex items-center justify-between">
              <span>1. Hukuk Alanı Seçin</span>
              {selectedCategoryId && <CheckCircle className="w-4 h-4 text-emerald-500" />}
            </h3>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {documentCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategoryId === cat.id 
                      ? "bg-[#1a237e] text-white shadow-md" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Adım 2: Şablon Tipi */}
          <div className={`bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-opacity duration-300 ${!selectedCategoryId ? "opacity-50 pointer-events-none" : ""}`}>
            <h3 className="font-serif font-bold text-slate-800 text-sm mb-4 flex items-center justify-between">
              <span>2. Evrak Tipi Seçin</span>
              {selectedTemplateId && <CheckCircle className="w-4 h-4 text-emerald-500" />}
            </h3>
            
            {selectedCategoryObj ? (
              <div className="flex flex-col gap-2">
                {selectedCategoryObj.templates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTemplateId === tpl.id 
                        ? "bg-[#d4af37] text-[#1a237e] border border-[#c19b2c]" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium italic">Lütfen önce bir hukuk alanı seçin.</p>
            )}
          </div>
        </div>

        {/* Sağ Taraf: Form */}
        <div className={`lg:col-span-8 transition-opacity duration-500 ${!selectedTemplateId ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-serif font-bold text-[#1a237e] text-base mb-6 border-b border-slate-100 pb-3">
              3. Olay ve Taraf Bilgileri
            </h3>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Başvuran Ad Soyad</label>
                  <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" placeholder="Örn: Ahmet Yılmaz" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">T.C. Kimlik No (Opsiyonel)</label>
                  <input type="text" name="clientId" value={formData.clientId} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" placeholder="11 Haneli TC No" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Telefon</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" placeholder="05XX XXX XX XX" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Olay / İşlem Tarihi</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Adres</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" placeholder="Tam adres bilgisi" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Karşı Taraf / Kurum</label>
                  <input type="text" name="opposingParty" value={formData.opposingParty} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" placeholder="Örn: Ayşe Demir veya X Bakanlığı" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Olay Yeri / Mahkemesi</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" placeholder="Örn: İstanbul Kadıköy" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Konu Başlığı</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" placeholder="Kısa konu özeti (Örn: Haksız fesih nedeniyle kıdem tazminatı talebi)" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Olayın Kısa Özeti (Açıklamalar)</label>
                <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows="4" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold resize-none" placeholder="Olayı anlatan kronolojik kısa bir özet giriniz..." />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Talep Edilen Hususlar (Sonuç ve İstem)</label>
                <textarea name="request" value={formData.request} onChange={handleInputChange} rows="3" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold resize-none" placeholder="Mahkemeden veya kurumdan ne talep ediliyor?" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Notlar (Dahili)</label>
                  <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] outline-none font-semibold" placeholder="Taslağa eklenecek özel notlar" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedTemplateId}
                  className="px-6 py-3 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <span>Taslak Oluştur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
