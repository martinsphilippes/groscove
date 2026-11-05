# groscove

Teaser de lançamento do **Groscove Ultra**, separado do app Ultra-hero.
Só existem `/`, `/influenciador`, `/termos` e `/privacidade`; qualquer outro caminho responde 404
(`src/middleware.ts` + `src/lib/routes.ts`).

## Onde está no ar
- Vercel: projeto `groscove` (time `martinsphilippes`, `prj_lTWH8rv0PsixQ5CgEaYAuWLGTFuA`), funções em São Paulo (`gru1`).
- Endereço oficial: https://groscove-ultra.vercel.app (variável `SITE_URL`). `groscove-wine.vercel.app` também abre o site (`groscove.vercel.app` já era de outra conta). Domínio próprio: apontar para este projeto e trocar `SITE_URL`.
- Publica sozinho a cada push no branch de produção do repositório.

## Como o formulário grava (a "portinha")
O cadastro vai direto para a tabela `public.launch_leads` (Supabase do Ultra-hero), a mesma do
**Admin › Interessados**, pela função `groscove_join_launch_list` (`supabase/groscove_join_launch_list.sql`).
O groscove usa só a **chave pública**: ela consegue chamar essa função e nada mais (não lê, não altera nem apaga
outros dados). A função valida os campos e, se o e-mail já existir no mesmo tipo, só atualiza o cadastro.

## Limites e risco aceito
- **Risco:** a chave pública já aparece no navegador para quem usa o app, então qualquer pessoa pode chamar a
  função direto, sem passar pela página, e tentar encher a lista com cadastros falsos.
  Decisão do responsável (05/11/2026): aceitar o risco em troca da lista única no Admin.
- **Limites que seguram isso (no próprio banco):**
  - no máximo **5 cadastros por visitante a cada 10 minutos** (pelo IP em forma de código irreversível);
  - no máximo **30 cadastros por minuto no total** vindos do groscove;
  - repetir o mesmo e-mail não cria linha nova, só atualiza a existente.
- **Limitação:** quem chama a função direto pode mandar um código de IP diferente a cada vez; nesse caso só
  o limite total (30/min) segura. No pior caso são ~1.800 linhas falsas por hora, todas com `source = 'groscove'`,
  fáceis de filtrar e apagar.
- **Se virar problema:** trocar para a rota assinada no Ultra-hero (servidor→servidor, com segredo) ou banco
  próprio; o groscove só muda `src/lib/leads-client.ts`.
- **Acompanhar:** no Admin › Interessados, picos de cadastros com origem `groscove` em poucos minutos.

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
- [ ] Copiar `supabase/groscove_join_launch_list.sql` para as migrações do Ultra-hero (já está aplicado no banco).
- [x] Projeto Vercel `groscove` ligado a este repositório, com as variáveis.
- [ ] Teste real do formulário em produção (cadastro aparece no Admin › Interessados; apagar depois).
