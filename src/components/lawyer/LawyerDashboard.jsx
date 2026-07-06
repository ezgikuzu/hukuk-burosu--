import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, setActiveTab } from "../../store";
import { DICTIONARY, autoTranslate } from "../../data/initialData";
import {
  Scale, LogOut, LayoutDashboard, Users, FolderOpen, Calendar,
  FileText, Landmark, MessageCircle, Menu, X, Edit3, Mail, FileSignature
} from "lucide-react";
import LanguageSelector from "../common/LanguageSelector";

// Sekmeleri içe aktar (Import tabs)
import OverviewTab from "../admin/OverviewTab";
import ClientsTab from "../admin/ClientsTab";
import CasesTab from "./CasesTab";
import CalendarTab from "./CalendarTab";
import DocumentsTab from "../admin/DocumentsTab";
import FinancesTab from "../admin/FinancesTab";
import MessagesTab from "./MessagesTab";
import WebMessagesTab from "./WebMessagesTab";
import BlogsTab from "../landing/BlogsTab";
import DocumentGenerator from "../documents/DocumentGenerator";

export default function LawyerDashboard() {
  const dispatch = useDispatch(); // store'a müdahale etmek için kullanılır. 
  const language = useSelector((state) => state.ui.language); // seçilen dili tutar. 
  const currentUser = useSelector((state) => state.auth.currentUser); // giriş yapan kullanıcıyı tutar. 
  const activeTab = useSelector((state) => state.ui.activeTab); // şu an hangi sekmedeyiz onu tutar. 
  const t = DICTIONARY[language]; // seçilen dile ait metinleri çevirir. 
  const at = (text) => autoTranslate(text, language); // yazıları otomatik çevirir. 

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false); // mobil menünün açık olup olmadığını tutar. 

  React.useEffect(() => { // her sayfaya giriş yapıldığında sayfanın en üstüne kaydırır. 
    window.scrollTo(0, 0); // sayfa en üstü 
  }, [activeTab]); // aktif sekmeye göre çalışır.  

  // kullanıcı sekme değiştirdiğinde sayfanın en üstüne çık. 

  const menuItems = [ // sol taraftaki menü 
    { id: "overview", label: t.tabOverview, icon: LayoutDashboard }, // ana sayfa 
    { id: "clients", label: t.tabClients, icon: Users }, // müvekkiller 
    { id: "cases", label: t.tabCases, icon: FolderOpen }, // davalar 
    { id: "calendar", label: t.tabCalendar, icon: Calendar }, // takvim 
    { id: "documents", label: t.tabDocuments, icon: FileText }, // dökümanlar 
    { id: "finances", label: t.tabFinances, icon: Landmark }, // finans
    { id: "document-generator", label: at("Evrak Oluştur"), icon: FileSignature }, // evrak oluşturma 
    { id: "messages", label: t.tabMessages, icon: MessageCircle }, // mesajlar 
    { id: "web_messages", label: language === "TR" ? "Web Mesajları" : "Web Messages", icon: Mail }, // web mesajları 
    { id: "blogs", label: language === "TR" ? "Blog Yönetimi" : "Blog Management", icon: Edit3 }, // blog yönetimi 
  ];

  const renderActiveTab = () => { // hangi sekmeye tıklandıysa o sekmeyi render eder.
    switch (activeTab) { // sekmeleri kontrol eder. 
      case "overview": // ana sayfa 
        return <OverviewTab />;
      case "clients": // müvekkiller 
        return <ClientsTab />;
      case "cases": // davalar
        return <CasesTab />;
      case "calendar": // takvim
        return <CalendarTab />;
      case "documents": // dökümanlar
        return <DocumentsTab />;
      case "finances": // finans
        return <FinancesTab />;
      case "document-generator": // evrak oluşturma 
        return <DocumentGenerator />;
      case "messages": // mesajlar
        return <MessagesTab />;
      case "web_messages": // web mesajları 
        return <WebMessagesTab />;
      case "blogs": // blog yönetimi 
        return <BlogsTab />;
      default: // ana sayfa 
        return <OverviewTab />;
    }
  };

  const handleTabClick = (tabId) => { // kullanıcı menüde bir sekmeye tıkladığında çalışan fonskiyondur. 
    dispatch(setActiveTab(tabId)); // tıklanan sekmeyi reduxtaki activetaba kaydeder. böylece uygulama hangi sayfanın açılacağını bilir.  
    setMobileMenuOpen(false); //eğer uygulama mobilde açıksa, sekme seçildikten sonra yan menüyü kapatır ve kullanıcı seçtiği sayfayı görür. 
  };

  const handleLogout = () => { // çıkış yap butonu tıklandığında çalışır. 
    dispatch(logout()); // çıkış yap 
    setMobileMenuOpen(false); // mobil menüyü kapatır.  ve giriş ekranına yönlendirir. 
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">

      {/* 1. SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1a237e] text-white border-r border-[#d4af37]/20 shrink-0 sticky top-0 h-screen justify-between z-20">
        <div className="space-y-6 pt-6 flex-1 flex flex-col">
          {/* Logo Brand */}
          <div className="px-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-[#d4af37]/30">
              <Scale className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h1 className="font-serif text-base font-bold tracking-tight">EDBM HUKUK</h1>
              <p className="text-[9px] uppercase tracking-widest text-[#d4af37] font-semibold -mt-1">
                {at("BÜROSU")}
              </p>
            </div>
          </div>

          {/* Active Lawyer Mini profile */}
          <div className="px-4 py-3 mx-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold border border-[#d4af37]/30 text-sm">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate text-slate-100">{currentUser?.name}</p>
              <span className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-wider block">
                {language === "TR" ? "Avukat" : "Attorney"}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${isActive
                    ? "bg-[#d4af37] text-[#1a237e] shadow-md border-b border-[#bfa032]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#1a237e]" : "text-slate-300"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0a1045] space-y-2">
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-300 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP-BAR */}
      <header className="lg:hidden w-full bg-[#1a237e] text-white px-5 py-4 flex justify-between items-center z-30 sticky top-0 border-b border-[#d4af37]/20 shadow-md">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-[#d4af37]" />
          <div>
            <span className="font-serif font-bold text-sm tracking-tight">EDBM HUKUK</span>
            <p className="text-[8px] tracking-widest text-[#d4af37] font-semibold -mt-1 uppercase">{at("BÜROSU")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-white hover:bg-white/10 rounded cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE PANEL NAVIGATION MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-[#1a237e] z-30 flex flex-col justify-between border-t border-white/5">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${isActive
                    ? "bg-[#d4af37] text-[#1a237e]"
                    : "text-slate-300 hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/10 bg-[#0a1045] space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0)}
              </div>
              <p className="text-sm font-medium">{currentUser?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Desktop Top Nav Bar */}
        <div className="hidden lg:flex h-16 bg-white border-b border-slate-100 justify-between items-center px-8 z-10 sticky top-0 shadow-sm">
          <h2 className="font-serif text-base font-bold text-[#1a237e]">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">
              SECURE WORKSPACE
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Panel Canvas */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </div>

        {/* Sticky footer */}
        <footer className="py-4 px-8 text-center text-[10px] text-slate-400 font-medium border-t border-slate-100 bg-white">
          EDBM Hukuk Bürosu • Kurumsal Otomasyon Çözümü • Tüm veriler LocalStorage ve Redux ile yerel olarak senkronize edilmektedir.
        </footer>
      </main>
    </div>
  );
}
