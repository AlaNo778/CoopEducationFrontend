"use client";
import { useEffect, useState } from "react";
import styles from "./UsersTable.module.css";
interface UserDetailProps {
  roleId: number;
  personId: number;
}
import { LuStar } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import {
  fetchDocumentExist,
  fetchViewFileStaff,
} from "../../../services/docService";
type DocItem = {
  key: string;
  iconClass: string;
  title: string;
  description: string;
  docId?: number;
  important?: boolean;
  fullWidth?: boolean;
};
const documents: DocItem[] = [
  {
    key: "doc-intent",
    iconClass: "docIconBlue",
    title: "แบบฟอร์มแจ้งความประสงค์ไปปฏิบัติสหกิจศึกษา",
    description: "แบบฟอร์มสำหรับแจ้งความประสงค์เข้าร่วมโครงการสหกิจศึกษา",
    docId: 15,
  },
  {
    key: "sc-01",
    iconClass: "docIconRed",
    title: "Sc.สก-01",
    description: "แบบฟอร์มขอความอนุเคราะห์รับนักศึกษาเข้าปฏิบัติงานสหกิจศึกษา",
    docId: 1,
  },
  {
    key: "sc-03",
    iconClass: "docIconGreen",
    title: "Sc.สก-03",
    description: "แบบฟอร์มบันทึกข้อตกลงความร่วมมือ",
    docId: 3,
  },
  {
    key: "sc-04",
    iconClass: "docIconOrange",
    title: "Sc.สก-04",
    description: "แบบฟอร์มรายละเอียดการปฏิบัติงานสหกิจศึกษา",
    docId: 4,
  },
  {
    key: "sc-06",
    iconClass: "docIconRed",
    title: "Sc.สก-06",
    description: "แบบฟอร์มแจ้งยืนยันการนิเทศสหกิจศึกษา",
    docId: 6,
  },
  {
    key: "sc-07",
    iconClass: "docIconGreen",
    title: "Sc.สก-07",
    description: "แบบฟอร์มประเมินรายงานสหกิจศึกษา",
    docId: 7,
  },
  {
    key: "sc-08",
    iconClass: "docIconViolet",
    title: "Sc.สก-08",
    description: "แบบฟอร์มสรุปผลการประเมินการเข้าร่วมสหกิจศึกษา",
    docId: 8,
  },
  {
    key: "sc-09",
    iconClass: "docIconTeal",
    title: "Sc.สก-09",
    description: "แบบฟอร์มบันทึกการนิเทศงาน",
    docId: 9,
  },
  {
    key: "sc-10",
    iconClass: "docIconPink",
    title: "Sc.สก-10",
    description:
      "แบบฟอร์มประเมินองค์กรผู้ใช้บัณฑิตที่เข้าร่วมโครงการสหกิจศึกษาโดยอาจารย์ที่ปรึกษา",
    docId: 10,
  },
  {
    key: "sc-11",
    iconClass: "docIconGreen",
    title: "Sc.สก-11",
    description: "แบบฟอร์มประเมินผลการปฏิบัติงานโดยพนักงานพี่เลี้ยง",
    docId: 11,
  },
  {
    key: "sc-12",
    iconClass: "docIconPink",
    title: "Sc.สก-12",
    description: "แบบฟอร์มประเมินผลการปฏิบัติงานโดยอาจารย์นิเทศ",
    docId: 12,
  },
  {
    key: "sc-13",
    iconClass: "docIconBlue",
    title: "Sc.สก-13",
    description: "แบบฟอร์มประเมินสถานประกอบการ",
    docId: 13,
  },
  {
    key: "sc-14",
    iconClass: "docIconRed",
    title: "Sc.สก-14",
    description: "แบบฟอร์มรายงานผลการปฏิบัติงานสหกิจศึกษา",
    docId: 14,
  },
  {
    key: "consent",
    iconClass: "docIconTeal",
    title: "หนังสือยินยอมให้นักศึกษาไปปฏิบัติสหกิจศึกษา/ฝึกประสบการณ์ทำงาน",
    description:
      "เอกสารหนังสือยินยอมจากผู้ปกครองสำหรับนักศึกษาที่จะเข้าร่วมโครงการสหกิจศึกษา",
    docId: 31,
  },
  {
    key: "supervision-appointment",
    iconClass: "docIconBlue",
    title: "แบบฟอร์มนัดหมายการนิเทศสหกิจศึกษา",
    description:
      "แบบฟอร์มสำหรับนัดหมายการนิเทศสหกิจศึกษาระหว่างอาจารย์นิเทศและสถานประกอบการ",
    docId: 58,
  },
  {
    key: "travel-approval",
    iconClass: "docIconOrange",
    title: "แบบขออนุมัติเดินทางกรณีอาจารย์นิเทศสหกิจศึกษาแบบ Onsite",
    description:
      "เอกสารสำหรับขออนุมัติเดินทางไปนิเทศสหกิจศึกษา ณ สถานประกอบการ",
    docId: 57,
  },
];

export default function UserDetail({ roleId, personId }: UserDetailProps) {
  const [uploadedDocIds, setUploadedDocIds] = useState<number[]>([]);
  const role = roleId === 1 ? "teacher" : "student";
  useEffect(() => {
    let mounted = true;
    fetchDocumentExist(personId, role)
      .then((ids) => {
        if (mounted) setUploadedDocIds(ids);
      })
      .catch((err) => console.error("fetchDocumentExist on mount failed", err));
    return () => {
      mounted = false;
    };
  }, [personId, role]);

  async function handlePreviewDocument(doc: DocItem) {
    if (!doc.docId) return;

    try {
      const fileUrl = await fetchViewFileStaff(role,personId,doc.docId);
      if (!fileUrl) {
        throw new Error("No file URL returned from backend");
      }

      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Preview failed:", error);
      alert("ไม่สามารถแสดงเอกสารได้ กรุณาลองใหม่");
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.welcomeContent}>
        <div>
          <div>
            <h1 className={styles.welcomeTitle}>เอกสารและแบบฟอร์ม</h1>
            <p className={styles.welcomeSubtitle}>
              บันทึกและส่งรายงานการปฏิบัติงานรายสัปดาห์
            </p>
          </div>
        </div>
      </section>
      <section className={styles.docSection} aria-label="เอกสารและแบบฟอร์ม">
        <div className={styles.docGrid}>
          {documents
            .filter(
              (doc) =>
                doc.docId !== undefined && uploadedDocIds.includes(doc.docId),
            )
            .map((doc) => (
              <div className={styles.docCard} key={doc.key}>
                <div className={`${styles.docIcon} ${styles[doc.iconClass]}`}>
                    <span className={styles.docIconLabel}>PDF</span>
                  </div>
                <div className={styles.docInfo}>
                  <h3 className={styles.docTitle}>{doc.title}</h3>
                  <p className={styles.docDescription}>{doc.description}</p>
                  {doc.important && (
                    <span className={styles.docImportantBadge}>
                      <LuStar /> สำคัญ
                    </span>
                  )}
                </div>

                <div className={styles.docActions}>
                  <button
                    type="button"
                    className={styles.docBtnPreview}
                    onClick={() => handlePreviewDocument(doc)}
                  >
                    <FaRegEye /> แสดงเอกสาร
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
