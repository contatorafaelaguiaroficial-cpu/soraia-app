"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setCarregando(false);

    if (error) {
      setErro("Email ou senha incorretos.");
      return;
    }

    router.push("/painel");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#0F0C14" }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ background: "#1C1723", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: "#F4F1F8" }}>
          Entrar na sua conta
        </h1>
        <p className="text-sm mb-6" style={{ color: "#9C93AC" }}>
          Use o email e a senha que você criou no cadastro.
        </p>

        <input
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: "#241E2D", color: "#F4F1F8", border: "1px solid rgba(255,255,255,0.08)" }}
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full mb-4 rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: "#241E2D", color: "#F4F1F8", border: "1px solid rgba(255,255,255,0.08)" }}
        />

        {erro && (
          <p className="text-sm mb-4" style={{ color: "#FFC98A" }}>
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-full py-3 font-bold text-sm text-white"
          style={{
            background: carregando ? "#4A3B6B" : "linear-gradient(155deg, #8B5CF6, #6D28D9)",
          }}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-sm mt-5" style={{ color: "#9C93AC" }}>
          Não tem conta?{" "}
          <a href="/cadastro" style={{ color: "#A78BFA", fontWeight: 700 }}>
            Criar agora
          </a>
        </p>
      </form>
    </div>
  );
}
