import { useLanguage } from "../hooks/useLanguage";

export function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-6 right-6 text-sm text-gray-600 hover:text-blue-600 transition"
    >
      {lang === "en" ? "English" : "Español"}
    </button>
  );
}
