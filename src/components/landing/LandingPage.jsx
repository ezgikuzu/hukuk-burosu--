import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLanguage, addMessage, showToast, addClient } from "../../store";
import { 
  Scale, Gavel, Briefcase, Users, CreditCard, Heart, FileText, Shield, 
  MapPin, Phone, Mail, Globe, ChevronLeft, ChevronRight, X, ArrowRight, Check, Send, Sparkles
} from "lucide-react";
import ServiceDetail from "./ServiceDetail";
import LawyerDetail from "../lawyer/LawyerDetail";
import BlogDetail from "./BlogDetail";
import AboutUs from "./AboutUs";
import LegalDetail from "../lawyer/LegalDetail";

export default function LandingPage({ onLoginClick }) {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language) || "TR";
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.currentUser);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWzQcEepf5CFpw8zQbaJrt7VlK3eydl9BwwCRlniZ2MD5v0MiOCcOIf5_h_XpOCO-f2PkZ0RSkwuIFvqPAF-WoBOr3Te0kSTkF_CrpD1tLVMBz_XhHszBM2hXhxhbGNQadvP7c4H0rhgzDlfHBn9fNT29sViqyAPvpEsnpcoOUzKywX7P0UtXwWrNsh6p2t5NgqdPVfk98y0nEYe9a92K95BEJA07qvU_dRPAWliLnO44CsVrQbDoZHQJEkpaLhMAgsJcm6b8fVN8",
      titleTR: "EDBM HUKUK BÜROSU",
      titleEN: "EDBM LAW FIRM",
      subtitleTR: "1998 İSTANBUL",
      subtitleEN: "SINCE 1998 ISTANBUL",
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeFXkKO8n1_PBgj226tQkE7DF_0QuYkQVWaOpUVYIUWUvW4q_XufC6Msuc7l92VUY1C1dlSyK3IS53mDsCibPVLTVvwoeC9hJPRl0UoRo5bQlBFVIdPc-6_0RfXAAPf8mF51j8hrTgpFDEuhna0gkq5R3ZmNIJUjfk-ALKbz9oZ_NIgPAodff_3fu4PKSRo7xhD-DCtFuiceVaGGlX8ZhOmsAR_0wn7dEyUVkeLlYbaFMHSdd3fH6glezYwS6si-iIzdLDakX7A5k",
      titleTR: "GÜVEN VE DENEYİM",
      titleEN: "TRUST AND EXPERIENCE",
      subtitleTR: "25 YILLIK HUKUKİ TİTİZLİK",
      subtitleEN: "25 YEARS OF LEGAL DILIGENCE",
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Contact Form State
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", lawyer: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Virtual Detail Router States (for Practice areas, Lawyers and Blogs)
  const [activeDetail, setActiveDetail] = useState(null); // { type: 'practice'|'lawyer'|'blog', id: string }
  const [activeView, setActiveView] = useState("home"); // "home" | "contact" | "about"

  // Practice Areas Data
  const practiceAreas = [
    {
      id: "ticaret-hukuku",
      icon: Briefcase,
      titleTR: "Ticaret Hukuku",
      titleEN: "Commercial Law",
      descTR: "Şirket kuruluşları, ana sözleşme değişiklikleri ve ticari uyuşmazlıkların çözümü.",
      descEN: "Company formations, articles of association amendments and resolution of commercial disputes.",
      detailTR: "EDBM Hukuk Bürosu olarak, ticaret hayatının dinamik yapısına uygun, hızlı ve proaktif hukuki çözümler sunuyoruz. Şirketler hukuku, birleşme ve devralmalar, sözleşmeler hukuku ve haksız rekabet davalarında müvekkillerimizi en üst düzeyde temsil etmekteyiz.",
      detailEN: "As EDBM Law Firm, we offer rapid and proactive legal solutions suited to the dynamic structure of commercial life. We represent our clients at the highest level in corporate law, mergers and acquisitions, contracts law, and unfair competition cases."
    },
    {
      id: "is-hukuku",
      icon: Users,
      titleTR: "İş Hukuku",
      titleEN: "Labor Law",
      descTR: "İşe iade, tazminat davaları ve toplu iş sözleşmesi görüşmelerinin yönetimi.",
      descEN: "Management of reinstatement cases, compensation lawsuits and collective labor agreement negotiations.",
      detailTR: "İşçi ve işveren ilişkilerinin düzenlenmesi, iş sözleşmelerinin hazırlanması, iş kazaları, kıdem ve ihbar tazminatı alacakları ile işe iade davalarında koruyucu hukuk çerçevesinde danışmanlık yapıyoruz.",
      detailEN: "We provide consultancy within the framework of preventive law in regulating employee-employer relations, preparing labor contracts, work accidents, severance and notice indemnity claims, and reinstatement cases."
    },
    {
      id: "vergi-hukuku",
      icon: CreditCard,
      titleTR: "Vergi Hukuku",
      titleEN: "Tax Law",
      descTR: "Vergi incelemeleri, uyuşmazlıkları ve vergi planlaması süreçlerinde danışmanlık.",
      descEN: "Consultancy in tax inspections, disputes and tax planning processes.",
      detailTR: "Vergi uyuşmazlıklarının idari ve yargısal yollarla çözümü, vergi cezaları, gümrük mevzuatı ve uluslararası vergilendirme konularında uzman kadromuzla yanınızdayız.",
      detailEN: "We stand by your side with our expert staff in the resolution of tax disputes through administrative and judicial channels, tax penalties, customs legislation, and international taxation."
    },
    {
      id: "aile-hukuku",
      icon: Heart,
      titleTR: "Aile Hukuku",
      titleEN: "Family Law",
      descTR: "Boşanma, velayet, nafaka ve mal rejimi uyuşmazlıklarında hukuki destek.",
      descEN: "Legal support in divorce, custody, alimony and property regime disputes.",
      detailTR: "Anlaşmalı ve çekişmeli boşanma davaları, mal rejimi tasfiyesi, nafaka ve velayet talepleri, soybağı davaları ile aile içi şiddet durumlarında gizlilik esasına azami dikkat ederek destek sağlıyoruz.",
      detailEN: "We provide support in uncontested and contested divorce cases, liquidation of property regimes, alimony and custody demands, lineage cases, and domestic violence situations, paying maximum attention to confidentiality."
    },
    {
      id: "miras-hukuku",
      icon: FileText,
      titleTR: "Miras Hukuku",
      titleEN: "Inheritance Law",
      descTR: "Vasiyetname hazırlığı, veraset ilamı ve miras paylaşımı davaları.",
      descEN: "Will preparation, certificate of inheritance and inheritance sharing cases.",
      detailTR: "Miras paylaşımı, vasiyetname ve miras sözleşmelerinin düzenlenmesi, saklı pay hakları, tenkis ve muris muvazaası davalarında hak kayıplarını engellemek amacıyla müvekkillerimizin yanındayız.",
      detailEN: "We stand by our clients to prevent loss of rights in inheritance distribution, preparation of wills and inheritance contracts, reserved share rights, reduction, and collusion of legator cases."
    },
    {
      id: "icra-hukuku",
      icon: Gavel,
      titleTR: "İcra ve İflas Hukuku",
      titleEN: "Bankruptcy Law",
      descTR: "Alacak takibi, icra süreçleri ve şirket yapılandırma işlemleri.",
      descEN: "Debt collection, enforcement processes and company restructuring operations.",
      detailTR: "Alacakların tahsili amacıyla icra takipleri başlatılması, borç tasfiye görüşmeleri, rehin ve ipotek işlemlerinin tesisi, şirket iflas ve konkordato süreçlerinin takibini yürütüyoruz.",
      detailEN: "We carry out the initiation of enforcement proceedings for debt collection, debt liquidation negotiations, establishment of pledge and mortgage transactions, and follow-up of corporate bankruptcy and concordat processes."
    },
    {
      id: "ceza-hukuku",
      icon: Shield,
      titleTR: "Ceza Hukuku",
      titleEN: "Criminal Law",
      descTR: "Ağır ceza ve asliye ceza mahkemelerinde savunma ve danışmanlık hizmetleri.",
      descEN: "Defense and consultancy services in heavy and civil criminal courts.",
      detailTR: "Soruşturma aşamasından kovuşturma aşamasına kadar tüm ceza yargılamalarında, şüpheli, sanık veya mağdur konumundaki müvekkillerimizin hak ve özgürlüklerini titizlikle savunuyoruz.",
      detailEN: "In all criminal trials from the investigation stage to the prosecution stage, we meticulously defend the rights and freedoms of our clients in the status of suspect, defendant, or victim."
    },
    {
      id: "sozlesmeler",
      icon: FileText,
      titleTR: "Sözleşmeler Hukuku",
      titleEN: "Law of Contracts",
      descTR: "Ticari, gayrimenkul ve lisans sözleşmelerinde profesyonel hukuki destek.",
      descEN: "Professional legal support in commercial, real estate and licensing agreements.",
      detailTR: "Her türlü sözleşmenin hazırlanması, incelenmesi, risk analizlerinin yapılması ve sözleşmeden kaynaklanan uyuşmazlıkların çözümünde kapsamlı koruma mekanizmaları inşa ediyoruz.",
      detailEN: "We build comprehensive protection mechanisms in the preparation, review, risk analysis, and resolution of disputes arising from all kinds of contracts."
    }
  ];

  // Lawyers Data
  const lawyers = [
    {
      id: "lawyer_1",
      name: "Av. Beyza Mensur",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBs9fibzs9m7PxJlKu7yIMcCC6tfaZggoJSIzEy8gGOszun-fWvTJI54kIS18NVusIXJqt9tQSMJSV6a3Ad7fRAEPh90yAvWMTvErHaz5oWlH-sZ3cLAJVwff3hUO44vJaU2OfT6BTgvuFggOkHxqInHnNUN51_R11uIaocBCCdlIEXa8PBAUujVnkJFqG1chVFRfgEZeYm0Y09XtLVGWGM7lt-JZRFlce3wmtBl17gq6CQHB112JdpjhUt2hZUTXCBE8GIkYkU1p8",
      roleTR: "Kurucu Ortak / Kıdemli Avukat",
      roleEN: "Founding Partner / Senior Lawyer",
      bioTR: "Av. Beyza Mensur, EDBM Hukuk Bürosu'nun kurucu ortağıdır. Galatasaray Üniversitesi Hukuk Fakültesi mezunudur. Şirketler Hukuku, Birleşmeler ve Devralmalar alanında 25 yılı aşkın tecrübeye sahiptir.",
      bioEN: "Att. Beyza Mensur is the founding partner of EDBM Law Firm. She graduated from Galatasaray University Faculty of Law. She has over 25 years of experience in Corporate Law, Mergers and Acquisitions."
    },
    {
      id: "lawyer_2",
      name: "Av. Ezgi Kuzu",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrkKfYlDQ35O6xTQ98CEkqB1OQFU_ez0cfczUuK4JAc11cI7H2tL8N5M0cYkE5OWMxSczfAE2YPLFysAp0AoW0fHbwDR4CT8Bz31Fjwe8qPGlug_XX26gDXSmlGbuKyNaBo4gdkR3skLuLpHFOoLrwHdjDeBH-qR-UtVr0viY5fos_1LsC0pI7ia1TdgiqahpqJuzFEc71t-SInWunHUtYo1eIhNdb5G4lNqtkg4NGY82WBy35HtDsoRDdmXIumOb7yVrWq7ibcss",
      roleTR: "Yönetici Ortak / İş Hukuku Uzmanı",
      roleEN: "Managing Partner / Labor Law Specialist",
      bioTR: "Av. Ezgi Kuzu, İstanbul Üniversitesi Hukuk Fakültesi mezunudur. İş Hukuku, sendikal uyuşmazlıklar ve kurumsal sözleşmeler konularında geniş bir uzmanlığa sahiptir.",
      bioEN: "Att. Ezgi Kuzu graduated from Istanbul University Faculty of Law. She has extensive expertise in Labor Law, union disputes, and corporate contracts."
    },
    {
      id: "lawyer_3",
      name: "Av. Muhammet Görkem İşkenceli",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2DdEHLb36QUhBDJK7EM7Q0DO5LDdec_rVeXOE1nZNKr8lAP3EUPDCO8yusNd3p5EgUmFUIJ2FOpLRlhQrZkC5ECmxhamnZIF5Q5ixL3e6aDJsSTQDUz9-1jXZbaA1gxv5TNxgJXNUlEtHwyFQQZvUJ59hOPtWxKJrf8vHo1lvOZ8IGjbINl0KNTP7Rc89sisJPAfS47WOVij4aBIrxIC8cmJSF_0vO6DXIrOQ4Fhz6nGEQTHsQWu2AKsMkY96YU7eb-Nvk_2Gy5E",
      roleTR: "Kıdemli Avukat / Ceza Hukuku Uzmanı",
      roleEN: "Senior Attorney / Criminal Law Specialist",
      bioTR: "Av. Muhammet Görkem İşkenceli, Ankara Üniversitesi Hukuk Fakültesi mezunudur. Ağır Ceza davaları, ekonomik suçlar ve bilişim hukuku alanlarında 15 yılı aşkın süredir müvekkillerine hizmet vermektedir.",
      bioEN: "Att. Muhammet Gorkem Iskenceli graduated from Ankara University Faculty of Law. He has been serving his clients in Heavy Penalty cases, financial crimes, and IT law for over 15 years."
    },
    {
      id: "lawyer_4",
      name: "Av. Dilek İnce",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9D1XgnCCjehZYJVpiD-_bfL7Na66lbbTo445XHb4MGg8hK4NiPeDClDEn5ok9UoHFFgOKPTXfOEM2N-3cwZIMy8eB-WjSr_DsVOfr3QdTWpJlX-5yXCPdJK6hiiqkTGcbgkAXtz3FjhKmqDwG4TBp7108fJXT1vd0P3HJkzMI29ecqyqfr8ULxDVyNavx8yXe1PYhq-87b83WCHVBzAOJObgLeHLsjaTZ1tXKbin7spXUFWglCZwULagr4ZHQ3fdZhuPF6zFe1yE",
      roleTR: "Uzman Avukat / Aile ve Miras Hukuku",
      roleEN: "Expert Lawyer / Family & Inheritance Law",
      bioTR: "Av. Dilek İnce, Marmara Üniversitesi Hukuk Fakültesi mezunudur. Aile hukuku, mal tasfiyeleri, vasiyetnameler ve miras paylaşımı konularındaki titiz çalışmalarıyla bilinir.",
      bioEN: "Att. Dilek Ince graduated from Marmara University Faculty of Law. She is known for her meticulous work in family law, property liquidation, wills, and inheritance distribution."
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      dispatch(showToast({
        message: language === "TR" ? "Lütfen tüm zorunlu alanları doldurun." : "Please fill in all required fields.",
        type: "error"
      }));
      return;
    }

    let targetLawyerId = "all";
    if (formData.lawyer) {
      const targetLawyer = lawyers.find(l => l.name === formData.lawyer);
      if (targetLawyer) targetLawyerId = targetLawyer.id;
    }

    let senderId = currentUser?.id;
    let senderName = currentUser?.name || formData.name;
    let senderRole = currentUser?.role || "client";

    // If guest, create a temporary client profile so lawyers can reply
    if (!isAuthenticated) {
      senderId = `lead_${Date.now()}`;
      dispatch(addClient({
        id: senderId,
        name: `${formData.name} (Web Form)`,
        email: formData.email,
        phone: "Belirtilmedi",
        nationalId: "00000000000",
        password: "form_lead_password",
        address: "Web Sitesi İletişim Formundan Ulaştı",
        lawyerId: targetLawyerId,
        createdAt: new Date().toISOString()
      }));
    }

    dispatch(addMessage({
      id: `msg_ext_${Date.now()}`,
      senderId: senderId,
      senderName: senderName,
      senderRole: senderRole,
      receiverId: targetLawyerId,
      content: `İletişim Formu:\nE-Posta: ${formData.email}\nKonu: ${formData.subject}\nMesaj: ${formData.message}`,
      timestamp: new Date().toISOString()
    }));

    setFormSubmitted(true);
    dispatch(showToast({
      message: language === "TR" ? "Mesajınız başarıyla iletildi!" : "Your message has been sent successfully!",
      type: "success"
    }));
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "", lawyer: "" });
    }, 4000);
  };

  // Blog Posts Data (Fetched from Redux)
  const blogPosts = useSelector((state) => state.blogs?.list) || [];

  // Global translation function helper for static UI parts
  const tx = (key) => {
    const textMap = {
      "logo-text": { TR: "EDBM Hukuk Bürosu", EN: "EDBM Law Firm" },
      "nav-home": { TR: "Ana Sayfa", EN: "Home" },
      "nav-about": { TR: "Hakkımızda", EN: "About Us" },
      "nav-practice": { TR: "Uzmanlık Alanları", EN: "Practice Areas" },
      "nav-contact": { TR: "İletişim", EN: "Contact" },
      "btn-login": { TR: "Portala Giriş", EN: "Portal Login" },
      "hero-btn": { TR: "Ücretsiz Danışmanlık Alın", EN: "Get Free Consultation" },
      "about-tag": { TR: "Hakkımızda", EN: "About Us" },
      "about-title": { TR: "Yirmi Beş Yıllık Tecrübe ve Hukuki Titizlik", EN: "Twenty-Five Years of Experience and Legal Diligence" },
      "about-p1": { 
        TR: "EDBM Hukuk Bürosu, 1998 yılından bu yana İstanbul merkezli olarak yerli ve yabancı müvekkillerine yüksek standartlarda hukuki danışmanlık ve avukatlık hizmeti sunmaktadır.", 
        EN: "Since 1998, EDBM Law Firm, based in Istanbul, has been providing high-standard legal consultancy and advocacy services to its local and foreign clients." 
      },
      "about-p2": { 
        TR: "Temel ilkemiz, her bir müvekkilimizin ihtiyacına özel, şeffaf ve sonuç odaklı çözümler üretmektir. Corporate Modernism anlayışımızla, geleneksel hukuk değerlerini dijital çağın hızı ve gereksinimleriyle harmanlıyoruz.", 
        EN: "Our core principle is to produce transparent and result-oriented solutions specific to the needs of each client. With our Corporate Modernism approach, we blend traditional legal values with the speed and requirements of the digital age." 
      },
      "stat-1": { TR: "Yıllık Tecrübe", EN: "Years of Experience" },
      "stat-2": { TR: "Başarılı Dava", EN: "Successful Cases" },
      "stat-3": { TR: "Uzman Ortak", EN: "Expert Partners" },
      "service-tag": { TR: "Hizmetlerimiz", EN: "Our Services" },
      "service-title": { TR: "Uzmanlık Alanlarımız", EN: "Practice Areas" },
      "team-tag": { TR: "Ekibimiz", EN: "Our Team" },
      "team-title": { TR: "Uzman Avukatlarımız", EN: "Our Expert Lawyers" },
      "blog-tag": { TR: "Blog Yazılarımız", EN: "Our Blog Posts" },
      "blog-title": { TR: "Hukuki Gelişmeler ve Rehberler", EN: "Legal Developments & Guides" },
      "contact-tag": { TR: "Bize Ulaşın", EN: "Contact Us" },
      "contact-title": { TR: "İletişim Bilgileri", EN: "Contact Information" },
      "contact-addr": { TR: "Adres", EN: "Address" },
      "contact-addr-val": { 
        TR: "Büyükdere Cad. No:193 Levent Loft, No:4-6 Beşiktaş, İstanbul, Türkiye", 
        EN: "Buyukdere Ave. No:193 Levent Loft, No:4-6 Besiktas, Istanbul, Turkey" 
      },
      "contact-phone": { TR: "Telefon", EN: "Phone" },
      "contact-email": { TR: "E-postalar", EN: "E-mail" },
      "btn-send": { TR: "Mesajı Gönder", EN: "Send Message" },
      "footer-desc": { 
        TR: "1998'den bu yana adaletin tecellisi ve müvekkil haklarının korunması için profesyonel, şeffaf ve kararlı bir duruş sergiliyoruz.", 
        EN: "Since 1998, we have maintained a professional, transparent, and determined stance for the manifestation of justice and the protection of client rights." 
      },
      "footer-links-title": { TR: "Hızlı Bağlantılar", EN: "Quick Links" },
      "footer-copy": { TR: "© 2026 EDBM Hukuk Bürosu. Tüm Hakları Saklıdır.", EN: "© 2026 EDBM Law Firm. All Rights Reserved." },
      "footer-privacy": { TR: "Gizlilik Politikası", EN: "Privacy Policy" },
      "footer-terms": { TR: "Kullanım Koşulları", EN: "Terms of Use" },
      "footer-kvkk": { TR: "KVKK Aydınlatma Metni", EN: "PDPL Disclosure Text" },
      "more-info": { TR: "Detaylı Bilgi", EN: "Detailed Information" },
      "view-profile": { TR: "Profili İncele", EN: "View Profile" },
      "back-to-home": { TR: "Anasayfaya Geri Dön", EN: "Back to Home Page" },
      "message-success": { TR: "Mesajınız başarıyla iletildi! En kısa sürede dönüş sağlayacağız.", EN: "Your message has been sent successfully! We will get back to you soon." }
    };

    return textMap[key]?.[language] || key;
  };

  const handleConsultationClick = () => {
    setActiveView("contact");
    window.scrollTo(0, 0);
  };

  if (activeDetail && activeDetail.type === "practice") {
    return (
      <ServiceDetail 
        serviceId={activeDetail.id} 
        onBack={() => setActiveDetail(null)} 
        onContactClick={() => {
          setActiveDetail(null);
          setActiveView("contact");
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (activeDetail && activeDetail.type === "lawyer") {
    const lName = lawyers.find(l => l.id === activeDetail.id)?.name || "";
    return (
      <LawyerDetail 
        lawyerId={activeDetail.id} 
        onBack={() => setActiveDetail(null)} 
        onContactClick={() => {
          setActiveDetail(null);
          setFormData(prev => ({ ...prev, lawyer: lName }));
          setActiveView("contact");
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (activeDetail && activeDetail.type === "blog") {
    const authorName = blogPosts.find(b => b.id === activeDetail.id)?.author || "";
    return (
      <BlogDetail 
        blogId={activeDetail.id} 
        onBack={() => setActiveDetail(null)} 
        onContactClick={() => {
          setActiveDetail(null);
          setFormData(prev => ({ ...prev, lawyer: authorName }));
          setActiveView("contact");
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (activeDetail && activeDetail.type === "legal") {
    return (
      <LegalDetail 
        legalId={activeDetail.id} 
        onBack={() => setActiveDetail(null)} 
      />
    );
  }

  return (
    <div className="bg-slate-50 text-[#1b1c1c] font-sans min-h-screen relative overflow-x-hidden antialiased">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-20 shadow-sm transition-all">
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-full">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveView("home"); setActiveDetail(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center border border-[#d4af37]/30 shadow-md">
              <Gavel className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#1a237e] block tracking-tight">{tx("logo-text")}</span>
              <span className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold block -mt-1">LEGAL & CONSULTING</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 h-full font-medium">
            <button onClick={() => { setActiveView("home"); window.scrollTo(0, 0); }} className="text-sm text-slate-800 hover:text-[#1a237e] transition-colors py-2 cursor-pointer">{tx("nav-home")}</button>
            <button onClick={() => { setActiveView("about"); window.scrollTo(0, 0); }} className="text-sm text-slate-800 hover:text-[#1a237e] transition-colors py-2 cursor-pointer">{tx("nav-about")}</button>
            
            {/* Mega Menu Toggle (Practice Areas) */}
            <div className="relative group h-full flex items-center">
              <button className="text-sm text-slate-800 hover:text-[#1a237e] flex items-center gap-1 transition-colors">
                <span>{tx("nav-practice")}</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </button>
              
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[540px] bg-white border border-slate-200 rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-1 z-50">
                <div>
                  <h4 className="font-bold text-xs text-[#1a237e] mb-3 border-b border-slate-100 pb-1.5 uppercase tracking-wider">
                    {language === "TR" ? "Kurumsal Hizmetler" : "Corporate Services"}
                  </h4>
                  <ul className="space-y-2">
                    {practiceAreas.slice(0, 4).map((area) => (
                      <li key={area.id}>
                        <button
                          onClick={() => setActiveDetail({ type: "practice", id: area.id })}
                          className="text-xs text-slate-600 hover:text-[#1a237e] flex items-center gap-2 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full shrink-0"></span>
                          <span>{language === "TR" ? area.titleTR : area.titleEN}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1a237e] mb-3 border-b border-slate-100 pb-1.5 uppercase tracking-wider">
                    {language === "TR" ? "Bireysel Hizmetler" : "Private Services"}
                  </h4>
                  <ul className="space-y-2">
                    {practiceAreas.slice(4).map((area) => (
                      <li key={area.id}>
                        <button
                          onClick={() => setActiveDetail({ type: "practice", id: area.id })}
                          className="text-xs text-slate-600 hover:text-[#1a237e] flex items-center gap-2 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full shrink-0"></span>
                          <span>{language === "TR" ? area.titleTR : area.titleEN}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <button onClick={() => { setActiveView("contact"); window.scrollTo(0, 0); }} className="text-sm text-slate-800 hover:text-[#1a237e] transition-colors py-2 cursor-pointer">{tx("nav-contact")}</button>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector Button */}
            <button
              onClick={() => dispatch(toggleLanguage())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-slate-700 font-sans text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{language}</span>
            </button>

            {/* Login CTA */}
            <button
              onClick={onLoginClick}
              className="bg-[#1a237e] text-white hover:bg-[#12185c] font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm border-b-2 border-indigo-950 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {tx("btn-login")}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Slider Section */}
      {activeView === "home" && (
        <>
          <section id="home" className="relative h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full relative">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                  idx === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
                }`}
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                {/* Elegant overlay to guarantee high-contrast text rendering */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/65 to-slate-900/90" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Content Box with stagger animation effect */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/35 text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>ESTABLISHED 1998</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
            {language === "TR" ? slides[currentSlide].titleTR : slides[currentSlide].titleEN}
          </h1>
          <p className="font-sans text-xs sm:text-sm tracking-[0.3em] text-[#d4af37] font-semibold">
            {language === "TR" ? slides[currentSlide].subtitleTR : slides[currentSlide].subtitleEN}
          </p>
          <div className="pt-8">
            <button
              onClick={handleConsultationClick}
              className="bg-[#d4af37] text-[#1a237e] hover:bg-amber-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg hover:shadow-amber-500/10 transition-all hover:scale-105 cursor-pointer border-b-2 border-amber-600"
            >
              {tx("hero-btn")}
            </button>
          </div>
        </div>

        {/* Slider Indicator Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-10 bg-[#d4af37]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[#d4af37] font-bold text-xs uppercase tracking-widest block">{tx("about-tag")}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a237e] tracking-tight">
              {tx("about-title")}
            </h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>{tx("about-p1")}</p>
              <p>{tx("about-p2")}</p>
            </div>
            
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-100">
              <div>
                <div className="text-3xl font-serif font-bold text-[#1a237e]">25+</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">{tx("stat-1")}</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-[#1a237e]">1500+</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">{tx("stat-2")}</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-[#1a237e]">4</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">{tx("stat-3")}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-100">
              <img
                alt="Law Firm Meeting Room"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeFXkKO8n1_PBgj226tQkE7DF_0QuYkQVWaOpUVYIUWUvW4q_XufC6Msuc7l92VUY1C1dlSyK3IS53mDsCibPVLTVvwoeC9hJPRl0UoRo5bQlBFVIdPc-6_0RfXAAPf8mF51j8hrTgpFDEuhna0gkq5R3ZmNIJUjfk-ALKbz9oZ_NIgPAodff_3fu4PKSRo7xhD-DCtFuiceVaGGlX8ZhOmsAR_0wn7dEyUVkeLlYbaFMHSdd3fH6glezYwS6si-iIzdLDakX7A5k"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-amber-50 rounded-2xl -z-0 border border-amber-100/50" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-50/50 rounded-2xl -z-0 border border-indigo-100/30" />
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] font-bold text-xs uppercase tracking-widest block">{tx("service-tag")}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a237e] tracking-tight">{tx("service-title")}</h2>
            <div className="w-16 h-1 bg-[#d4af37] mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area) => {
              const IconComp = area.icon;
              return (
                <div
                  key={area.id}
                  onClick={() => setActiveDetail({ type: "practice", id: area.id })}
                  className="group bg-[#1a237e] rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#d4af37]/15 flex flex-col justify-between hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
                  <div>
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white/15 transition-colors border border-white/10">
                      <IconComp className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white mb-3">
                      {language === "TR" ? area.titleTR : area.titleEN}
                    </h3>
                    <p className="text-slate-300/90 text-xs leading-relaxed mb-6 line-clamp-3">
                      {language === "TR" ? area.descTR : area.descEN}
                    </p>
                  </div>
                  <span className="text-[#d4af37] font-bold text-xs flex items-center gap-2 group-hover:translate-x-1.5 transition-transform">
                    <span>{tx("more-info")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lawyers Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] font-bold text-xs uppercase tracking-widest block">{tx("team-tag")}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a237e] tracking-tight">{tx("team-title")}</h2>
            <div className="w-16 h-1 bg-[#d4af37] mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {lawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                onClick={() => setActiveDetail({ type: "lawyer", id: lawyer.id })}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                <img
                  alt={lawyer.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  src={lawyer.image}
                  referrerPolicy="no-referrer"
                />
                {/* Visual rich gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e] via-[#1a237e]/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-serif text-base font-bold mb-1 tracking-tight">{lawyer.name}</h4>
                  <p className="text-[#d4af37] text-[11px] font-semibold uppercase tracking-wider mb-4">
                    {language === "TR" ? lawyer.roleTR : lawyer.roleEN}
                  </p>
                  <button className="text-white text-[10px] uppercase font-bold tracking-widest border-b border-white/30 pb-0.5 group-hover:border-white transition-all">
                    {tx("view-profile")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#d4af37] font-bold text-xs uppercase tracking-widest block">{tx("blog-tag")}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a237e] tracking-tight">{tx("blog-title")}</h2>
            <div className="w-16 h-1 bg-[#d4af37] mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActiveDetail({ type: "blog", id: post.id })}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200/60 flex flex-col hover:-translate-y-1.5"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    alt={language === "TR" ? post.titleTR : post.titleEN}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    src={post.image}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#1a237e]/10 mix-blend-multiply" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-[#1a237e] line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
                      {language === "TR" ? post.titleTR : post.titleEN}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {language === "TR" ? post.excerptTR : post.excerptEN}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-5 mt-5 border-t border-slate-100">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 bg-slate-100 shrink-0">
                      <img alt={post.author} className="w-full h-full object-cover" src={post.authorImg} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{post.author}</span>
                      <span className="text-[10px] text-slate-400 font-medium">EDBM Legal Author</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </>
      )}

      {/* Contact & Map Section */}
      {activeView === "contact" && (
        <div className="pt-20 animate-fade-in min-h-[70vh]">
          <div className="bg-[#1a237e] text-white py-16 text-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a237e] to-[#283593] opacity-90 z-0" />
            <div className="relative z-10">
              <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">{tx("contact-tag")}</h1>
              <div className="w-16 h-1 bg-[#d4af37] mx-auto rounded" />
            </div>
          </div>
          <section id="contact" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-[#d4af37] font-bold text-xs uppercase tracking-widest block">{tx("contact-tag")}</span>
                <h2 className="font-serif text-3xl font-bold text-[#1a237e] tracking-tight">{tx("contact-title")}</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {language === "TR" 
                    ? "Hukuki sorularınız, danışmanlık talepleriniz veya dava süreçleriniz için bizimle irtibata geçebilirsiniz." 
                    : "You can contact us for your legal questions, consultancy requests, or litigation processes."}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-[#1a237e]/10 rounded-lg flex items-center justify-center shrink-0 border border-[#1a237e]/10">
                    <MapPin className="w-5 h-5 text-[#1a237e]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1a237e] uppercase tracking-wider mb-1">{tx("contact-addr")}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{tx("contact-addr-val")}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-[#1a237e]/10 rounded-lg flex items-center justify-center shrink-0 border border-[#1a237e]/10">
                    <Phone className="w-5 h-5 text-[#1a237e]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1a237e] uppercase tracking-wider mb-1">{tx("contact-phone")}</h4>
                    <p className="text-slate-600 text-xs font-semibold">+90 (212) 555 00 00</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-[#1a237e]/10 rounded-lg flex items-center justify-center shrink-0 border border-[#1a237e]/10">
                    <Mail className="w-5 h-5 text-[#1a237e]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1a237e] uppercase tracking-wider mb-1">{tx("contact-email")}</h4>
                    <p className="text-slate-600 text-xs">info@edbmhukuk.com</p>
                  </div>
                </div>
              </div>

              {/* Minimal Aesthetic Vector Location placeholder representation */}
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group h-44">
                <img
                  alt="Office Location Levent Istanbul Map"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeAE4DzGYsySsQY2K60uWdGXpwMGadSei9lsw3M5jQzhUG9_ntka_UK6DDFelkoQFVjXo7p5B_q4iLMrIYhSx7jZl-6SveEGYaN7LG3JLa5d0MxIu2W5kPQfpg-XXxKviTz20ETQcmp1R8ql89oTKXP_AsxbW-8U5tnYKoc1g7XEU-H546zX8OTi22oPJVeNv8_Ltfo7MCpTYxNusINC3pysvTbe2hPgRn9q-lyjNRRV6aCmm2AXZdCq-BjVFFVubjUcJ2gT9qOjk"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#1a237e]/10 mix-blend-color hover:opacity-0 transition-opacity" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleContactSubmit} className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
                {formSubmitted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{tx("message-success")}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === "TR" ? "Adınız Soyadınız" : "Full Name"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === "TR" ? "Örn: Ahmet Yılmaz" : "e.g., John Doe"}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === "TR" ? "E-Posta Adresiniz" : "Email Address"} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@email.com"
                      className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === "TR" ? "Konu" : "Subject"}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={language === "TR" ? "Hukuki Danışmanlık Talebi" : "Legal Consultancy Request"}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {language === "TR" ? "İlgili Avukat (İsteğe Bağlı)" : "Related Lawyer (Optional)"}
                    </label>
                    <select
                      value={formData.lawyer}
                      onChange={(e) => setFormData({ ...formData, lawyer: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    >
                      <option value="">{language === "TR" ? "Genel Danışmanlık" : "General Consultation"}</option>
                      {lawyers.map(l => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {language === "TR" ? "Mesajınız" : "Your Message"} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === "TR" ? "Lütfen detayları yazınız..." : "Please write the details of your inquiry..."}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a237e] focus:border-[#1a237e] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1a237e] text-white hover:bg-[#12185c] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer border-b-2 border-indigo-950 active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{tx("btn-send")}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </div>
      )}

      {activeView === "about" && (
        <AboutUs />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-9 h-9 rounded-lg bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/35 shadow-inner">
                  <Gavel className="w-4.5 h-4.5 text-[#d4af37]" />
                </div>
                <span className="font-serif text-lg font-bold tracking-tight">{tx("logo-text")}</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {tx("footer-desc")}
              </p>
            </div>
            
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">{tx("footer-links-title")}</h5>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => { setActiveView("home"); window.scrollTo(0,0); }} className="hover:text-[#d4af37] transition-colors">{tx("nav-home")}</button></li>
                <li><button onClick={() => { setActiveView("about"); window.scrollTo(0,0); }} className="hover:text-[#d4af37] transition-colors">{tx("nav-about")}</button></li>
                <li><button onClick={() => { setActiveView("contact"); window.scrollTo(0,0); }} className="hover:text-[#d4af37] transition-colors">{tx("nav-contact")}</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">{language === "TR" ? "Yasal" : "Legal"}</h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><button onClick={() => { setActiveDetail({ type: "legal", id: "privacy" }); window.scrollTo(0,0); }} className="hover:text-white transition-colors">{tx("footer-privacy")}</button></li>
                <li><button onClick={() => { setActiveDetail({ type: "legal", id: "terms" }); window.scrollTo(0,0); }} className="hover:text-white transition-colors">{tx("footer-terms")}</button></li>
                <li><button onClick={() => { setActiveDetail({ type: "legal", id: "kvkk" }); window.scrollTo(0,0); }} className="hover:text-white transition-colors">{tx("footer-kvkk")}</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-medium">
            <p>{tx("footer-copy")}</p>
            <div className="flex gap-6">
              <button onClick={() => { setActiveDetail({ type: "legal", id: "privacy" }); window.scrollTo(0,0); }} className="hover:underline">{tx("footer-privacy")}</button>
              <button onClick={() => { setActiveDetail({ type: "legal", id: "terms" }); window.scrollTo(0,0); }} className="hover:underline">{tx("footer-terms")}</button>
              <button onClick={() => { setActiveDetail({ type: "legal", id: "kvkk" }); window.scrollTo(0,0); }} className="hover:underline">KVKK</button>
            </div>
          </div>
        </div>
      </footer>



    </div>
  );
}
