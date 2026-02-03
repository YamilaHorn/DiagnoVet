import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    // Simulación de login
    setTimeout(() => {
      setLoading(false);
      alert("Login successful (demo)");
    }, 1500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-sm mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Sign in to DiagnoVET
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-2 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 mt-2 rounded-md text-white font-medium transition-colors ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="text-center mt-4 text-sm text-gray-500">
        <a href="#" className="hover:text-blue-600">
          Forgot your password?
        </a>{" "}
        ·{" "}
        <a href="#" className="hover:text-blue-600">
          Create account
        </a>
      </div>
    </form>
  );
}
