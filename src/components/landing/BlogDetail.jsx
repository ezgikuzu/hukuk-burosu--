import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, Gavel, Calendar, User, Clock } from "lucide-react";
import { toggleLanguage } from "../../store";

export default function BlogDetail({ blogId, onBack, onContactClick }) {
  const language = useSelector((state) => state.ui.language) || "TR";
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const blogPosts = useSelector((state) => state.blogs.list);

  const post = blogPosts.find((p) => p.id === blogId);

  if (!post) return null;

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
      <section className="relative h-[40vh] sm:h-[50vh] flex items-end pb-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-12 w-full text-white">
          <div className="flex flex-wrap gap-4 items-center mb-4 text-[11px] font-bold uppercase tracking-wider text-[#d4af37]">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg leading-tight">
            {tx(post.titleTR, post.titleEN)}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          
          <div className="flex items-center justify-between pb-8 border-b border-slate-100 mb-8">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100">
                  <img src={post.authorImg} alt={post.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="font-bold text-[#1a237e]">{post.author}</div>
                  <div className="text-xs text-slate-500 font-medium">EDBM Legal Author</div>
                </div>
             </div>
             
             <button 
                  onClick={onContactClick}
                  className="hidden sm:block border border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e] hover:text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all"
                >
                  {tx("Danışmanlık Alın", "Get Consultation")}
             </button>
          </div>

          <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
            {tx(post.contentTR, post.contentEN).split('\n').map((paragraph, idx) => (
              paragraph.trim() !== '' ? (
                <p key={idx} className={paragraph.split(' ').length < 8 && !paragraph.endsWith('.') ? "font-serif font-bold text-[#1a237e] text-2xl mt-12 mb-4" : "mb-6"}>
                  {paragraph}
                </p>
              ) : null
            ))}
          </div>

          <div className="mt-16 sm:hidden">
             <button 
                  onClick={onContactClick}
                  className="w-full bg-[#1a237e] text-white font-bold text-sm uppercase tracking-wider px-6 py-4 rounded-xl shadow-lg transition-all"
                >
                  {tx("Danışmanlık Alın", "Get Consultation")}
             </button>
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
          <div className="text-xs text-slate-500 font-medium pt-6 border-t border-slate-800/80 w-full max-w-sm">
             © 2026 EDBM {tx("Hukuk Bürosu", "Law Firm")}. {tx("Tüm Hakları Saklıdır", "All Rights Reserved")}.
          </div>
        </div>
      </footer>
    </div>
  );
}
