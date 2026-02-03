import { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Loader } from "../components/Loader";

export function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { lang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      title: "Sign in to DiagnoVET",
      email: "Email address",
      password: "Password",
      forgot: "Forgot your password?",
      create: "Create account",
      signIn: "Sign in",
      invalid: "Please enter a valid email address.",
      short: "Password must be at least 6 characters.",
    },
    es: {
      title: "Iniciar sesión en DiagnoVET",
      email: "Correo electrónico",
      password: "Contraseña",
      forgot: "¿Olvidaste tu contraseña?",
      create: "Crear cuenta",
      signIn: "Iniciar sesión",
      invalid: "Por favor ingresa un correo válido.",
      short: "La contraseña debe tener al menos 6 caracteres.",
    },
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError(t.invalid);
      return;
    }
    if (password.length < 6) {
      setError(t.short);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
      <LanguageSwitcher />
      <h1 className="text-3xl font-bold text-blue-700 mb-8">DiagnoVET</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-80 border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          {t.title}
        </h2>

        <label className="block text-sm font-medium text-gray-600 mb-1">
          {t.email}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <label className="block text-sm font-medium text-gray-600 mb-1">
          {t.password}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-2 rounded-md mb-3">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? <Loader /> : t.signIn}
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">
          <a href="#" className="hover:text-blue-600">
            {t.forgot}
          </a>
          {" · "}
          <a href="#" className="hover:text-blue-600">
            {t.create}
          </a>
        </div>
      </form>
    </div>
  );
}
