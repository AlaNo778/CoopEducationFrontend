const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface StudentData {
  studentId: number;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  gpax: number;
  totalCredits: number;
  majorName: string;
  houseNo: string;
  road: string | null;
  alley: string | null;
  villageNo: string;
  subDistrict: string;
  district: string;
  province: string;
  postcode: string;
  phoneHome: string;
  phoneMobile: string;
  facebook: string;
  lineId: string;
  advisor: string;
}

export interface ApiResponse<T> {
  isError: boolean;
  message: string;
  code: string;
  data: T;
}

export interface UpdateStudentInfoPayload {
  FirstName: string;
  LastName: string;
  MajorId: number;
  Gpax: number;
  TotalCredits: number;
}

export interface UpdateStudentContactPayload {
  Email: string;
  PhoneHome: string;
  PhoneMobile: string;
  Facebook: string;
  LineId: string;
}

export interface UpdateStudentAddressPayload {
  HouseNo: string;
  VillageNo: string;
  Alley: string;
  Road: string;
  SubDistrict: string;
  District: string;
  Province: string;
  Postcode: string;
}

// payload เดียว ส่งครบทุก section พร้อมกันเมื่อกดปุ่มบันทึก
export interface UpdateStudentPayload {
  Info: UpdateStudentInfoPayload;
  Contact: UpdateStudentContactPayload;
  Address: UpdateStudentAddressPayload;
}

export interface MajorListItem {
  majorId: number;
  majorName: string;
}

export async function fetchStudentProfile(): Promise<ApiResponse<StudentData>> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/StudentInfo`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("fetchStudentProfile failed", res.status, text);
    throw new Error(`Failed to fetch student profile: ${res.status} ${text}`);
  }
  return await res.json();
}

export async function updateStudent(
  payload: UpdateStudentPayload,
): Promise<ApiResponse<unknown>> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/StudentManagement/update-student`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("updateStudent failed", res.status, text);
    throw new Error(`Failed to update student profile: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function fetchMajorList(): Promise<ApiResponse<MajorListItem[]>> {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const url = `${base}/Majors`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("fetchMajorList failed", res.status, text);
    throw new Error(`Failed to fetch major list: ${res.status} ${text}`);
  }

  return await res.json();
}
const ProfileService = {
  fetchStudentProfile,
  updateStudent,
  fetchMajorList,
};

export default ProfileService;
