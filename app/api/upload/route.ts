import { NextRequest } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const res = await fetch(`${FASTAPI_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json({ detail: data.detail ?? "Upload failed" }, { status: res.status });
  }

  return Response.json({ document_id: data.document_id }, { status: 200 });
}
