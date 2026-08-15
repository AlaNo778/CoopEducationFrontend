const API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseAPI = (API_URL ?? "").replace(/\/$/, "");
export interface DocumentExistDto {
  docTypeId: number;
  approved: boolean;
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

export async function fetchDocumentExist(
  tUser: number,
  tRoleName: string | null | undefined,
): Promise<number[]> {
  const base = baseAPI;
  const params = new URLSearchParams();
  params.set("tUserId", String(tUser));
  if (tRoleName) {
    params.set("tRoleName", tRoleName);
  }
  const url = `${base}/DocumentInfo?${params.toString()}`;

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
export async function uploadReport(
  file: File,
  docId: number,
  studentCode: string | null,
): Promise<string> {
  const base = baseAPI;
  const url = `${base}/SubmitReport`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("docId", docId.toString());

  if (studentCode !== null) {
    formData.append("studentCode", studentCode);
  }

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
export async function fetchReportAndThesis(
  docId: number,
  studentCode: string | null,
): Promise<string> {
  const base = baseAPI;
  const url = `${base}/GetReportAndThesis?docId=${docId}${
    studentCode !== null
      ? `&studentCode=${encodeURIComponent(studentCode)}`
      : ""
  }`;
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
export async function fetchExistingReplyDocStatus(): Promise<number[]> {
  const base = baseAPI;
  const url = `${base}/GetThesisReplyIds`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("fetchReplyDocStatus failed", res.status, text);
    throw new Error(`Failed to fetch thesis reply ids: ${res.status} ${text}`);
  }

  const data: number[] = await res.json();

  return data;
}

export async function UpdateStatusFinalThesis(
  docId: number,
  studentCode: string,
): Promise<string> {
  const base = baseAPI;
  const url = `${base}/GetThesisIds/update_approve?docId=${docId}&studentCode=${encodeURIComponent(studentCode)}`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("UpdateStatusFinalThesis failed", res.status, text);
    throw new Error(
      `Failed to update final thesis status: ${res.status} ${text}`,
    );
  }

  return await res.text();
}
export async function fetchViewFileStaff(
  roleName: string,
  id: number,
  docId: number,
): Promise<string> {
  const base = baseAPI;

  const url =
    `${base}/GetViewFileStaff` +
    `?roleName=${encodeURIComponent(roleName)}` +
    `&id=${id}` +
    `&docId=${docId}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();

    console.error(
      "fetchViewFileStaff failed",
      res.status,
      text
    );

    throw new Error(
      `Failed to fetch view file: ${res.status} ${text}`
    );
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
  fetchDocumentThesisExist,
  fetchExistingReplyDocStatus,
  UpdateStatusFinalThesis,
  fetchViewFileStaff,
};
export default documentService;
