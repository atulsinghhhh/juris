import type { NextRequest } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL ?? "http://localhost:8000";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/documents/[id]">) {
  const { id } = await ctx.params;

  const res = await fetch(`${FASTAPI_URL}/api/documents/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json({ detail: "Document not found" }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
