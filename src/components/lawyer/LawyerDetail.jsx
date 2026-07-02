import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, Gavel, ArrowRight, Scale, BookOpen } from "lucide-react";
import { toggleLanguage } from "../../store";

export default function LawyerDetail({ lawyerId, onBack, onContactClick }) {
  const language = useSelector((state) => state.ui.language) || "TR";
  const messages = useSelector((state) => state.messages?.list || []);
  const dispatch = useDispatch();

  const lawyerMessages = messages.filter(m => m.receiverId === lawyerId && m.senderId === "guest");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lawyers = [
    {
      id: "beyza-mensur",
      name: "Av. Beyza Mensur",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBs9fibzs9m7PxJlKu7yIMcCC6tfaZggoJSIzEy8gGOszun-fWvTJI54kIS18NVusIXJqt9tQSMJSV6a3Ad7fRAEPh90yAvWMTvErHaz5oWlH-sZ3cLAJVwff3hUO44vJaU2OfT6BTgvuFggOkHxqInHnNUN51_R11uIaocBCCdlIEXa8PBAUujVnkJFqG1chVFRfgEZeYm0Y09XtLVGWGM7lt-JZRFlce3wmtBl17gq6CQHB112JdpjhUt2hZUTXCBE8GIkYkU1p8",
      roleTR: "Kurucu Ortak / Kıdemli Avukat",
      roleEN: "Founding Partner / Senior Lawyer",
      bioTR: "Av. Beyza Mensur, EDBM Hukuk Bürosu'nun kurucu ortağıdır. Galatasaray Üniversitesi Hukuk Fakültesi mezunudur. Şirketler Hukuku, Birleşmeler ve Devralmalar alanında 25 yılı aşkın tecrübeye sahiptir.\n\nUzmanlık Alanları:\n- Şirketler Hukuku ve Kurumsal Yönetim\n- Uluslararası Ticaret Sözleşmeleri\n- Şirket Birleşmeleri ve Devralmaları (M&A)\n\nEğitim:\n- Galatasaray Üniversitesi, Hukuk Fakültesi (Lisans)\n- London School of Economics, Corporate Law (LL.M)",
      bioEN: "Att. Beyza Mensur is the founding partner of EDBM Law Firm. She graduated from Galatasaray University Faculty of Law. She has over 25 years of experience in Corporate Law, Mergers and Acquisitions.\n\nPractice Areas:\n- Corporate Law & Governance\n- International Trade Agreements\n- Mergers and Acquisitions (M&A)\n\nEducation:\n- Galatasaray University, Faculty of Law (LL.B)\n- London School of Economics, Corporate Law (LL.M)"
    },
    {
      id: "ezgi-kuzu",
      name: "Av. Ezgi Kuzu",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrkKfYlDQ35O6xTQ98CEkqB1OQFU_ez0cfczUuK4JAc11cI7H2tL8N5M0cYkE5OWMxSczfAE2YPLFysAp0AoW0fHbwDR4CT8Bz31Fjwe8qPGlug_XX26gDXSmlGbuKyNaBo4gdkR3skLuLpHFOoLrwHdjDeBH-qR-UtVr0viY5fos_1LsC0pI7ia1TdgiqahpqJuzFEc71t-SInWunHUtYo1eIhNdb5G4lNqtkg4NGY82WBy35HtDsoRDdmXIumOb7yVrWq7ibcss",
      roleTR: "Yönetici Ortak / İş Hukuku Uzmanı",
      roleEN: "Managing Partner / Labor Law Specialist",
      bioTR: "Av. Ezgi Kuzu, İstanbul Üniversitesi Hukuk Fakültesi mezunudur. İş Hukuku, sendikal uyuşmazlıklar ve kurumsal sözleşmeler konularında geniş bir uzmanlığa sahiptir.\n\nUzmanlık Alanları:\n- Bireysel ve Toplu İş Hukuku\n- Sözleşmeler Hukuku\n- İşçi - İşveren Uyuşmazlıkları\n\nEğitim:\n- İstanbul Üniversitesi, Hukuk Fakültesi (Lisans)\n- Bahçeşehir Üniversitesi, Özel Hukuk (Yüksek Lisans)",
      bioEN: "Att. Ezgi Kuzu graduated from Istanbul University Faculty of Law. She has extensive expertise in Labor Law, union disputes, and corporate contracts.\n\nPractice Areas:\n- Individual and Collective Labor Law\n- Contracts Law\n- Employee - Employer Disputes\n\nEducation:\n- Istanbul University, Faculty of Law (LL.B)\n- Bahcesehir University, Private Law (LL.M)"
    },
    {
      id: "gorkem-iskenceli",
      name: "Av. Muhammet Görkem İşkenceli",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2DdEHLb36QUhBDJK7EM7Q0DO5LDdec_rVeXOE1nZNKr8lAP3EUPDCO8yusNd3p5EgUmFUIJ2FOpLRlhQrZkC5ECmxhamnZIF5Q5ixL3e6aDJsSTQDUz9-1jXZbaA1gxv5TNxgJXNUlEtHwyFQQZvUJ59hOPtWxKJrf8vHo1lvOZ8IGjbINl0KNTP7Rc89sisJPAfS47WOVij4aBIrxIC8cmJSF_0vO6DXIrOQ4Fhz6nGEQTHsQWu2AKsMkY96YU7eb-Nvk_2Gy5E",
      roleTR: "Kıdemli Avukat / Ceza Hukuku Uzmanı",
      roleEN: "Senior Attorney / Criminal Law Specialist",
      bioTR: "Av. Muhammet Görkem İşkenceli, Ankara Üniversitesi Hukuk Fakültesi mezunudur. Ağır Ceza davaları, ekonomik suçlar ve bilişim hukuku alanlarında 15 yılı aşkın süredir müvekkillerine hizmet vermektedir.\n\nUzmanlık Alanları:\n- Ağır Ceza Yargılamaları\n- Ekonomik Suçlar ve Siber Suçlar\n- Temyiz ve İtiraz Süreçleri\n\nEğitim:\n- Ankara Üniversitesi, Hukuk Fakültesi (Lisans)",
      bioEN: "Att. Muhammet Gorkem Iskenceli graduated from Ankara University Faculty of Law. He has been serving his clients in Heavy Penalty cases, financial crimes, and IT law for over 15 years.\n\nPractice Areas:\n- Heavy Penal Trials\n- Financial and Cyber Crimes\n- Appeals and Objections\n\nEducation:\n- Ankara University, Faculty of Law (LL.B)"
    },
    {
      id: "dilek-ince",
      name: "Av. Dilek İnce",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9D1XgnCCjehZYJVpiD-_bfL7Na66lbbTo445XHb4MGg8hK4NiPeDClDEn5ok9UoHFFgOKPTXfOEM2N-3cwZIMy8eB-WjSr_DsVOfr3QdTWpJlX-5yXCPdJK6hiiqkTGcbgkAXtz3FjhKmqDwG4TBp7108fJXT1vd0P3HJkzMI29ecqyqfr8ULxDVyNavx8yXe1PYhq-87b83WCHVBzAOJObgLeHLsjaTZ1tXKbin7spXUFWglCZwULagr4ZHQ3fdZhuPF6zFe1yE",
      roleTR: "Uzman Avukat / Aile ve Miras Hukuku",
      roleEN: "Expert Lawyer / Family & Inheritance Law",
      bioTR: "Av. Dilek İnce, Marmara Üniversitesi Hukuk Fakültesi mezunudur. Aile hukuku, mal tasfiyeleri, vasiyetnameler ve miras paylaşımı konularındaki titiz çalışmalarıyla bilinir.\n\nUzmanlık Alanları:\n- Boşanma ve Mal Tasfiyesi\n- Vasiyetname ve Miras Hukuku\n- Velayet ve Nafaka Davaları\n\nEğitim:\n- Marmara Üniversitesi, Hukuk Fakültesi (Lisans)",
      bioEN: "Att. Dilek Ince graduated from Marmara University Faculty of Law. She is known for her meticulous work in family law, property liquidation, wills, and inheritance distribution.\n\nPractice Areas:\n- Divorce and Property Liquidation\n- Wills and Inheritance Law\n- Custody and Alimony Cases\n\nEducation:\n- Marmara University, Faculty of Law (LL.B)"
    }
  ];

  const lawyer = lawyers.find((l) => l.id === lawyerId);

  if (!lawyer) return null;

  const tx = (tr, en) => (language === "TR" ? tr : en);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 h-20 shadow-sm transition-all flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#1a237e] font-semibold hover:bg-[#1a237e]/5 px-3 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{tx("Geri Dön", "Go Back")}</span>
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center border border-[#d4af37]/30 shadow-md">
              <Gavel className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-lg font-bold text-[#1a237e] block tracking-tight">EDBM Law Firm</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-[#1a237e]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a237e] to-[#283593] z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
            <img 
              src={lawyer.image} 
              alt={lawyer.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center md:text-left text-white flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/35 text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-4">
              <Scale className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>EDBM LEGAL STAFF</span>
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
              {lawyer.name}
            </h1>
            <p className="text-[#d4af37] text-lg sm:text-xl font-bold uppercase tracking-wider mb-6">
              {tx(lawyer.roleTR, lawyer.roleEN)}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <button 
                  onClick={onContactClick}
                  className="bg-[#d4af37] text-[#1a237e] hover:bg-amber-400 font-extrabold text-sm uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg transition-all"
                >
                  {tx("Danışmanlık Talep Et", "Request Consultation")}
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl -mt-16 relative z-30">
            <h2 className="text-[#1a237e] font-serif text-2xl sm:text-3xl font-bold mb-6">
              {tx("Biyografi", "Biography")}
            </h2>
            <div className="w-12 h-1 bg-[#d4af37] rounded mb-8" />
            
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
              {tx(lawyer.bioTR, lawyer.bioEN).split('\n').map((paragraph, idx) => (
                paragraph.startsWith('-') ? (
                  <div key={idx} className="flex items-center gap-3 mb-3 ml-4">
                    <ArrowRight className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span className="font-medium text-slate-700">{paragraph.replace('-', '').trim()}</span>
                  </div>
                ) : paragraph.trim() !== '' ? (
                  <p key={idx} className={paragraph.endsWith(':') ? "font-bold text-[#1a237e] text-xl mt-8 mb-4" : "mb-6"}>
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </div>

          {/* Messages Section */}
          {lawyerMessages.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl relative z-30 mt-12">
              <h2 className="text-[#1a237e] font-serif text-2xl sm:text-3xl font-bold mb-6">
                {tx("Gelen Ziyaretçi Mesajları", "Incoming Visitor Messages")}
              </h2>
              <div className="w-12 h-1 bg-[#d4af37] rounded mb-8" />
              
              <div className="space-y-6">
                {lawyerMessages.map((msg) => (
                  <div key={msg.id} className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-bold text-slate-800">{msg.senderName}</div>
                        <div className="text-xs text-slate-500">{new Date(msg.timestamp).toLocaleString()}</div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {tx("Yeni Mesaj", "New Message")}
                      </span>
                    </div>
                    <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Footer (Simplified) */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-white">
             <Gavel className="w-5 h-5 text-[#d4af37]" />
             <span className="font-serif text-lg font-bold tracking-tight">EDBM Law Firm</span>
          </div>
          <div className="text-xs text-slate-500 font-medium pt-6 border-t border-slate-800/80 w-full max-w-sm">
             © 2026 EDBM {tx("Hukuk Bürosu", "Law Firm")}. {tx("Tüm Hakları Saklıdır", "All Rights Reserved")}.
          </div>
        </div>
      </footer>
    </div>
  );
}
