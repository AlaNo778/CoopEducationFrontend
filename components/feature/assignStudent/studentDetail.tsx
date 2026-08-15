"use client";
import { useState, useEffect } from "react";
import {
  AdviseeStudentsDTO,
  fetchStudentDetail,
  fetchExistingReport,
} from "../../../services/teacherService";
import styles from "./studentDetail.module.css";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import {
  fetchReportAndThesis,
  uploadReport,
  UpdateStatusFinalThesis,
} from "../../../services/docService";

interface Props {
  studentCode: string;
}
interface fileItem {
  docId: number;
  docType: string;
}

const weeklyReport: fileItem[] = [
  ...Array.from({ length: 16 }, (_, index) => ({
    docId: 32 + index,
    docType: `เอกสารรายงานประจำสัปดาห์ที่ ${index + 1}`,
  })),
];

const thesis: fileItem[] = [
  { docId: 48, docType: "เอกสารวิทยานิพนธ์แบบร่างที่ 1" },
  { docId: 51, docType: "เอกสารตอบกลับวิทยานิพนธ์ที่ 1" },
  { docId: 49, docType: "เอกสารวิทยานิพนธ์แบบร่างที่ 2" },
  { docId: 55, docType: "เอกสารตอบกลับวิทยานิพนธ์ที่ 2" },
  { docId: 50, docType: "เอกสารวิทยานิพนธ์ที่ฉบับสมบูณร์" },
];

const IconUser = () => (
  <svg
    className={styles.iconUser}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7" fill="currentColor" />
  </svg>
);

export default function StudentDetail({ studentCode }: Props) {
  const [student, setStudent] = useState<AdviseeStudentsDTO | null>(null);
  const [existingDoc, setExistingDoc] = useState<number[]>([]);
  const [loadingDocId, setLoadingDocId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data] = await Promise.all([fetchStudentDetail(studentCode)]);
        setStudent(data);
        const listDocId = await fetchExistingReport(studentCode);
        setExistingDoc(listDocId);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [studentCode]);

  // เรียก API เพื่อขอ url แบบ single use แล้วเปิดแท็บใหม่
  const handleViewDoc = async (docId: number, studentCode: string) => {
    if (loadingDocId !== null) return; // กันการกดซ้ำซ้อนระหว่างรอ URL
    if (docId==50) {
      try {
        setLoadingDocId(docId);
        await UpdateStatusFinalThesis(docId, studentCode);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDocId(null);
      }
    };
    try {
      // setLoadingDocId(docId);
      const url = await fetchReportAndThesis(docId, studentCode);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDocId(null);
    }
  };

  const handleSendFeedback = async (docId: number, studentCode: string) => {
    if (!docId) return;

    const fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.accept = ".pdf";

    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      try {
        await uploadReport(file, docId, studentCode);

        alert("อัพโหลดสำเร็จแล้ว");
      } catch (error) {
        console.error("Upload failed:", error);
        alert("อัพโหลดไม่สำเร็จ กรุณาลองใหม่");
      }
    };

    // ต้องอยู่นอก onchange
    fileInput.click();
  };

  if (!student) {
    return <div>กำลังโหลด...</div>;
  }

  // เอกสารรายงานประจำสัปดาห์ที่นักศึกษาส่งแล้วเท่านั้น (docId ตรงกับ existingDoc)
  const submittedWeeklyReports = weeklyReport.filter((item) =>
    existingDoc.includes(item.docId),
  );
  const displayThesis: fileItem[] = [];

  if (existingDoc.includes(48)) {
    displayThesis.push(thesis.find((t) => t.docId === 48)!);
    displayThesis.push(thesis.find((t) => t.docId === 51)!);
  }

  if (existingDoc.includes(49)) {
    displayThesis.push(thesis.find((t) => t.docId === 49)!);
    displayThesis.push(thesis.find((t) => t.docId === 55)!);
  }

  if (existingDoc.includes(50)) {
    displayThesis.push(thesis.find((t) => t.docId === 50)!);
  }

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.header}>
          <section>
            <h1 className={styles.title}>รายงานนักศึกษา</h1>
            <p className={styles.subTitle}>
              รายละเอียดแลวามคืบหน้าการส่งเอกสารของนักศึกษา
            </p>
          </section>
        </div>
        <section className={styles.cardInfo}>
          <div className={styles.info}>
            <div className={styles.circle}>
              <div className={styles.inCircle}>
                <IconUser />
              </div>
            </div>
            <div>
              <div className={styles.fullName}>
                <h1>
                  {student.firstName} {student.lastName}
                </h1>
              </div>
              <div className={styles.majorAndStdCode}>
                <p>{student.majorName}</p>
                <p>{student.studentCode}</p>
              </div>
              <div className={styles.company}>
                <p>{student.companyName}</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <p>ข้อมูลเกี่ยวกับนักศึกษา</p>
              <div className={styles.stdinfo}>
                <div className={styles.std}>
                  <p>
                    <strong>รหัสนักศึกษา:</strong> {student.studentCode}
                  </p>
                  <p>
                    <strong>ชื่อ:</strong> {student.firstName}{" "}
                    {student.lastName}
                  </p>
                  <p>
                    <strong>อีเมล:</strong> {student.email}
                  </p>
                  <p>
                    <strong>คณะ:</strong> {student.faculty}
                  </p>
                  <p>
                    <strong>สาขา:</strong> {student.majorName}
                  </p>
                  <p>
                    <strong>GPAX:</strong> {student.gpax}
                  </p>
                  <p>
                    <strong>หน่วยกิตสะสม:</strong> {student.totalCredits}
                  </p>
                  <p>
                    <strong>เบอร์บ้าน:</strong> {student.phoneHome}
                  </p>
                  <p>
                    <strong>เบอร์มือถือ:</strong> {student.phoneMobile}
                  </p>
                  <p>
                    <strong>Facebook:</strong> {student.facebook}
                  </p>
                  <p>
                    <strong>Line ID:</strong> {student.lineId}
                  </p>
                </div>
                <span className={styles.divide}></span>
                <div className={styles.cominfo}>
                  <p>
                    <strong>บริษัท:</strong> {student.companyName}
                  </p>
                  <p>
                    <strong>ตำแหน่ง:</strong> {student.jobTitle}
                  </p>
                  <p>
                    <strong>ลักษณะงาน:</strong> {student.jobDescription}
                  </p>
                  <p>
                    <strong>แผนก:</strong> {student.department}
                  </p>
                  <p>
                    <strong>ปีการศึกษา:</strong> {student.academicYear}
                  </p>
                  <p>
                    <strong>วันที่เริ่ม:</strong> {student.startDate}
                  </p>
                  <p>
                    <strong>วันที่สิ้นสุด:</strong> {student.endDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <div>
              <div className={styles.cardTitle}>
                <p>รายงานประจำสัปดาห์</p>
              </div>
              <div className={styles.fileSpace}>
                {submittedWeeklyReports.length > 0 ? (
                  submittedWeeklyReports.map((item) => (
                    <div className={styles.cardFile} key={item.docId}>
                      <div className={styles.box}>
                        <HiOutlineDocumentReport />
                      </div>
                      <div className={styles.fileName}>{item.docType}</div>
                      <div
                        className={styles.viewIcon}
                        role="button"
                        aria-label={`ดู ${item.docType}`}
                        style={{
                          cursor:
                            loadingDocId === item.docId ? "wait" : "pointer",
                          opacity: loadingDocId === item.docId ? 0.5 : 1,
                        }}
                        onClick={() =>
                          handleViewDoc(item.docId, student.studentCode)
                        }
                      >
                        <FaRegEye />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>ยังไม่มีเอกสารที่ส่ง</p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <div>
              <div className={styles.cardTitle}>
                <p>รูปเล่มรายงาน</p>
              </div>
              <div className={styles.fileSpace}>
                {displayThesis.length > 0 ? (
                  displayThesis.map((item) => (
                    <div className={styles.cardFile} key={item.docId}>
                      <div className={styles.box}>
                        <HiOutlineDocumentReport />
                      </div>

                      <div className={styles.fileName}>{item.docType}</div>

                      {item.docId === 51 || item.docId === 55 ? (
                        <div
                          className={styles.sendIcon}
                          role="button"
                          aria-label={`ส่ง ${item.docType}`}
                          onClick={() =>
                            handleSendFeedback(item.docId, student.studentCode)
                          }
                        >
                          <IoPaperPlaneOutline />
                        </div>
                      ) : (
                        <div
                          className={styles.viewIcon}
                          role="button"
                          aria-label={`ดู ${item.docType}`}
                          style={{
                            cursor:
                              loadingDocId === item.docId ? "wait" : "pointer",
                            opacity: loadingDocId === item.docId ? 0.5 : 1,
                          }}
                          onClick={() =>
                            handleViewDoc(item.docId, student.studentCode)
                          }
                        >
                          <FaRegEye />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>ยังไม่มีเอกสารที่ส่ง</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
