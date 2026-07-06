import React from "react";
import { useSelector } from "react-redux";
import { Sparkles, Shield, Scale, MapPin, Users, Target, Clock, Award } from "lucide-react";

export default function AboutUs() {
  const language = useSelector((state) => state.ui.language) || "TR";

  const content = {
    TR: {
      title: "Hakkımızda",
      subtitle: "25 Yıllık Tecrübe ve Hukuki Titizlik",
      storyTitle: "Hikayemiz",
      storyP1: "EDBM Hukuk Bürosu, 1998 yılında İstanbul Levent'te kurulmuştur. Kurucularımızın adalete ve hukukun üstünlüğüne olan inancı, küçük bir ofiste başlayan bu serüveni bugün Türkiye'nin en saygın hukuk bürolarından biri haline getirmiştir.",
      storyP2: "Geleneksel hukuk disiplinini, modern dünyanın dinamikleriyle birleştiren Corporate Modernism anlayışımızla, müvekkillerimize şeffaf, hızlı ve çözüm odaklı hizmet sunuyoruz.",
      visionTitle: "Vizyonumuz",
      visionDesc: "Ulusal ve uluslararası arenada hukukun üstünlüğünü savunarak, müvekkillerimizin haklarını en yenilikçi stratejilerle koruyan lider bir hukuk bürosu olmak.",
      missionTitle: "Misyonumuz",
      missionDesc: "Karmaşık hukuki ihtilaflarda dahi anlaşılabilir, dürüst ve etkin çözümler üreterek adaletin tecellisine ve toplumun hukuka olan güvenine katkı sağlamak.",
      stats: [
        { value: "25+", label: "Yıllık Tecrübe", icon: Clock },
        { value: "10K+", label: "Başarılı Dava", label: "Çözülen Uyuşmazlık", icon: Award },
        { value: "50+", label: "Uzman Avukat", icon: Users },
        { value: "%98", label: "Müvekkil Memnuniyeti", icon: Target }
      ],
      values: [
        { title: "Şeffaflık", desc: "Müvekkillerimizi sürecin her aşamasında bilgilendiririz.", icon: Shield },
        { title: "Adalet", desc: "Hukukun üstünlüğünden ve dürüstlükten taviz vermeyiz.", icon: Scale },
        { title: "Erişilebilirlik", desc: "Modern ofislerimiz ve dijital altyapımızla daima yanınızdayız.", icon: MapPin }
      ]
    },
    EN: {
      title: "About Us",
      subtitle: "25 Years of Experience and Legal Diligence",
      storyTitle: "Our Story",
      storyP1: "EDBM Law Firm was established in Levent, Istanbul in 1998. Our founders' belief in justice and the rule of law has transformed this journey, which started in a small office, into one of Turkey's most respected law firms today.",
      storyP2: "With our Corporate Modernism approach that combines traditional legal discipline with the dynamics of the modern world, we offer transparent, fast, and solution-oriented services to our clients.",
      visionTitle: "Our Vision",
      visionDesc: "To be a leading law firm that defends the rule of law in the national and international arena and protects the rights of our clients with the most innovative strategies.",
      missionTitle: "Our Mission",
      missionDesc: "To contribute to the manifestation of justice and society's trust in law by producing understandable, honest, and effective solutions even in complex legal disputes.",
      stats: [
        { value: "25+", label: "Years of Experience", icon: Clock },
        { value: "10K+", label: "Resolved Disputes", icon: Award },
        { value: "50+", label: "Expert Lawyers", icon: Users },
        { value: "98%", label: "Client Satisfaction", icon: Target }
      ],
      values: [
        { title: "Transparency", desc: "We inform our clients at every stage of the process.", icon: Shield },
        { title: "Justice", desc: "We never compromise on the rule of law and honesty.", icon: Scale },
        { title: "Accessibility", desc: "We are always by your side with our modern offices and digital infrastructure.", icon: MapPin }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pt-28 pb-20">
      
      
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center space-y-6 mb-20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EDBM LEGAL</span>
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-[#1a237e] tracking-tight">
          {t.title}
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
          {t.subtitle}
        </p>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="relative">
          <div className="absolute inset-0 bg-[#d4af37] transform rotate-3 rounded-2xl opacity-20 -z-10"></div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeFXkKO8n1_PBgj226tQkE7DF_0QuYkQVWaOpUVYIUWUvW4q_XufC6Msuc7l92VUY1C1dlSyK3IS53mDsCibPVLTVvwoeC9hJPRl0UoRo5bQlBFVIdPc-6_0RfXAAPf8mF51j8hrTgpFDEuhna0gkq5R3ZmNIJUjfk-ALKbz9oZ_NIgPAodff_3fu4PKSRo7xhD-DCtFuiceVaGGlX8ZhOmsAR_0wn7dEyUVkeLlYbaFMHSdd3fH6glezYwS6si-iIzdLDakX7A5k" 
            alt="Law Office" 
            className="rounded-2xl shadow-2xl object-cover h-[400px] w-full"
          />
        </div>
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-[#1a237e] border-b border-[#d4af37]/30 pb-4 inline-block">
            {t.storyTitle}
          </h2>
          <p className="text-slate-600 leading-relaxed text-base md:text-lg">
            {t.storyP1}
          </p>
          <p className="text-slate-600 leading-relaxed text-base md:text-lg">
            {t.storyP2}
          </p>
        </div>
      </div>

      
      <div className="bg-[#1a237e] py-16 mb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {t.stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center space-y-3 p-6 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-[#d4af37]" />
                </div>
                <h4 className="text-4xl font-black text-white font-serif">{stat.value}</h4>
                <p className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-xl hover:-translate-y-1 transition-transform">
          <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
            <Target className="w-7 h-7 text-[#1a237e]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1a237e] mb-4">{t.visionTitle}</h3>
          <p className="text-slate-600 leading-relaxed">{t.visionDesc}</p>
        </div>
        <div className="bg-[#1a237e] text-white p-10 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
          <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <Shield className="w-7 h-7 text-[#d4af37]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white mb-4">{t.missionTitle}</h3>
          <p className="text-indigo-100 leading-relaxed">{t.missionDesc}</p>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#1a237e] mb-12">
          {language === "TR" ? "Temel Değerlerimiz" : "Our Core Values"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-xl border border-slate-100 shadow-md flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 text-[#d4af37]">
                  <Icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-slate-800 mb-3">{val.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
