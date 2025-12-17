"use client";

import { useState } from "react";

export default function WaitlistForm({ 
  variant = "dark" 
}: { 
  variant?: "dark" | "light" 
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("¡Listo! Revisa tu email para confirmar.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Algo salió mal. Intenta de nuevo.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <div>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className={`flex-1 px-6 py-4 rounded-lg text-lg ${
            variant === "dark" 
              ? "bg-white text-slate-900" 
              : "bg-white text-slate-900"
          } border-2 ${
            status === "error" 
              ? "border-red-500" 
              : "border-transparent"
          } focus:border-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
          required
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            variant === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-blue-600 hover:bg-blue-50"
          }`}
        >
          {status === "loading" ? "..." : status === "success" ? "✓ Listo" : "Unirme"}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center text-sm ${
          status === "success" ? "text-green-600" : "text-red-600"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}