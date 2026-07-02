import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, Scale, Gavel, Briefcase, Users, CreditCard, Heart, FileText, Shield, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { toggleLanguage } from "../store";

export default function ServiceDetail({ serviceId, onBack, onContactClick }) {
  const language = useSelector((state) => state.ui.language) || "TR";
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const practiceAreas = [
    {
      id: "ticaret-hukuku",
      icon: Briefcase,
      titleTR: "Ticaret Hukuku",
      titleEN: "Commercial Law",
      descTR: "Şirket kuruluşları, ana sözleşme değişiklikleri ve ticari uyuşmazlıkların çözümü.",
      descEN: "Company formations, articles of association amendments and resolution of commercial disputes.",
      detailTR: "EDBM Hukuk Bürosu olarak, ticaret hayatının dinamik yapısına uygun, hızlı ve proaktif hukuki çözümler sunuyoruz. Şirketler hukuku, birleşme ve devralmalar, sözleşmeler hukuku ve haksız rekabet davalarında müvekkillerimizi en üst düzeyde temsil etmekteyiz.\n\nSunduğumuz Hizmetler:\n- Şirket Ana Sözleşmelerinin Hazırlanması\n- Yönetim Kurulu Kararları ve Genel Kurul İşlemleri\n- Haksız Rekabet Uyuşmazlıkları\n- Uluslararası Ticaret Sözleşmeleri",
      detailEN: "As EDBM Law Firm, we offer rapid and proactive legal solutions suited to the dynamic structure of commercial life. We represent our clients at the highest level in corporate law, mergers and acquisitions, contracts law, and unfair competition cases.\n\nOur Services:\n- Preparation of Articles of Association\n- Board of Directors Resolutions and General Assembly Procedures\n- Unfair Competition Disputes\n- International Trade Agreements",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "is-hukuku",
      icon: Users,
      titleTR: "İş Hukuku",
      titleEN: "Labor Law",
      descTR: "İşe iade, tazminat davaları ve toplu iş sözleşmesi görüşmelerinin yönetimi.",
      descEN: "Management of reinstatement cases, compensation lawsuits and collective labor agreement negotiations.",
      detailTR: "İşçi ve işveren ilişkilerinin düzenlenmesi, iş sözleşmelerinin hazırlanması, iş kazaları, kıdem ve ihbar tazminatı alacakları ile işe iade davalarında koruyucu hukuk çerçevesinde danışmanlık yapıyoruz.\n\nSunduğumuz Hizmetler:\n- İş Sözleşmelerinin Hazırlanması ve Feshi\n- İşe İade Davaları\n- Kıdem ve İhbar Tazminatı Süreçleri\n- İş Kazalarından Doğan Tazminat Davaları",
      detailEN: "We provide consultancy within the framework of preventive law in regulating employee-employer relations, preparing labor contracts, work accidents, severance and notice indemnity claims, and reinstatement cases.\n\nOur Services:\n- Preparation and Termination of Employment Contracts\n- Reinstatement Cases\n- Severance and Notice Pay Processes\n- Compensation Cases Arising from Work Accidents",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop"
    },
    {
      id: "vergi-hukuku",
      icon: CreditCard,
      titleTR: "Vergi Hukuku",
      titleEN: "Tax Law",
      descTR: "Vergi incelemeleri, uyuşmazlıkları ve vergi planlaması süreçlerinde danışmanlık.",
      descEN: "Consultancy in tax inspections, disputes and tax planning processes.",
      detailTR: "Vergi uyuşmazlıklarının idari ve yargısal yollarla çözümü, vergi cezaları, gümrük mevzuatı ve uluslararası vergilendirme konularında uzman kadromuzla yanınızdayız.\n\nSunduğumuz Hizmetler:\n- Vergi İnceleme Süreçlerinde Danışmanlık\n- Vergi Davalarının Takibi\n- Çifte Vergilendirmeyi Önleme Anlaşmaları\n- Gümrük Uyuşmazlıkları",
      detailEN: "We stand by your side with our expert staff in the resolution of tax disputes through administrative and judicial channels, tax penalties, customs legislation, and international taxation.\n\nOur Services:\n- Consultancy in Tax Inspection Processes\n- Follow-up of Tax Cases\n- Double Taxation Avoidance Agreements\n- Customs Disputes",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop"
    },
    {
      id: "aile-hukuku",
      icon: Heart,
      titleTR: "Aile Hukuku",
      titleEN: "Family Law",
      descTR: "Boşanma, velayet, nafaka ve mal rejimi uyuşmazlıklarında hukuki destek.",
      descEN: "Legal support in divorce, custody, alimony and property regime disputes.",
      detailTR: "Anlaşmalı ve çekişmeli boşanma davaları, mal rejimi tasfiyesi, nafaka ve velayet talepleri, soybağı davaları ile aile içi şiddet durumlarında gizlilik esasına azami dikkat ederek destek sağlıyoruz.\n\nSunduğumuz Hizmetler:\n- Anlaşmalı ve Çekişmeli Boşanma Davaları\n- Velayet ve Nafaka Davaları\n- Mal Rejiminin Tasfiyesi\n- Tanıma ve Tenfiz İşlemleri",
      detailEN: "We provide support in uncontested and contested divorce cases, liquidation of property regimes, alimony and custody demands, lineage cases, and domestic violence situations, paying maximum attention to confidentiality.\n\nOur Services:\n- Uncontested and Contested Divorce Cases\n- Custody and Alimony Cases\n- Liquidation of Property Regime\n- Recognition and Enforcement Procedures",
      image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "miras-hukuku",
      icon: FileText,
      titleTR: "Miras Hukuku",
      titleEN: "Inheritance Law",
      descTR: "Vasiyetname hazırlığı, veraset ilamı ve miras paylaşımı davaları.",
      descEN: "Will preparation, certificate of inheritance and inheritance sharing cases.",
      detailTR: "Miras paylaşımı, vasiyetname ve miras sözleşmelerinin düzenlenmesi, saklı pay hakları, tenkis ve muris muvazaası davalarında hak kayıplarını engellemek amacıyla müvekkillerimizin yanındayız.\n\nSunduğumuz Hizmetler:\n- Vasiyetname Hazırlanması\n- Veraset İlamı (Mirasçılık Belgesi) Alınması\n- Mirasın Paylaştırılması Davaları\n- Tenkis ve Muvazaa Davaları",
      detailEN: "We stand by our clients to prevent loss of rights in inheritance distribution, preparation of wills and inheritance contracts, reserved share rights, reduction, and collusion of legator cases.\n\nOur Services:\n- Preparation of Wills\n- Obtaining Certificate of Inheritance\n- Inheritance Distribution Cases\n- Reduction and Collusion Cases",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop"
    },
    {
      id: "icra-hukuku",
      icon: Gavel,
      titleTR: "İcra ve İflas Hukuku",
      titleEN: "Bankruptcy Law",
      descTR: "Alacak takibi, icra süreçleri ve şirket yapılandırma işlemleri.",
      descEN: "Debt collection, enforcement processes and company restructuring operations.",
      detailTR: "Alacakların tahsili amacıyla icra takipleri başlatılması, borç tasfiye görüşmeleri, rehin ve ipotek işlemlerinin tesisi, şirket iflas ve konkordato süreçlerinin takibini yürütüyoruz.\n\nSunduğumuz Hizmetler:\n- İlamlı ve İlamsız İcra Takipleri\n- İflas ve Konkordato Süreçleri\n- İhtiyati Haciz İşlemleri\n- İhalenin Feshi Davaları",
      detailEN: "We carry out the initiation of enforcement proceedings for debt collection, debt liquidation negotiations, establishment of pledge and mortgage transactions, and follow-up of corporate bankruptcy and concordat processes.\n\nOur Services:\n- Enforcement Proceedings with/without Judgment\n- Bankruptcy and Concordat Processes\n- Precautionary Attachment Procedures\n- Cases for Annulment of Tender",
      image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "ceza-hukuku",
      icon: Shield,
      titleTR: "Ceza Hukuku",
      titleEN: "Criminal Law",
      descTR: "Ağır ceza ve asliye ceza mahkemelerinde savunma ve danışmanlık hizmetleri.",
      descEN: "Defense and consultancy services in heavy and civil criminal courts.",
      detailTR: "Soruşturma aşamasından kovuşturma aşamasına kadar tüm ceza yargılamalarında, şüpheli, sanık veya mağdur konumundaki müvekkillerimizin hak ve özgürlüklerini titizlikle savunuyoruz.\n\nSunduğumuz Hizmetler:\n- Soruşturma Aşamasında Savunma\n- Ağır Ceza Mahkemelerindeki Davalar\n- Bilişim Suçları\n- Ekonomik Suçlar",
      detailEN: "In all criminal trials from the investigation stage to the prosecution stage, we meticulously defend the rights and freedoms of our clients in the status of suspect, defendant, or victim.\n\nOur Services:\n- Defense at the Investigation Stage\n- Cases in Heavy Penal Courts\n- IT Crimes\n- Economic Crimes",
      image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "sozlesmeler",
      icon: FileText,
      titleTR: "Sözleşmeler Hukuku",
      titleEN: "Law of Contracts",
      descTR: "Ticari, gayrimenkul ve lisans sözleşmelerinde profesyonel hukuki destek.",
      descEN: "Professional legal support in commercial, real estate and licensing agreements.",
      detailTR: "Her türlü sözleşmenin hazırlanması, incelenmesi, risk analizlerinin yapılması ve sözleşmeden kaynaklanan uyuşmazlıkların çözümünde kapsamlı koruma mekanizmaları inşa ediyoruz.\n\nSunduğumuz Hizmetler:\n- Ticari Sözleşmelerin Hazırlanması\n- Gizlilik (NDA) ve Lisans Sözleşmeleri\n- Gayrimenkul Alım Satım ve Kira Sözleşmeleri\n- Sözleşme İhlalinden Doğan Davalar",
      detailEN: "We build comprehensive protection mechanisms in the preparation, review, risk analysis, and resolution of disputes arising from all kinds of contracts.\n\nOur Services:\n- Preparation of Commercial Contracts\n- Non-Disclosure (NDA) and Licensing Agreements\n- Real Estate Sales and Lease Contracts\n- Lawsuits Arising from Breach of Contract",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const service = practiceAreas.find((s) => s.id === serviceId);

  if (!service) return null;

  const IconC = service.icon;

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
      <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: `url(${service.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40 z-10" />
        
        <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-[#d4af37]/20 border border-[#d4af37]/50 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <IconC className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            {tx(service.titleTR, service.titleEN)}
          </h1>
          <p className="text-slate-200 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {tx(service.descTR, service.descEN)}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl -mt-32 relative z-30">
            <h2 className="text-[#1a237e] font-serif text-2xl sm:text-3xl font-bold mb-6">
              {tx("Hizmet Detayları", "Service Details")}
            </h2>
            <div className="w-12 h-1 bg-[#d4af37] rounded mb-8" />
            
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
              {tx(service.detailTR, service.detailEN).split('\n').map((paragraph, idx) => (
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

            {/* CTA inside content */}
            <div className="mt-12 p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1a237e] mb-2">
                  {tx("Hukuki Desteğe mi İhtiyacınız Var?", "Need Legal Support?")}
                </h3>
                <p className="text-slate-600 text-sm">
                  {tx("Uzman avukatlarımızla görüşmek için hemen randevu alın.", "Schedule an appointment now to speak with our expert lawyers.")}
                </p>
              </div>
              <button 
                onClick={onContactClick}
                className="bg-[#1a237e] text-white hover:bg-[#12185c] px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
              >
                {tx("İletişime Geçin", "Contact Us")}
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer (Simplified) */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-white">
             <Gavel className="w-5 h-5 text-[#d4af37]" />
             <span className="font-serif text-lg font-bold tracking-tight">EDBM Law Firm</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            {tx("1998'den bu yana adaletin tecellisi ve müvekkil haklarının korunması için profesyonel duruş sergiliyoruz.", "Since 1998, we have maintained a professional stance for the manifestation of justice and protection of client rights.")}
          </p>
          <div className="text-xs text-slate-500 font-medium pt-6 border-t border-slate-800/80 w-full max-w-sm">
             © 2026 EDBM {tx("Hukuk Bürosu", "Law Firm")}. {tx("Tüm Hakları Saklıdır", "All Rights Reserved")}.
          </div>
        </div>
      </footer>
    </div>
  );
}
