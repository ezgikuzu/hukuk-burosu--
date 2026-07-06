import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, addClient } from "../../store";
import { INITIAL_LAWYERS, INITIAL_CLIENTS, DICTIONARY, autoTranslate } from "../../data/initialData";
import { Scale, Lock, Mail, ShieldAlert, CheckCircle, ChevronRight, Users, UserCheck, ShieldCheck } from "lucide-react";
import LanguageSelector from "../common/LanguageSelector";

export default function Login({ onBackToLanding }) {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);
  const t = DICTIONARY[language];

  const [activeTab, setActiveTab] = useState("admin");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState(null);

  const at = (text) => autoTranslate(text, language);

  const handleQuickLawyerLogin = (lawyerEmail) => {
    const lawyer = INITIAL_LAWYERS.find((l) => l.email === lawyerEmail);
    if (lawyer) {
      dispatch(
        login({
          id: lawyer.id,
          name: lawyer.name,
          email: lawyer.email,
          role: "lawyer",
          phone: lawyer.phone,
        })
      );
    }
  };

  const handleQuickClientLogin = (clientId) => {
    const client = INITIAL_CLIENTS.find((c) => c.id === clientId);
    if (client) {
      dispatch(
        login({
          id: client.id,
          name: client.name,
          email: client.email,
          role: "client",
          phone: client.phone,
          address: client.address,
          nationalId: client.nationalId,
          lawyerId: client.lawyerId,
        })
      );
    }
  };

  const handleQuickAdminLogin = () => {
    dispatch(
      login({
        id: "admin_1",
        name: "Genel Yönetici",
        email: "admin@edbm.com",
        role: "admin",
        phone: "+90 212 999 8877",
      })
    );
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (activeTab === "admin") {
      if (email.toLowerCase() === "admin@edbm.com" && (password === "admin" || password === "admin123")) {
        dispatch(
          login({
            id: "admin_1",
            name: "Genel Yönetici",
            email: "admin@edbm.com",
            role: "admin",
            phone: "+90 212 999 8877",
          })
        );
      } else {
        setError(language === "TR" ? "Hatalı yönetici şifresi veya e-postası." : "Invalid admin email or password.");
      }
    } else if (activeTab === "lawyer") {
      const lawyer = INITIAL_LAWYERS.find(
        (l) => l.email.toLowerCase() === email.toLowerCase()
      );
      const isCorrectPassword =
        (lawyer?.id === "lawyer_1" && password === "beyza123") ||
        (lawyer?.id === "lawyer_2" && password === "ezgi123") ||
        (lawyer?.id === "lawyer_3" && password === "gorkem123") ||
        (lawyer?.id === "lawyer_4" && password === "dilek123") ||
        password === "123456" ||
        password === "admin";

      if (lawyer && isCorrectPassword) {
        dispatch(
          login({
            id: lawyer.id,
            name: lawyer.name,
            email: lawyer.email,
            role: "lawyer",
            phone: lawyer.phone,
          })
        );
      } else {
        setError(t.invalidCredentials);
      }
    } else {
      const clientsList = JSON.parse(localStorage.getItem("edbm_clients") || "[]");
      const combinedClients = clientsList.length > 0 ? clientsList : INITIAL_CLIENTS;

      const client = combinedClients.find(
        (c) => c.nationalId === nationalId
      );

      const isCorrectPassword = client && (password === client.password || password === "123456" || password === "client123");

      if (client && isCorrectPassword) {
        dispatch(
          login({
            id: client.id,
            name: client.name,
            email: client.email,
            role: "client",
            phone: client.phone,
            address: client.address,
            nationalId: client.nationalId,
            lawyerId: client.lawyerId,
          })
        );
      } else {
        setError(t.invalidClientCredentials);
      }
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!signupName || !signupEmail || !nationalId || !password) {
      setError(language === "TR" ? "Lütfen tüm zorunlu alanları doldurun." : "Please fill in all required fields.");
      return;
    }
    const clientsList = JSON.parse(localStorage.getItem("edbm_clients") || "[]");
    const combinedClients = clientsList.length > 0 ? clientsList : INITIAL_CLIENTS;

    if (combinedClients.find((c) => c.nationalId === nationalId)) {
      setError(language === "TR" ? "Bu T.C. numarası ile kayıtlı bir müvekkil zaten var." : "A client with this National ID already exists.");
      return;
    }

    const newClient = {
      id: `client_new_${Date.now()}`,
      name: signupName,
      email: signupEmail,
      phone: signupPhone || "+90 555 000 0000",
      address: "Türkiye",
      nationalId: nationalId,
      password: password,
      lawyerId: null,
    };

    dispatch(addClient(newClient));
    dispatch(login({ ...newClient, role: "client" }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 relative overflow-hidden font-sans">
      
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1a237e]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a237e] to-[#283593] flex items-center justify-center border border-[#d4af37]/30 shadow-md">
            <Scale className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-[#1a237e] tracking-tight">
              EDBM HUKUK
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold -mt-1">
              {at("BÜROSU")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-[#1a237e] hover:bg-slate-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-transparent hover:border-slate-200"
            >
              ← {at("Ana Sayfaya Dön")}
            </button>
          )}
          <LanguageSelector />
        </div>
      </header>

      
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 min-h-[580px]">
          
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1a237e] to-[#0a1045] p-8 lg:p-12 flex flex-col justify-between text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-12 -translate-y-12" />

            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
                EST. 2026
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
                {language === "TR" ? (
                  <>
                    Adalet, Bilgi <br />
                    ve Güvenle <br />
                    <span className="text-[#d4af37]">Yönetim</span>
                  </>
                ) : (
                  <>
                    Management <br />
                    with Justice, <br />
                    <span className="text-[#d4af37]">Trust & Honor</span>
                  </>
                )}
              </h2>
              <div className="w-12 h-1 bg-[#d4af37] rounded" />
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                {t.tagline}
              </p>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-3.5 text-xs text-slate-300 font-semibold">
                <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{at("Modern Dava ve Müvekkil Cari Takibi")}</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-slate-300 font-semibold">
                <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{at("Tüm Adliyeler ve Kurumlar ile Entegre Ajanda")}</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs text-slate-300 font-semibold">
                <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{at("Güvenli Çift Yönlü Evrak ve Mesajlaşma")}</span>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">EDBM LEGAL v2.6</span>
              <span className="text-[10px] text-slate-400 font-mono">SECURE INTERFACE</span>
            </div>
          </div>

          
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-slate-800">
                {t.loginTitle}
              </h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                {t.loginSubtitle}
              </p>
            </div>

            
            <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-lg mb-6 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("lawyer");
                  setIsSignUpMode(false);
                  setError(null);
                }}
                className={`py-2 px-1 rounded-md text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "lawyer"
                    ? "bg-[#1a237e] text-[#d4af37] shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t.roleLawyer}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("client");
                  setIsSignUpMode(false);
                  setError(null);
                }}
                className={`py-2 px-1 rounded-md text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "client"
                    ? "bg-[#1a237e] text-[#d4af37] shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{t.roleClient}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("admin");
                  setIsSignUpMode(false);
                  setError(null);
                }}
                className={`py-2 px-1 rounded-md text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "admin"
                    ? "bg-[#1a237e] text-[#d4af37] shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{at("Yönetici Girişi")}</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={activeTab === "client" && isSignUpMode ? handleSignUpSubmit : handleLoginSubmit} className="space-y-4">
              {activeTab === "lawyer" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="avukat@edbm.com"
                      className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-colors"
                    />
                  </div>
                </div>
              ) : activeTab === "admin" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.emailLabel} (Admin)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@edbm.com"
                      className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {isSignUpMode && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === "TR" ? "Ad Soyad" : "Full Name"}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.emailLabel}
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {language === "TR" ? "Telefon" : "Phone"}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.nationalIdLabel}
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        maxLength={11}
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        placeholder="12345678901"
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#1a237e] hover:bg-[#12185c] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md border-b-2 border-indigo-950 cursor-pointer"
              >
                <span>{activeTab === "client" && isSignUpMode ? (language === "TR" ? "Kayıt Ol" : "Sign Up") : t.signIn}</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37]" />
              </button>

              {activeTab === "client" && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setIsSignUpMode(!isSignUpMode)}
                    className="text-xs text-[#1a237e] font-bold hover:underline cursor-pointer"
                  >
                    {isSignUpMode
                      ? (language === "TR" ? "Zaten hesabınız var mı? Giriş Yapın" : "Already have an account? Sign In")
                      : (language === "TR" ? "Hesabınız yok mu? Kayıt Olun" : "Don't have an account? Sign Up")}
                  </button>
                </div>
              )}
            </form>

            
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                {at("Hızlı Demo Giriş Paneli")}
              </span>

              {activeTab === "lawyer" ? (
                <div className="grid grid-cols-2 gap-2">
                  {INITIAL_LAWYERS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleQuickLawyerLogin(l.email)}
                      className="p-2 border border-slate-200 rounded-lg hover:border-[#1a237e]/40 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{l.name}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{l.email.split("@")[0]}</p>
                      <p className="text-[9px] text-[#d4af37] font-bold">{l.id === "lawyer_1" ? "beyza123" : l.id === "lawyer_2" ? "ezgi123" : l.id === "lawyer_3" ? "gorkem123" : "dilek123"}</p>
                    </button>
                  ))}
                </div>
              ) : activeTab === "admin" ? (
                <div className="grid grid-cols-1">
                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    className="p-3 border border-[#d4af37]/30 bg-amber-50/20 rounded-lg hover:border-[#1a237e]/40 hover:bg-slate-50 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#1a237e]">{at("Genel Yönetici")}</p>
                      <p className="text-[10px] text-slate-500">admin@edbm.com</p>
                    </div>
                    <span className="text-xs font-bold bg-[#1a237e] text-[#d4af37] px-2.5 py-1 rounded">
                      admin
                    </span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {INITIAL_CLIENTS.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleQuickClientLogin(c.id)}
                      className="p-2 border border-slate-200 rounded-lg hover:border-[#1a237e]/40 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{c.name}</p>
                      <p className="text-[10px] text-slate-500">T.C: {c.nationalId}</p>
                      <p className="text-[9px] text-[#d4af37] font-bold">{c.password}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      
      <footer className="w-full text-center py-6 text-xs text-slate-400 border-t border-slate-100 bg-white">
        <p>© 2026 EDBM Hukuk Bürosu. Tüm Hakları Saklıdır. | Justice & Reliability</p>
      </footer>
    </div>
  );
}
