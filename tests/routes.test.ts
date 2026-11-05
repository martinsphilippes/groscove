import { describe, expect, it } from "vitest";
import { isAllowedPath } from "@/lib/routes";

describe("isolamento de caminhos", () => {
  it.each(["/", "/influenciador", "/influenciador/", "/termos", "/privacidade", "/robots.txt", "/icon.svg", "/_next/static/x.js", "/opengraph-image", "/opengraph-image-abc123"])(
    "permite %s",
    (p) => expect(isAllowedPath(p)).toBe(true),
  );

  it.each(["/login", "/agencia", "/admin", "/conheca", "/api/launch-leads", "/legal/termos", "/influenciador/x", "/_next", "/.env", "/sobre"])(
    "bloqueia %s",
    (p) => expect(isAllowedPath(p)).toBe(false),
  );
});
