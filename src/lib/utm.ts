import { UTM_KEYS } from "./launch-leads";

export function pickUtm(params: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = params[k];
    const s = Array.isArray(v) ? v[0] : v;
    if (s) out[k] = s.slice(0, 120);
  }
  return out;
}
