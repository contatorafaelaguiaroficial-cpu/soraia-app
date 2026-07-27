"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SairButton() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function handleSair() {
    setSaindo(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSair}
      disabled={saindo}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-transform active:scale-95"
      style={{ background: "#241E2D", border: "1.5px solid rgba(255,255,255,0.09)", color: "#9C93AC" }}
    >
      <LogOut size={15} strokeWidth={2.2} />
      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13 }}>
        {saindo ? "Saindo..." : "Sair"}
      </span>
    </button>
  );
}
