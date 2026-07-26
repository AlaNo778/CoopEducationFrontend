const API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseAPI = (API_URL ?? "").replace(/\/$/, "");

export interface StudentList {
  studentId: number;
  firstName: string;
  lastName: string;
}
export interface AdvisorshipDTO {
  studentId: number;
  academicYear: string;
}
export interface AssignmentResponse {
  message: string;
}
export interface ResponseMessage<T> {
  isError: boolean;
  message?: string;
  code?: string;
  data: T;
}
export interface Teacher {
  teacherId: number;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phon: string;
}
export interface AdviseeStudentsDTO {
  studentCode: string;
  firstName: string;
  lastName: string;
  email?: string;
  faculty?: string;
  gpax?: number;
  totalCredits?: number;
  majorName?: string;
  phoneHome?: string;
  phoneMobile?: string;
  facebook?: string;
  lineId?: string;

  mentorFirstName: string;
  mentorLastName: string;
  position?: string;
  department?: string;
  phone?: string;
  mentorEmail?: string;

  companyName: string;
  jobTitle?: string;
  jobDescription?: string;

  startDate: string;
  endDate: string;

  academicYear?: string;
}

export async function fetchStudentList(): Promise<StudentList[]> {
  const base = baseAPI;
  const url = `${base}/ListStudent`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("fetchStudentList failed", response.status, text);
    throw new Error(`Failed fetch student list: ${response.status} ${text}`);
  }
  return (await response.json()) as StudentList[];
}

export async function assignmentStudent(
  data: AdvisorshipDTO,
): Promise<AssignmentResponse> {
  const url = `${baseAPI}/StudentAdvisorAssignment`;

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Assignment failed: ${response.status} ${text}`);
  }

  return await response.json();
}
export async function fetchAdviseeStudents(): Promise<AdviseeStudentsDTO[]> {
  const url = `${baseAPI}/AdviseeStudent`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Failed to fetch advisee students: ${response.status} ${text}`,
    );
  }

  const result = (await response.json()) as ResponseMessage<
    AdviseeStudentsDTO[]
  >;

  return result.data;
}
export async function fetchTeacherInfomation(): Promise<
  ResponseMessage<Teacher>
> {
  const url = `${baseAPI}/api/TeacherInfo`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch teacher infomations: ${response.status} ${text}`,
    );
  }

  return (await response.json()) as ResponseMessage<Teacher>;
}

const teacherService = {
  fetchStudentList,
  assignmentStudent,
  fetchAdviseeStudents,
  fetchTeacherInfomation,
};
export default teacherService;
