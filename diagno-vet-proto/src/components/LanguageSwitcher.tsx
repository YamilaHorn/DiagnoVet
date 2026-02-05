import { useState } from "react";
import { useLanguage } from "../context/LanguageContext"; // Asegurate que la ruta sea correcta

export function LanguageSwitcher() {
  // Sacamos 'setLang' que es lo que tenés en tu LanguageContext
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-bold"
      >
        🌐 {lang.toUpperCase()}
        <span className="text-[10px]">▼</span>
      </button>

      {open && (
        <>
          {/* Capa invisible para cerrar el menú al hacer clic fuera */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
          
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
            <button
              onClick={() => {
                setLang("en"); // Usamos setLang directamente
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${
                lang === "en" ? "font-black text-[#2FB8B3]" : "text-slate-600"
              }`}
            >
              English
            </button>

            <button
              onClick={() => {
                setLang("es"); // Usamos setLang directamente
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${
                lang === "es" ? "font-black text-[#2FB8B3]" : "text-slate-600"
              }`}
            >
              Español
            </button>
          </div>
        </>
      )}
    </div>
  );
}