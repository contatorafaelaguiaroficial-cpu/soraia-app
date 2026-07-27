"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  Repeat2,
  Tag,
  WalletCards,
} from "lucide-react";
import {
  criarMovimentacao,
  type EstadoMovimentacao,
} from "@/app/painel/financas/actions";

const estadoInicial: EstadoMovimentacao = {};

export default function NovaMovimentacaoForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [estado, action, pendente] = useActionState(
    criarMovimentacao,
    estadoInicial
  );

  useEffect(() => {
    if (estado.sucesso) {
      formRef.current?.reset();
    }
  }, [estado.sucesso]);

  const hoje = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} action={action} className="finance-form">
      <div className="finance-form-header">
        <div>
          <span>NOVA MOVIMENTAÇÃO</span>
          <h2>Registre uma receita ou despesa</h2>
        </div>

        <WalletCards size={22} />
      </div>

      <div className="finance-type-selector">
        <label>
          <input
            type="radio"
            name="tipo"
            value="receita"
            defaultChecked
          />

          <span>
            <ArrowUpCircle size={18} />
            Receita
          </span>
        </label>

        <label>
          <input type="radio" name="tipo" value="despesa" />

          <span>
            <ArrowDownCircle size={18} />
            Despesa
          </span>
        </label>
      </div>

      <div className="finance-form-grid">
        <label className="finance-field finance-field-wide">
          <span>Descrição</span>

          <input
            type="text"
            name="descricao"
            placeholder="Ex.: Aluguel, salário ou mercado"
            required
          />
        </label>

        <label className="finance-field">
          <span>Valor</span>

          <div className="finance-input-with-prefix">
            <strong>R$</strong>

            <input
              type="text"
              name="valor"
              inputMode="decimal"
              placeholder="0,00"
              required
            />
          </div>
        </label>

        <label className="finance-field">
          <span>
            <Tag size={14} />
            Categoria
          </span>

          <select name="categoria" defaultValue="Outros">
            <option>Moradia</option>
            <option>Alimentação</option>
            <option>Transporte</option>
            <option>Saúde</option>
            <option>Educação</option>
            <option>Lazer</option>
            <option>Assinaturas</option>
            <option>Salário</option>
            <option>Investimentos</option>
            <option>Outros</option>
          </select>
        </label>

        <label className="finance-field">
          <span>
            <CalendarDays size={14} />
            Data
          </span>

          <input type="date" name="data" defaultValue={hoje} required />
        </label>

        <label className="finance-recurring">
          <input type="checkbox" name="recorrente" />

          <span>
            <Repeat2 size={16} />
            Esta movimentação é recorrente
          </span>
        </label>
      </div>

      {estado.erro && (
        <p className="finance-message finance-message-error">
          {estado.erro}
        </p>
      )}

      {estado.sucesso && (
        <p className="finance-message finance-message-success">
          {estado.sucesso}
        </p>
      )}

      <button
        type="submit"
        className="finance-submit"
        disabled={pendente}
      >
        {pendente ? "Salvando..." : "Salvar movimentação"}
      </button>
    </form>
  );
}
