/** Máscara enquanto digita: (11) 98765-4321 */
export function formatBrPhoneInput(value: string): string {
  const d = value.replace(/\D/g, "").replace(/^55(?=\d{11}$)/, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Celular brasileiro em E.164 (+55DD9XXXXXXXX) ou null se inválido. */
export function normalizeBrMobileE164(value: string): string | null {
  let d = value.replace(/\D/g, "");
  if (d.length === 13 && d.startsWith("55")) d = d.slice(2);
  if (d.length !== 11) return null;
  if (!/^[1-9][1-9]9\d{8}$/.test(d)) return null;
  return `+55${d}`;
}
