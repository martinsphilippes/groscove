import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LEADS_RETENTION_UNTIL, LEGAL_ENTITY, LEGAL_UPDATED_AT } from "@/lib/legal-entity";

function V({ k }: { k: keyof typeof LEGAL_ENTITY }) {
  const v = LEGAL_ENTITY[k];
  return v ? <>{v}</> : <mark className="legal__pending">[pendente]</mark>;
}

/** Documentos curtos, só sobre o teaser e o formulário (texto em português). */
export async function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const t = await getTranslations("legal");
  return (
    <main className="legal">
      <Link href="/" className="legal__back">
        ← {t("back")}
      </Link>
      <h1>{kind === "terms" ? t("termsTitle") : t("privacyTitle")}</h1>
      <p className="legal__updated">Última atualização: {LEGAL_UPDATED_AT}</p>
      {kind === "privacy" ? <Privacy /> : <Terms />}
    </main>
  );
}

function Privacy() {
  return (
    <>
      <p>
        Esta política vale só para esta página de lançamento do Groscove Ultra e para o formulário &quot;Seja o primeiro a
        saber&quot;. Ela explica quais dados pedimos, para quê, por quanto tempo e como você pode pedir a exclusão.
      </p>

      <h2>Quem cuida dos seus dados</h2>
      <p>
        <V k="company" />, CNPJ <V k="cnpj" />, <V k="address" />. Encarregado (DPO): <V k="dpo" />. Contato:{" "}
        <V k="email" />.
      </p>

      <h2>Quais dados coletamos</h2>
      <ul>
        <li>Nome, celular e e-mail, que você digita no formulário.</li>
        <li>@ do Instagram, se você preencher (só na página para influenciadores).</li>
        <li>Idioma da página e a campanha de origem do link (por exemplo, &quot;utm_source&quot;), se houver.</li>
        <li>
          Para segurança contra cadastros em massa: o navegador usado e o seu endereço IP em forma de código
          irreversível (nunca guardamos o IP em si).
        </li>
      </ul>

      <h2>Para que usamos</h2>
      <ul>
        <li>Avisar você sobre o lançamento e enviar novidades do Groscove Ultra.</li>
        <li>Para influenciadores: entrar em contato sobre parcerias quando a plataforma abrir.</li>
        <li>Impedir abuso do formulário.</li>
      </ul>
      <p>
        A base legal é o seu consentimento (a caixinha do formulário), e o nosso legítimo interesse na parte de
        segurança. Não vendemos seus dados e não os usamos para outra finalidade.
      </p>

      <h2>Com quem compartilhamos</h2>
      <p>
        Só com os fornecedores que hospedam a página e o banco de dados (Vercel e Supabase), que tratam os dados em nosso
        nome. O banco fica em São Paulo; a hospedagem da página pode passar por servidores fora do Brasil, com as
        garantias exigidas pela LGPD.
      </p>

      <h2>Por quanto tempo guardamos</h2>
      <p>
        Até {LEADS_RETENTION_UNTIL} (12 meses depois do lançamento) ou até você pedir a exclusão ou retirar o
        consentimento, o que vier primeiro.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode, a qualquer momento, pedir para ver, corrigir ou apagar seus dados, ou deixar de receber novidades.
        Basta escrever para <V k="email" /> com o e-mail que você cadastrou. Respondemos em até 15 dias. Você também
        pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
      </p>

      <h2>Cookies</h2>
      <p>Usamos só um cookie, para lembrar o idioma escolhido. Não há cookies de publicidade nem de rastreamento.</p>

      <h2>Mudanças</h2>
      <p>Se esta política mudar, a data no topo é atualizada.</p>
    </>
  );
}

function Terms() {
  return (
    <>
      <p>
        Esta página apresenta o lançamento do Groscove Ultra e permite que você deixe seus dados para ser avisado.
        Ao usá-la, você concorda com estas regras.
      </p>
      <h2>O que é esta página</h2>
      <p>
        Uma página informativa e gratuita. O cadastro não cria conta, não gera compra e não garante acesso antecipado.
        A data de lançamento pode mudar.
      </p>
      <h2>Seu cadastro</h2>
      <p>
        Informe dados verdadeiros e seus. Cadastros falsos, automáticos ou em nome de outra pessoa podem ser apagados.
        Os dados são tratados conforme a <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
      <h2>Marca e conteúdo</h2>
      <p>
        O nome, o logo e os textos do Groscove Ultra pertencem a <V k="company" /> e não podem ser copiados sem
        autorização.
      </p>
      <h2>Lei e contato</h2>
      <p>
        Vale a lei brasileira. Dúvidas: <V k="email" />.
      </p>
    </>
  );
}
