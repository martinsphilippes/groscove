import { NextResponse, type NextRequest } from "next/server";
import { isAllowedPath } from "@/lib/routes";

export function middleware(request: NextRequest) {
  if (isAllowedPath(request.nextUrl.pathname)) return NextResponse.next();
  // Reescreve para um caminho inexistente: o Next mostra a página 404 com status 404.
  return NextResponse.rewrite(new URL("/__nao-existe", request.url), { status: 404 });
}

export const config = { matcher: "/:path*" };
