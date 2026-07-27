"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, User, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const INK = "#F4F1F8";
const MUTED = "#9C93AC";
const CARD_BG = "#1C1723";
const CARD_BORDER = "rgba(255,255,255,0.09)";
const PURPLE = "#8B5CF6";
const PURPLE_DARK = "#6D28D9";

function BackgroundGlow() {
  return (
    <>
      <div
        className="fixed pointer-events-none"
        style={{
          top: -120, left: -120, width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)",
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: -140, right: -140, width: 460, height: 460, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,152,169,0.16), transparent 70%)",
        }}
      />
    </>
  );
}

function Field({
  icon: Icon,
  ...props
}: { icon: typeof Mail } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-3"
      style={{ background: "#241E2D", border: `1.5px solid ${CARD_BORDER}` }}
    >
      <Icon size={17} color={PURPLE} strokeWidth={2.2} />
      <input
        {...props}
        className="flex-1 bg-transparent outline-none text-[14.5px]"
        style={{ color: INK, fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}

type Modo = "entrar" | "criar";

export default function AuthForm({ modoInicial }: { modoInicial: Modo }) {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>(modoInicial);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [recuperando, setRecuperando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);
    const supabase = createClient();

    if (modo === "criar") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome } },
      });
      setCarregando(false);
      if (error) return setErro(error.message);
      if (data.user) router.push("/painel");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      setCarregando(false);
      if (error) return setErro("Email ou senha incorretos.");
      router.push("/painel");
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  async function handleEsqueciSenha() {
    if (!email) {
      setErro("Digita seu email no campo acima primeiro, aí eu mando o link de recuperação.");
      return;
    }
    setErro(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (error) {
      setErro(error.message);
      return;
    }
    setAviso("Te mandei um link de recuperação por email.");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "#0F0C14", fontFamily: "'Nunito', sans-serif" }}
    >
      <BackgroundGlow />

      <div
        className="w-full max-w-md rounded-[28px] p-9 relative"
        style={{
          background: `linear-gradient(155deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)), ${CARD_BG}`,
          border: `1px solid ${CARD_BORDER}`,
          boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 50px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-2xl mb-6"
          style={{
            width: 52, height: 52,
            background: `linear-gradient(155deg, ${PURPLE}, ${PURPLE_DARK})`,
            boxShadow: "0 8px 20px rgba(109,40,217,0.35)",
          }}
        >
          <Sparkles size={24} color="#FFFFFF" strokeWidth={2.2} />
        </div>

        {/* abas entrar / criar conta */}
        <div className="flex gap-1.5 mb-7 p-1 rounded-full" style={{ background: "#241E2D", border: `1.5px solid ${CARD_BORDER}` }}>
          {(["entrar", "criar"] as Modo[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setModo(m); setErro(null); setAviso(null); }}
              className="flex-1 text-center py-2.5 rounded-full text-[13.5px] transition-colors"
              style={{
                background: modo === m ? `linear-gradient(155deg, ${PURPLE}, ${PURPLE_DARK})` : "transparent",
                color: modo === m ? "#FFFFFF" : MUTED,
                fontWeight: 800,
              }}
            >
              {m === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {modo === "criar" && (
            <Field icon={User} type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          )}
          <Field icon={Mail} type="email" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field
            icon={Lock}
            type="password"
            placeholder={modo === "criar" ? "Crie uma senha (mín. 6 caracteres)" : "Sua senha"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={modo === "criar" ? 6 : undefined}
            required
          />

          {erro && <p className="text-sm mb-3 mt-1" style={{ color: "#FFC98A", fontWeight: 700 }}>{erro}</p>}
          {aviso && <p className="text-sm mb-3 mt-1" style={{ color: "#8FE3C0", fontWeight: 700 }}>{aviso}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-full py-3.5 font-extrabold text-[15px] text-white mt-1 transition-transform active:scale-[0.98]"
            style={{
              background: carregando ? "#4A3B6B" : `linear-gradient(155deg, ${PURPLE}, ${PURPLE_DARK})`,
              boxShadow: carregando ? "none" : "0 10px 24px rgba(109,40,217,0.38)",
            }}
          >
            {carregando ? "Aguarda..." : modo === "criar" ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: CARD_BORDER }} />
          <span className="text-[12px]" style={{ color: MUTED, fontWeight: 700 }}>ou</span>
          <div className="flex-1 h-px" style={{ background: CARD_BORDER }} />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2.5 rounded-full py-3.5 font-extrabold text-[14px] transition-transform active:scale-[0.98]"
          style={{ background: "#FFFFFF", color: "#1D1D1F" }}
        >
          <GoogleIcon />
          Entrar com Google
        </button>

        {modo === "entrar" && (
          <button
            type="button"
            onClick={handleEsqueciSenha}
            className="w-full text-center text-sm mt-6"
            style={{ color: MUTED, fontWeight: 700 }}
          >
            Esqueci minha senha
          </button>
        )}
      </div>
    </div>
  );
}
