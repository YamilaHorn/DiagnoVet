import { useState, useEffect } from "react";

export function useLanguage() {
  const [lang, setLang] = useState<"en" | "es">(
    (localStorage.getItem("lang") as "en" | "es") || "en",
  );

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "es" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return { lang, toggleLanguage };
}
