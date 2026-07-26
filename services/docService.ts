const API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseAPI = (API_URL ?? "").replace(/\/$/, "");
export interface DocumentExistDto{
  docTypeId:number;
  approved:boolean;
}

export async function fetchDocument(docId: number): Promise<Blob> {
  const base = baseAPI;
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
  const base = baseAPI;
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

export async function uploadDocument(
  file: File,
  docId: number,
): Promise<string> {
  const base = baseAPI;
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
  const base = baseAPI;
  const url = `${base}/DocumentInfo`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("fetchDocumentExist failed", res.status, text);
    throw new Error(
      `Failed to check document existence: ${res.status} ${text}`,
    );
  }

  return await res.json();
}
export async function fetchDocumentThesisExist(): Promise<DocumentExistDto[]> {
  const base = baseAPI;
  const url = `${base}/GetThesisIds`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("fetchDocumentExist failed", res.status, text);
    throw new Error(
      `Failed to check document existence: ${res.status} ${text}`,
    );
  }

  return await res.json();
}
export async function uploadReport(file: File, docId: number): Promise<string> {
  const base = baseAPI;
  const url = `${base}/SubmitReport`;

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
    console.error("uploadReport failed", res.status, text);
    throw new Error(`Failed to upload Report: ${res.status} ${text}`);
  }
  return await res.text();
}
export async function fetchReportAndThesis(docId: number): Promise<string> {
  const base = baseAPI;
  const url = `${base}/GetReportAndThesis?docId=${encodeURIComponent(docId)}`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("fetchReportAndThesis failed", res.status, text);
    throw new Error(`Failed to fetch report/thesis URL: ${res.status} ${text}`);
  }

  const text = await res.text();
  return text.trim();
}

const documentService = {
  fetchDocument,
  fetchAllDocuments,
  uploadDocument,
  fetchDocumentExist,
  fetchReportAndThesis,
  uploadReport,
  fetchDocumentThesisExist
};
export default documentService;
