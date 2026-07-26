# Soraia · app (base técnica)

Projeto Next.js com autenticação real via Supabase (email + senha). É o ponto de partida
da Fase 1 do checklist de lançamento.

## O que já funciona

- Cadastro (`/cadastro`) criando usuário de verdade no Supabase Auth
- Login (`/login`) com sessão persistida via cookie
- Painel (`/painel`) protegido, só acessa quem está logado

## O que ainda falta (propositalmente, pra você decidir o próximo passo)

- **Verificação por WhatsApp**: hoje o cadastro só pede email/senha. O fluxo completo
  (telefone → código enviado por WhatsApp → confirmar → só então liberar o cadastro)
  precisa de uma API route própria (`src/app/api/...`) integrada com o provedor de
  WhatsApp escolhido (Meta direto ou BSP tipo Twilio/Zenvia/Take Blip). A tabela
  `verification_codes` já está no schema, pronta pra isso.
- **Telas do painel**: Início, Finanças, Organização e Soraia ainda precisam ser
  reconstruídas aqui em React de verdade, usando `soraia-jornada-completa.jsx` como
  referência visual e as tabelas do schema (`lancamentos`, `metas`, `planos`, etc.)
  como fonte de dado real.
- **IA de categorização**: nenhuma chamada pra Claude/GPT existe ainda.

## Como rodar localmente

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No SQL Editor do Supabase, rode o conteúdo de `soraia-schema-supabase.sql`
3. Copie `.env.local.example` para `.env.local` e preencha com a URL e a chave
   anônima do seu projeto (Settings → API)
4. `npm install`
5. `npm run dev`
6. Acesse `http://localhost:3000`

## Como colocar no ar

Suba esse projeto num repositório GitHub separado (ou substitua o conteúdo do
repositório `soraia-app` que já existe) e importe na Vercel do mesmo jeito que
foi feito com a demo em HTML. Nas configurações do projeto na Vercel, adicione
as mesmas variáveis de ambiente do `.env.local` em Settings → Environment Variables.
