import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { Loader } from "../components/Loader";

type Props = {
  onExistingUser: () => void;
  onNewUser: () => void;
};

export function LoginPage({ onExistingUser, onNewUser }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email.toLowerCase().includes("new")) {
        onNewUser();
      } else {
        onExistingUser();
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <AppHeader />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[440px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 md:p-14">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-3xl mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
              DiagnoVet<span className="text-blue-600">AI</span>
            </h1>
            <p className="text-slate-500 leading-relaxed">
              Ingresa tu email para acceder a la plataforma de diagnóstico.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@clinic.com"
                className={`w-full mt-2 px-6 py-4 bg-slate-50 border rounded-2xl outline-none transition-all ${
                  email && !isValidEmail
                    ? "border-red-200 bg-red-50 text-red-900"
                    : "border-slate-100 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 text-slate-700"
                }`}
              />
              {email && !isValidEmail && (
                <p className="mt-2 text-xs font-bold text-red-500 ml-1">
                  Por favor ingresa un email válido
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-bold px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isValidEmail || loading}
              className="w-full h-16 flex items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader />
                  <span className="animate-pulse">Verificando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Continuar
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-xs text-slate-400 font-medium">
              ¿No tienes cuenta? <br />
              <span className="text-slate-500">Ingresa tu email y te ayudaremos a crear una.</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}