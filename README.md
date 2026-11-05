# groscove

Teaser de lançamento do **Groscove Ultra**, separado do app Ultra-hero.
Só existem `/`, `/influenciador`, `/termos` e `/privacidade`; qualquer outro caminho responde 404
(`src/middleware.ts` + `src/lib/routes.ts`).

## Como o formulário grava
O groscove **não tem chave do banco**. A server action (`src/app/actions.ts`) valida, e o servidor envia
o cadastro assinado (HMAC-SHA256) para `LEADS_ENDPOINT` no Ultra-hero, que grava em `launch_leads`.
Detalhes e código da rota do app: `docs/ultra-hero-rota-launch-leads.md`.

## Variáveis de ambiente
Ver `.env.example`: `GROSCOVE_LEADS_SECRET`, `LEADS_ENDPOINT`, `LAUNCH_AT` (opcional).

## Comandos
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck && npm run lint && npm test && npm run build
```

## Pendências antes de publicar
- [ ] Copiar do Ultra-hero o texto de Termos e Privacidade (`src/components/LegalPage.tsx`).
- [ ] Trocar o logo em texto pelos caminhos de `brand-paths.ts` (`src/components/LaunchLogo.tsx`).
- [ ] Conferir textos en/es e os três tópicos do influenciador com os originais (`messages/*.json`).
- [ ] Criar a rota `/api/launch-leads` no Ultra-hero e o mesmo segredo nos dois projetos.
- [ ] Projeto Vercel `groscove` ligado a este repositório, com as variáveis.
