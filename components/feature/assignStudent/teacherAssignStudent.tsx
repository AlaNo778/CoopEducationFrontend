"use client";
import { useEffect, useState, useMemo, type ChangeEvent } from "react";
import styles from "./teacherAssignStudent.module.css";
import {
  StudentList,
  AdviseeStudentsDTO,
  AdvisorshipDTO,
  fetchStudentList,
  fetchAdviseeStudents,
  assignmentStudent,
} from "../../../services/teacherService";
// import NavigationDualBar from "@/components/layout/NavigationDualBar";
import { useRouter } from "next/navigation";

/* ---------------------------------------------------------
 * Icon placeholders (ยังไม่ใช้รูปโปรไฟล์จริง)
 * เก็บเป็น SVG inline เพื่อไม่ต้องพึ่ง icon library ภายนอก
 * ในอนาคตค่อยเปลี่ยน IconUser เป็น <img src={student.avatarUrl} />
 * --------------------------------------------------------- */
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7" fill="currentColor" />
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M4 21h16M13 21v-6h4v6M8 7h1M8 11h1M8 15h1"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M3 9h18M8 3v4M16 3v4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ---------------------------------------------------------
 * Types
 * --------------------------------------------------------- */
interface StudentCardInfo {
  fullName: string;
  studentCode?: string;
  majorName: string;
  companyName: string;
  periodTime: string;
  academicYear?: string;
}

/* ---------------------------------------------------------
 * Card component (แยกออกมาเพื่อ map ใช้งานง่าย)
 * --------------------------------------------------------- */
function StudentCard({ student }: { student: StudentCardInfo }) {
  const router = useRouter();

  const handleDetailClick = () => {
    router.push(`/assign-student/student/${student.studentCode}`);
  };

  return (
    <div className={styles.Card}>
      <span className={styles.statusBadge}>{student.academicYear}</span>

      <div className={styles.topCanvas}></div>

      <div className={styles.circle}>
        <div className={styles.innerCircleProfile}>
          <IconUser />
        </div>
      </div>

      <div className={styles.bottomCanvas}>
        <div className={styles.underFrofile}>
          <h3 className={styles.fullName}>{student.fullName || "-"}</h3>
          <h2 className={styles.studentCode}>{student.studentCode ?? "-"}</h2>
          <p className={styles.majorName}>{student.majorName}</p>
        </div>

        <div className={styles.companyAndduration}>
          <div className={styles.companyName}>
            <IconBuilding />
            <span>{student.companyName}</span>
          </div>
          <div className={styles.priod}>
            <IconCalendar />
            <span>{student.periodTime}</span>
          </div>
          <button className={styles.btnDetail} type="button" onClick={handleDetailClick}>
            <IconEye />
            <span>ดูรายละเอียด</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 3;

type AssignStatus = {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
};

/* ---------------------------------------------------------
 * Page component
 * --------------------------------------------------------- */
export default function TeacherAssignStudent() {
  const [studentList, setStudentList] = useState<StudentList[]>([]);
  const [adviseeStudent, setAdviseeStudent] = useState<AdviseeStudentsDTO[]>(
    [],
  );

  // ---------- ฟังก์ชันที่ 1: filter ตามปีการศึกษา ----------
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // ---------- ฟังก์ชันที่ 2: pagination (3 การ์ด/หน้า) ----------
  const [currentPage, setCurrentPage] = useState<number>(1);

  // ---------- ฟังก์ชันที่ 3: มอบหมายนักศึกษา ----------
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [assignStatus, setAssignStatus] = useState<AssignStatus>({
    type: "idle",
  });

  // โหลดรายชื่อ advisee ใหม่ (ใช้หลังมอบหมายสำเร็จ เพื่อให้ card อัปเดตทันที)
  const reloadAdvisees = async () => {
    const adviseeResponse = await fetchAdviseeStudents();
    setAdviseeStudent(adviseeResponse);
  };

  // ดึงข้อมูลนักศึกษา
  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentListResponse, adviseeResponse] = await Promise.all([
          fetchStudentList(),
          fetchAdviseeStudents(),
        ]);

        setStudentList(studentListResponse);
        setAdviseeStudent(adviseeResponse);
      } catch (error) {
        console.error("Load student data error:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    switch (assignStatus.type) {
      case "loading":
        alert("กำลังบันทึก...");
        break;

      case "success":
        alert(assignStatus.message);
        break;

      case "error":
        alert(assignStatus.message);
        break;
    }
  }, [assignStatus]);

  const studentinfo: StudentCardInfo[] = useMemo(() => {
    const formatThaiDate = (dateStr?: string): string => {
      if (!dateStr) {
        return "-";
      }

      const [datePart] = dateStr.split("T");
      const [year, month, day] = datePart.split("-");

      if (!year || !month || !day) {
        return "-";
      }

      const buddhistYear = Number(year) + 543;
      const yearShort = String(buddhistYear).slice(-2).padStart(2, "0");

      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${yearShort}`;
    };

    const formatPeriodTime = (startDate?: string, endDate?: string): string => {
      if (!startDate || !endDate) {
        return "-";
      }

      return `${formatThaiDate(startDate)} - ${formatThaiDate(endDate)}`;
    };

    return adviseeStudent.map((student) => ({
      fullName: `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim(),
      studentCode: student.studentCode,
      majorName: student.majorName ?? "-",
      companyName: student.companyName ?? "-",
      periodTime: formatPeriodTime(student.startDate, student.endDate),
      academicYear: student.academicYear ?? "-",
    }));
  }, [adviseeStudent]);

  /* =========================================================
   * ฟังก์ชันที่ 1: filter ตามปีการศึกษา (academicYear)
   * ========================================================= */
  const academicYearOptions = useMemo(() => {
    const years = studentinfo
      .map((s) => s.academicYear)
      .filter((y): y is string => !!y && y !== "-");
    return Array.from(new Set(years)).sort();
  }, [studentinfo]);

  const filteredStudentInfo = useMemo(() => {
    if (selectedYear === "all") return studentinfo;
    return studentinfo.filter((s) => s.academicYear === selectedYear);
  }, [studentinfo, selectedYear]);

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1); // เปลี่ยน filter แล้วต้องกลับไปหน้า 1
    setSelectedStudentId("");
    setAssignStatus({ type: "idle" });
  };

  /* =========================================================
   * ฟังก์ชันที่ 2: pagination — จำกัด 3 การ์ดต่อหน้า
   * ========================================================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudentInfo.length / PAGE_SIZE),
  );

  // กันหน้าเกิน (เช่น filter แล้วเหลือข้อมูลน้อยกว่าหน้าที่เคยอยู่)
  // คำนวณ "หน้าปัจจุบันที่ปลอดภัย" ตอน render เลย แทนการ setState ใน useEffect
  // (การ setState sync ใน effect ทำให้เกิด cascading renders โดยไม่จำเป็น —
  // ค่านี้ derive ได้จาก currentPage/totalPages อยู่แล้ว ไม่ต้องเก็บเป็น state แยก)
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedStudentInfo = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredStudentInfo.slice(start, start + PAGE_SIZE);
  }, [filteredStudentInfo, safeCurrentPage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  /* =========================================================
   * ฟังก์ชันที่ 3: มอบหมายนักศึกษา (dropdown -> เรียก API ทันที)
   * ต้องเลือกปีการศึกษา (ไม่ใช่ "ทั้งหมด") ก่อน เพราะ AdvisorshipDTO
   * ต้องระบุ academicYear ที่จะมอบหมายด้วย
   * ========================================================= */
  const handleAssignStudent = async (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStudentId(value);

    const studentId = Number(value);
    if (!value || Number.isNaN(studentId)) return;

    if (selectedYear === "all") {
      setAssignStatus({
        type: "error",
        message: "กรุณาเลือกปีการศึกษาก่อนมอบหมายนักศึกษา",
      });
      return;
    }

    const payload: AdvisorshipDTO = {
      studentId,
      academicYear: selectedYear,
    };

    setAssignStatus({ type: "loading" });
    try {
      const res = await assignmentStudent(payload);
      setAssignStatus({
        type: "success",
        message: res.message ?? "มอบหมายนักศึกษาสำเร็จ",
      });
      setSelectedStudentId(""); // เคลียร์ dropdown ให้เลือกคนถัดไปได้
      await reloadAdvisees(); // รีเฟรชการ์ดให้เห็นนักศึกษาที่เพิ่งมอบหมาย
    } catch (error) {
      console.error("Assign student error:", error);
      setAssignStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "มอบหมายนักศึกษาไม่สำเร็จ",
      });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <section>
          <h1 className={styles.title}>การจัดนักศึกษาเข้าที่ปรึกษา</h1>
          <p className={styles.subTitle}>
            จัดการการมอบหมายและกำหนดอาจารย์ที่ปรึกษาให้กับนักศึกษาในแต่ละภาคการศึกษา
          </p>
        </section>
      </div>
      <div className={styles.content}>
        <section>
          {/* <div>
            <NavigationDualBar
              leftLabel="หน้าหลัก"
              leftHref="/dashboard"
              rightLabel="นัดหมายวันนิเทศ"
              rightHref="/#schedule"
            />
          </div> */}
        </section>

        <section className={styles.filterAndassignBar}>
          {/* ---------- ฟังก์ชันที่ 1: filter ---------- */}
          <div className={styles.filterSpace}>
            <label htmlFor="yearFilter" className={styles.filterLabel}>
              ปีการศึกษา
            </label>
            <select
              id="yearFilter"
              className={styles.filterSelect}
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="all">ทั้งหมด</option>
              {academicYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* ---------- ฟังก์ชันที่ 3: มอบหมายนักศึกษา ---------- */}
          <section className={styles.assignStudentBar}>
            <label htmlFor="assignStudent" className={styles.filterLabel}>
              มอบหมายนักศึกษา (เลือกปีการศึกษาก่อนเพื่อมอบหมายนักศึกษา)
            </label>
            <select
              id="assignStudent"
              className={styles.filterSelect}
              value={selectedStudentId}
              onChange={handleAssignStudent}
              disabled={
                selectedYear === "all" || assignStatus.type === "loading"
              }
            >
              <option value="" disabled>
                เลือกนักศึกษา...
              </option>
              {studentList.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
            {/* {assignStatus.type === "loading" && (
              <span className={styles.assignStatus}>กำลังบันทึก...</span>
            )}
            {assignStatus.type === "success" && (
              <span className={styles.assignStatusSuccess}>
                {assignStatus.message}
              </span>
            )}
            {assignStatus.type === "error" && (
              <span className={styles.assignStatusError}>
                {assignStatus.message}
              </span>
            )} */}
          </section>
        </section>
        <div className={styles.bgcard}>
          <section className={styles.studentCard}>
            {pagedStudentInfo.length === 0 ? (
              <p className={styles.emptyState}>
                ไม่พบข้อมูลนักศึกษาในปีการศึกษานี้
              </p>
            ) : (
              pagedStudentInfo.map((student, index) => (
                <StudentCard
                  key={student.studentCode ?? index}
                  student={student}
                />
              ))
            )}
          </section>
        </div>

        {/* ---------- ฟังก์ชันที่ 2: pagination ---------- */}
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => goToPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
          >
            ก่อนหน้า
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`${styles.pageBtn} ${
                page === safeCurrentPage ? styles.pageBtnActive : ""
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => goToPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
