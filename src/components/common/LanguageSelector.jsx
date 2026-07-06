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
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#1a237e] to-[#283593] hover:from-[#12185c] hover:to-[#1a237e] text-white shadow-lg border border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all duration-300 font-sans text-xs font-bold uppercase tracking-wider"
    >
      <Globe className="w-4 h-4 text-[#d4af37] animate-pulse" />
      <span>{language === "TR" ? "English" : "Türkçe"}</span>
    </button>
  );
}
