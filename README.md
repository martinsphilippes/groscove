# groscove

Teaser de lançamento do **Groscove Ultra**, separado do app Ultra-hero.
Só existem `/`, `/influenciador`, `/termos` e `/privacidade`; qualquer outro caminho responde 404
(`src/middleware.ts` + `src/lib/routes.ts`).

## Como o formulário grava
O cadastro vai direto para a tabela `public.launch_leads` (Supabase do Ultra-hero), a mesma do
**Admin › Interessados**, pela função `groscove_join_launch_list` (`supabase/groscove_join_launch_list.sql`).
O groscove usa só a **chave pública**: ela consegue chamar essa função e nada mais (não lê nem apaga dados).
A função valida os campos, atualiza se o e-mail já existir e barra enxurradas (5 por IP a cada 10 min,
30 por minuto no total). O IP é guardado só como hash.

## Variáveis de ambiente
Ver `.env.example`: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `IP_HASH_SALT`, `LAUNCH_AT` (opcional).

## Comandos
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck && npm run lint && npm test && npm run build
```

## Pendências antes de publicar
- [ ] Preencher `src/lib/legal-entity.ts` (empresa, CNPJ, endereço, e-mail, DPO) — usados em Termos e Privacidade.
- [ ] Banco próprio do groscove (Supabase `groscove`) com a tabela de interessados; trocar as variáveis.
- [ ] Remover a função `groscove_join_launch_list` do banco do Ultra-hero (não será usada).
- [ ] Projeto Vercel `groscove` ligado a este repositório, com as variáveis.
