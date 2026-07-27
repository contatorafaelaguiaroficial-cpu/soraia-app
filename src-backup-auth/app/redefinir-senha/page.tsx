"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
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
        style={{ top: -120, left: -120, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)" }}
      />
      <div
        className="fixed pointer-events-none"
        style={{ bottom: -140, right: -140, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,152,169,0.16), transparent 70%)" }}
      />
    </>
  );
}

function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trocandoCodigo, setTrocandoCodigo] = useState(true);
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function trocarCodigo() {
      const code = searchParams.get("code");
      if (!code) {
        setErro("Link inválido ou expirado. Pede um novo link de recuperação.");
        setTrocandoCodigo(false);
        return;
      }
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setErro("Esse link expirou ou já foi usado. Pede um novo.");
      }
      setTrocandoCodigo(false);
    }
    trocarCodigo();
  }, [searchParams]);

  const senhasBatem = senha.length >= 6 && senha === confirmar;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!senhasBatem) return;
    setCarregando(true);
    setErro(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: senha });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }
    setSucesso(true);
    setTimeout(() => router.push("/painel"), 1800);
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
          className="flex items-center justify-center rounded-2xl mb-5"
          style={{ width: 52, height: 52, background: `linear-gradient(155deg, ${PURPLE}, ${PURPLE_DARK})`, boxShadow: "0 8px 20px rgba(109,40,217,0.35)" }}
        >
          <Lock size={24} color="#FFFFFF" strokeWidth={2.2} />
        </div>

        <h1 className="mb-1.5" style={{ color: INK, fontSize: 26, fontWeight: 900 }}>
          Criar nova senha
        </h1>

        {trocandoCodigo ? (
          <p className="text-sm mt-4" style={{ color: MUTED, fontWeight: 600 }}>Confirmando o link...</p>
        ) : sucesso ? (
          <p className="text-sm mt-4" style={{ color: "#8FE3C0", fontWeight: 700 }}>
            Senha alterada! Te levando pro painel...
          </p>
        ) : erro && !senha ? (
          <p className="text-sm mt-4" style={{ color: "#FFC98A", fontWeight: 700 }}>{erro}</p>
        ) : (
          <>
            <p className="text-sm mb-7" style={{ color: MUTED, fontWeight: 600, lineHeight: 1.5 }}>
              Escolhe uma senha nova pra sua conta.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-3" style={{ background: "#241E2D", border: `1.5px solid ${CARD_BORDER}` }}>
                <Lock size={17} color={PURPLE} strokeWidth={2.2} />
                <input
                  type={showSenha ? "text" : "password"}
                  placeholder="Nova senha (mín. 6 caracteres)"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  minLength={6}
                  required
                  className="flex-1 bg-transparent outline-none text-[14.5px]"
                  style={{ color: INK, fontWeight: 700 }}
                />
                <button type="button" onClick={() => setShowSenha((s) => !s)}>
                  {showSenha ? <EyeOff size={16} color={MUTED} /> : <Eye size={16} color={MUTED} />}
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-2" style={{ background: "#241E2D", border: `1.5px solid ${confirmar && !senhasBatem ? "#E09A38" : CARD_BORDER}` }}>
                <Lock size={17} color={PURPLE} strokeWidth={2.2} />
                <input
                  type={showSenha ? "text" : "password"}
                  placeholder="Confirme a nova senha"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none text-[14.5px]"
                  style={{ color: INK, fontWeight: 700 }}
                />
              </div>
              {confirmar && !senhasBatem && (
                <p className="text-sm mb-3" style={{ color: "#FFC98A", fontWeight: 700 }}>
                  As senhas precisam ser iguais e ter pelo menos 6 caracteres.
                </p>
              )}
              {erro && senha && <p className="text-sm mb-3" style={{ color: "#FFC98A", fontWeight: 700 }}>{erro}</p>}

              <button
                type="submit"
                disabled={carregando || !senhasBatem}
                className="w-full rounded-full py-3.5 font-extrabold text-[15px] text-white mt-2 transition-transform active:scale-[0.98]"
                style={{
                  background: (carregando || !senhasBatem) ? "#4A3B6B" : `linear-gradient(155deg, ${PURPLE}, ${PURPLE_DARK})`,
                  boxShadow: (carregando || !senhasBatem) ? "none" : "0 10px 24px rgba(109,40,217,0.38)",
                }}
              >
                {carregando ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={null}>
      <RedefinirSenhaContent />
    </Suspense>
  );
}
