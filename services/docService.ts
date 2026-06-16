import { getToken, getUserIdFromToken } from "./allService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDocument(docId: number): Promise<Blob> {
  
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/TemplateDocument?docId=${encodeURIComponent(docId)}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("fetchDocument failed", res.status, text);
    throw new Error(`Failed to fetch document: ${res.status} ${text}`);
  }
  return await res.blob();
}

export async function fetchAllDocuments(): Promise<Blob> {
    const base = (API_URL ?? "").replace(/\/$/, "");
    const url = `${base}/AllTemplateDocument`;
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        console.error("fetchAllDocuments failed", res.status, text);
        throw new Error(`Failed to fetch all documents: ${res.status} ${text}`);
    }
    return await res.blob();
}

export default { fetchDocument, fetchAllDocuments };
