"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileLogoutButton() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function handleLogout() {
    try {
      setSaindo(true);

      const supabase = createClient();
      await supabase.auth.signOut();

      router.replace("/login");
      router.refresh();
    } finally {
      setSaindo(false);
    }
  }

  return (
    <button
      type="button"
      className="profile-logout-button"
      onClick={handleLogout}
      disabled={saindo}
    >
      <LogOut size={18} />
      <span>{saindo ? "Saindo..." : "Sair da conta"}</span>
    </button>
  );
}
