const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CompanyListItem {
  companyId: number;
  companyName: string;
}
export interface Mentors {
  mentorId: number;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  mentorPhone: string;
  mentorEmail: string;
}
export interface MentorAssignPayload {
  CompanyId: number;
  FirstName: string;
  LastName: string;
  Position: string;
  Department: string;
  Phone: string;
  Email: string;
}
export interface MentorUpdatePayload {
  MentorId: number;
  CompanyId: number;
  FirstName: string;
  LastName: string;
  Position: string;
  Department: string;
  Phone: string;
  Email: string;
}
export interface ApiResponse<T> {
  isError: boolean;
  message: string;
  code: string;
  data: T;
}
export interface CompanyAddPayload {
  CompanyName: string;
  Phone: string;
  Fax: string;
  Email: string;
  HrName: string;
  Address: string;
}
export interface CompanyUpdatePayload {
  CompanyId: number;
  CompanyName: string;
  Phone: string;
  Fax: string;
  Email: string;
  HrName: string;
  Address: string;
}
export interface coop {
  companyId: number;
  companyName: string;
  companyPhone: string;
  companyFax: string;
  companyEmail: string;
  hrName: string;
  address: string;
  jobTitle: string;
  jobDescription: string;
  startDate: Date;
  endDate: Date;
  academicYear: string;
  mentor: Mentors;
}
export interface StudentCoopInfo {
  studentId: number;
  coop: coop;
}
export interface Placement {
  CompanyId: number;
  MentorId?: number;
  JobTitle: string;
  JobDescription: string;
  StartDate: string;
  EndDate: string;
  AcademicYear: string;
}
export interface StudentId {
  studentId: number;
}
export interface AddResponseMentor {
  success: boolean;
  message: string;
  mentorId: number;
}
export interface AddResponseCompaany {
  success: boolean;
  message: string;
  companyId: number;
}

export async function fetchCompanyList(): Promise<
  ApiResponse<CompanyListItem[]>
> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/CompanyList`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

export async function fetchMentorList(
  companyId: number,
): Promise<ApiResponse<Mentors[]>> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/Mentors?companyId=${companyId}`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}
export async function assignMentor(
  payload: MentorAssignPayload,
): Promise<AddResponseMentor> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/MentorManagement`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
}
export async function updateMentor(
  payload: MentorUpdatePayload,
): Promise<ApiResponse<unknown>> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/MentorManagement`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
}

export async function addCompany(
  payload: CompanyAddPayload,
): Promise<AddResponseCompaany> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/CompanyManagement`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
}

export async function updateCompany(
  payload: CompanyUpdatePayload,
): Promise<ApiResponse<unknown>> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/CompanyManagement`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
}
export async function fetchStudentCoopInfo(): Promise<
  ApiResponse<StudentCoopInfo>
> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/StudentCoopInfo`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  return data;
}
export async function assignStudentPlacement(
  payload: Placement,
): Promise<ApiResponse<unknown>> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/CoopPlacementManagement`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
}
export async function updateStudentPlacement(
  payload: Placement,
): Promise<ApiResponse<unknown>> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/CoopPlacementManagement`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
}
export async function GetStudentId(): Promise<number> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/GetStudentId`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const id = await res.json();
  return id;
}

const coopService = {
  fetchCompanyList,
  fetchMentorList,
  fetchStudentCoopInfo,
  assignMentor,
  updateMentor,
  addCompany,
  updateCompany,
  assignStudentPlacement,
  updateStudentPlacement,
  GetStudentId,
};

export default coopService;
