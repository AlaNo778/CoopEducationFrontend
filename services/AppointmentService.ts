const API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseAPI = (API_URL ?? "").replace(/\/$/, "");

export type SlotStatus =
  | "Available"
  | "Closed"
  | "Cancelled"
  | "FullyBooked"
  | "confirmed";

export type SupervisionModel = "Onsite" | "Online" | "Hybrid";

export interface GetAppointmentSlotDto {
  slotId: number;
  availableDate: string;
  startTime: string;
  endTime: string;
  supervisionModel: SupervisionModel;
  location: string;
  maxStudents: number;
  bookedStudents: number;
  slotStatus: SlotStatus;
  remark: string | null;
}
export interface AppointmentDto {
  //   teacherId: number;
  availableDate: string;
  startTime: string;
  endTime: string;
  supervisionModel: SupervisionModel;
  location: string | null;
  remark: string | null;
  maxStudent: number | null;
}
export interface StudentBookAppointmentDTO {
  slotId: number;
  teacherId: number;
}
export interface BookingSlotDto {
  slotId: number;
  teacherId: number;
  availableDate: string;
  startTime: string;
  endTime: string;
  supervisionModel: SupervisionModel;
  location: string | null;
  maxStudents: number;
  bookedStudents: number;
  slotStatus: SlotStatus;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
  supervisionAppointments: unknown[];
}
export interface BookingDetailDto {
  appointmentId: number;
  slotId: number;
  studentId: number;
  teacherId: number;
  appointmentStatus: string | null;
  studentNote: string | null;
  teacherNote: string | null;
  bookedAt: string | null;
  slot: BookingSlotDto;
}
export interface TeacherAppointmentDetailDto {
  appointmentId: number;
  studentId: number;
  studentName: string;
  studentNote: string | null;
  teacherNote: string | null;
  appointmentStatus: string | null;
  bookedAt: string | null;
  slotId: number;
  slot: BookingSlotDto;
}
//สำหรับดึงข้อมูลเวลาว่างของอาจารย์
export async function fetchAppointmentsSlots(
  teacherId: number,
): Promise<GetAppointmentSlotDto[]> {
  const base = baseAPI;
  const url = `${base}/TeacherAppointment/get_appointment_slots?teacherId=${encodeURIComponent(teacherId.toString())}`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("fetchAppointmentsSlots failed", res.status, text);
    throw new Error(`Failed to fetch appointment slots: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data as GetAppointmentSlotDto[];
}
export async function CreateAppointmentSlot(dataAppointment: AppointmentDto) {
  const base = baseAPI;
  const url = `${base}/TeacherAppointment/create_appointment_slot`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataAppointment),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}
export async function ConfirmAppointmentSlot(appointmentId: number) {
  const base = baseAPI;
  const url = `${base}/TeacherAppointment/confirm_booking?appointmentId=${encodeURIComponent(appointmentId.toString())}`;
  const res = await fetch(url, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("ConfirmAppointmentSlot failed", res.status, text);
    throw new Error(
      `Failed to confirm appointment slot: ${res.status} ${text}`,
    );
  }
}
export async function getTeacherId(): Promise<number> {
  const base = baseAPI;
  const url = `${base}/GetTeacherId`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getTeacherId failed", res.status, text);
    throw new Error(`Failed to get teacher id: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data as number;
}

export async function bookAppointment(
  bookData: StudentBookAppointmentDTO,
): Promise<void> {
  const base = baseAPI;
  const url = `${base}/StudentAppointment`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("bookAppointment failed", res.status, text);
    throw new Error(`Failed to book appointment: ${res.status} ${text}`);
  }
}
export async function getBookingDetail(): Promise<BookingDetailDto | null> {
  const base = baseAPI;
  const url = `${base}/StudentAppointment`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const text = await res.text();

  if (!text.trim()) {
    return null;
  }

  return JSON.parse(text) as BookingDetailDto;
}

export async function getTeacherAppointmentDetail(): Promise<TeacherAppointmentDetailDto[]> {
  const base = baseAPI;
  const url = `${base}/TeacherAppointment/get_appointment_detail`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(
      "getTeacherAppointmentDetail failed",
      res.status,
      text
    );

    throw new Error(
      `Failed to get teacher appointment detail: ${res.status} ${text}`
    );
  }

  const data = await res.json();

  return data as TeacherAppointmentDetailDto[];
}
const AppointmentService = {
  fetchAppointmentsSlots,
  CreateAppointmentSlot,
  ConfirmAppointmentSlot,
  getTeacherId,
  bookAppointment,
  getBookingDetail,
  getTeacherAppointmentDetail,
};

export default AppointmentService;
