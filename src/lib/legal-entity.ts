/**
 * Dados de quem é responsável pelo teaser (controlador, na LGPD).
 * Valores vazios aparecem como "[pendente]" (exceto dpo, que é opcional).
 */
export const LEGAL_ENTITY = {
  company: "Groscove Administração de Empresas LTDA",
  cnpj: "35.250.953/0001-92",
  address: "com sede em São Paulo – SP",
  email: "contato@groscove.com",
  /** Encarregado (DPO). Vazio: o canal de contato acima atende os pedidos sobre dados. */
  dpo: "",
};

/** Os dados do formulário são apagados nesta data (12 meses após o lançamento), se não antes. */
export const LEADS_RETENTION_UNTIL = "01/01/2028";
export const LEGAL_UPDATED_AT = "05/11/2026";
