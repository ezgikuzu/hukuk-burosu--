import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLanguage } from "../../store";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.ui.language);

  return (
    <button
      id="language-selector-btn"
      onClick={() => dispatch(toggleLanguage())}
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#1a237e]/10 hover:bg-[#1a237e]/20 hover:border-[#d4af37] text-slate-800 transition-all duration-300 font-sans text-xs font-semibold uppercase tracking-wider"
    >
      <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
      <span>{language === "TR" ? "English" : "Türkçe"}</span>
    </button>
  );
}
