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

  const isValidEmail = email.includes("@");

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
    <>
      <AppHeader />

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-100 shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              DiagnoVetAI
            </h1>
            <p className="text-sm text-gray-500">
              Enter your email to sign in or create a new account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@clinic.com"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isValidEmail || loading}
              className="w-full h-11 flex items-center justify-center rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? (
                <>
                  <Loader />
                  <span className="ml-2">Checking account…</span>
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Enter your email — we’ll check if you already have an account
          </p>
        </div>
      </div>
    </>
  );
}
