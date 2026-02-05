import { useState, useRef } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

type AppHeaderProps = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  logoLink?: string;
  // Cambiamos esto: agregamos email y hacemos que los campos sean opcionales con ?
  userProfile?: {
    fullName?: string;
    title?: string;
    email?: string;
  };
  onLogout?: () => void;
  showLanguageSelector?: boolean;
};

export function AppHeader({
  title,
  onBack,
  right,
  userProfile,
  onLogout,
  showLanguageSelector = true,
}: AppHeaderProps) {
  const { lang } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const text = {
    back: lang === "es" ? "Volver" : "Back",
    settings: lang === "es" ? "Ajustes de Cuenta" : "Account Settings",
    signature:
      lang === "es" ? "Cargar Firma Digital" : "Upload Digital Signature",
    logout: lang === "es" ? "Cerrar Sesión" : "Sign Out",
    signatureSuccess:
      lang === "es"
        ? "✅ Firma digital cargada correctamente."
        : "✅ Digital signature uploaded successfully.",
    defaultTitle: lang === "es" ? "Médico Veterinario" : "Veterinary Doctor",
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        localStorage.setItem("doctorSignature", event.target?.result as string);
        alert(text.signatureSuccess);
        setIsMenuOpen(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 relative z-[100]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            {onBack && (
              <button
                onClick={onBack}
                className="text-sm text-gray-500 hover:text-gray-900 transition flex items-center gap-1 font-medium"
              >
                ← {text.back}
              </button>
            )}
          </div>

          <div className="flex-1 text-center hidden lg:block">
            <h1 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {right}
            {showLanguageSelector && <LanguageSwitcher />}

            {userProfile && (
              <div className="relative border-l border-slate-100 pl-4 ml-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 group focus:outline-none"
                >
                  <div className="text-right hidden sm:block leading-tight">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
                      {userProfile.fullName || "---"}
                    </p>
                    <p className="text-[9px] font-bold text-[#2FB8B3] uppercase tracking-tighter">
                      {userProfile.title || text.defaultTitle}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:bg-[#2FB8B3] transition-all transform group-active:scale-95">
                    {userProfile.fullName?.charAt(0).toUpperCase() || "V"}
                  </div>
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {text.settings}
                        </p>
                        {/* Opcional: Mostrar el email en el menú si quieres */}
                        {userProfile.email && (
                          <p className="text-[9px] text-slate-400 truncate">
                            {userProfile.email}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full text-left px-4 py-3 text-[11px] font-black text-slate-600 hover:bg-slate-50 hover:text-[#2FB8B3] flex items-center gap-2 uppercase transition-all"
                      >
                        ✒️ {text.signature}
                      </button>

                      <div className="h-[1px] bg-slate-50 my-1"></div>

                      <button
                        onClick={() => {
                          onLogout?.();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 flex items-center gap-2 uppercase transition-all"
                      >
                        🚪 {text.logout}
                      </button>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleSignatureUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
