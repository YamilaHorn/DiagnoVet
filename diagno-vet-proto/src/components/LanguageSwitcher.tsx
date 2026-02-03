import { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";

export function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
      >
        🌐 {lang.toUpperCase()}
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              if (lang !== "en") toggleLanguage();
              setOpen(false);
            }}
            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
              lang === "en" ? "font-semibold" : ""
            }`}
          >
            English
          </button>

          <button
            onClick={() => {
              if (lang !== "es") toggleLanguage();
              setOpen(false);
            }}
            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
              lang === "es" ? "font-semibold" : ""
            }`}
          >
            Español
          </button>
        </div>
      )}
    </div>
  );
}
