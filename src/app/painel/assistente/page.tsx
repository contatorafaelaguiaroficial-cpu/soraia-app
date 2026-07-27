import { Suspense } from "react";

import AssistenteFinanceiro from "@/components/assistente/AssistenteFinanceiro";
import "./assistente.css";

export default function AssistentePage() {
  return (
    <Suspense fallback={null}>
      <AssistenteFinanceiro />
    </Suspense>
  );
}
