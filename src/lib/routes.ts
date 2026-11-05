/**
 * Caminhos que existem no groscove. Qualquer outro responde 404:
 * não há app atrás deste projeto, e o middleware garante isso mesmo
 * que alguém adicione uma rota por engano.
 */
export const PAGE_PATHS = ["/", "/influenciador", "/termos", "/privacidade"] as const;

const STATIC_FILES = new Set(["/robots.txt", "/favicon.ico", "/icon.svg", "/apple-icon.png"]);

export function isAllowedPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if ((PAGE_PATHS as readonly string[]).includes(path)) return true;
  if (STATIC_FILES.has(path)) return true;
  if (path.startsWith("/_next/")) return true;
  // Imagens de compartilhamento (WhatsApp, Instagram, X).
  if (/^\/(opengraph|twitter)-image(-[\w]+)?(\.png)?$/.test(path)) return true;
  return false;
}
