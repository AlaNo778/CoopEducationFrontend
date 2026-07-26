"use client";
import { useEffect, useState, useMemo } from "react";
import styles from "./teacherAssignStudent.module.css";
import {
  StudentList,
  AdviseeStudentsDTO,
  fetchStudentList,
  fetchAdviseeStudents,
} from "../../../services/teacherService";
import NavigationDualBar from "@/components/layout/NavigationDualBar";

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
  return (
    <div className={styles.Card}>
      {/* สถานะ - ตอนนี้ fix ค่าไว้ก่อน อนาคตค่อย map จาก field จริง (เช่นเทียบ startDate/endDate) */}
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
          <button className={styles.btnDetail} type="button">
            <IconEye />
            <span>ดูรายละเอียด</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
 * Page component
 * --------------------------------------------------------- */
export default function TeacherAssignStudent() {
  const [studentList, setStudentList] = useState<StudentList[]>([]);
  const [adviseeStudent, setAdviseeStudent] = useState<AdviseeStudentsDTO[]>(
    [],
  );

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

  // แปลงวันที่ฝึกงาน
  const formatPeriodTime = (startDate?: string, endDate?: string): string => {
    if (!startDate || !endDate) {
      return "-";
    }
    return `${startDate} - ${endDate}`;
  };

  const studentinfo: StudentCardInfo[] = useMemo(() => {
    return adviseeStudent.map((student) => ({
      fullName: `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim(),
      studentCode: student.studentCode,
      majorName: student.majorName ?? "-",
      companyName: student.companyName ?? "-",
      periodTime: formatPeriodTime(student.startDate, student.endDate),
      academicYear: student.academicYear ?? "-",
    }));
  }, [adviseeStudent]);

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
          <div>
            <NavigationDualBar
              leftLabel="หน้าหลัก"
              leftHref="/dashboard"
              rightLabel="นัดหมายวันนิเทศ"
              rightHref="/#schedule"
            />
          </div>
        </section>
        <section className={styles.filterAndassignBar}>
            <div className={styles.filterSpace}>
                {/* เพิ่มส่วนของปุ่ม filter โดยฟิลเตอร์ใช้ academicYear */}
            </div>
            <section className={styles.assignStudentBar}>
                ?
            </section>
        </section>
        <section className={styles.studentCard}>
          {studentinfo.map((student, index) => (
            <StudentCard key={student.studentCode ?? index} student={student} />
          ))}
        </section>
        <div className={styles.pagination}></div>
      </div>
    </div>
  );
}
