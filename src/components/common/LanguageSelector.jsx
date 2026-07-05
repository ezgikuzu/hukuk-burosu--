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
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-black hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all duration-300 font-sans text-xs font-semibold uppercase tracking-wider"
    >
      <Globe className="w-4 h-4 text-[#d4af37]" />
      <span>{language === "TR" ? "English" : "Türkçe"}</span>
    </button>
  );
}
