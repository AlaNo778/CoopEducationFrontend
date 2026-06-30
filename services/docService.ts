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

export async function uploadDocument(file: File, docId: number): Promise<string> {
    const base = (API_URL ?? "").replace(/\/$/, "");
    const url = `${base}/SubmitForm`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docId", docId.toString());

    const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("uploadDocument failed", res.status, text);
    throw new Error(`Failed to upload document: ${res.status} ${text}`);
  }

  return await res.text();

}
export async function fetchDocumentExist(): Promise<number[]> {
    const base = (API_URL ?? "").replace(/\/$/, "");
    const url = `${base}/DocumentInfo`;

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("fetchDocumentExist failed", res.status, text);
        throw new Error(`Failed to check document existence: ${res.status} ${text}`);
    }

    return await res.json();
}

export default { fetchDocument, fetchAllDocuments, uploadDocument, fetchDocumentExist };
