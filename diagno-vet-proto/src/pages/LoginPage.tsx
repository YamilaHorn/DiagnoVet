import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { Loader } from "../components/Loader";
import { useLanguage } from "../context/LanguageContext"; // 1. Importamos el hook
import { loginTranslations } from "../utils/translations/login"; // 2. Importamos los textos

type Props = {
  onExistingUser: (email: string) => void;
  onNewUser: (email: string) => void;
};

export function LoginPage({ onExistingUser, onNewUser }: Props) {
  // 3. "Pescamos" el idioma actual (es o en)
  const { lang } = useLanguage();
  const t = loginTranslations[lang]; // Atajo para no escribir tanto

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const currentEmail = email.toLowerCase().trim();
      
      // Buscamos si existe un perfil para este email específico
      const savedProfileStr = localStorage.getItem(`userProfile_${currentEmail}`);

      if (savedProfileStr) {
        onExistingUser(currentEmail);
      } else {
        onNewUser(currentEmail);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      {/* El AppHeader ya tiene el Switcher adentro, así que esto funciona solo */}
      <AppHeader />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[440px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 md:p-14">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="DiagnoVetAI"
                className="h-14 w-auto object-contain"
              />
            </div>

            <p className="text-slate-500 leading-relaxed italic">
              {t.title} {/* 4. Usamos la traducción */}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                {t.email_label} {/* 4. Usamos la traducción */}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email_placeholder} // 4. Usamos la traducción
                className={`w-full mt-2 px-6 py-4 rounded-2xl outline-none transition-all ${
                  email && !isValidEmail
                    ? "border-red-200 bg-red-50 text-red-900"
                    : "bg-[#F6F8F9] border-[#DCE3E6] text-[#5F6B73] focus:bg-white focus:border-[#2FB8B3] focus:ring-4 focus:ring-[#2FB8B3]/10"
                }`}
              />
              {email && !isValidEmail && (
                <p className="mt-2 text-xs font-bold text-red-500 ml-1">
                  {t.email_error} {/* 4. Usamos la traducción */}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValidEmail || loading}
              className="w-full h-16 flex items-center justify-center rounded-2xl bg-[#2FB8B3] text-white font-black text-lg hover:bg-[#25918d] transition-all shadow-xl shadow-[#2FB8B3]/20 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader />
                  <span className="animate-pulse">{t.btn_verifying}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {t.btn_continue} {/* 4. Usamos la traducción */}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              )}
            </button>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {t.footer_new_account} <br />
              <span className="text-slate-500">
                {t.footer_info}
              </span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}