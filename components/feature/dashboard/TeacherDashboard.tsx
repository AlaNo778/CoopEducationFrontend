"use client";
import styles from "./Dashboard.module.css";
import {
  LuFileText,
  LuUser,
  LuCalendarDays,
  // LuClipboardList,
  // LuBookOpen,
  LuArrowRight,
  LuDownload,
  LuStar,
  LuUsersRound,
} from "react-icons/lu";
import { FiUploadCloud } from "react-icons/fi";
import {
  fetchDocument,
  fetchAllDocuments,
  uploadDocument,
  fetchDocumentExist,
} from "../../../services/docService";
import type { UserInfo } from "@/lib/auth";
import { useEffect, useState } from "react";

/* ============ Section 2: ฟังก์ชันหลัก ============ */
type Feature = {
  key: string;
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
  href: string;
};

const features: Feature[] = [
  {
    key: "profile",
    icon: <LuUser />,
    iconClass: "featIconBlue",
    title: "ข้อมูลโปรไฟล์",
    description: "จัดการข้อมูลส่วนตัวและข้อมูลติดต่อ",
    href: "/profile",
  },
  {
    key: "assign-students-to-advisor",
    icon: <LuUsersRound />,
    iconClass: "featIconCyan",
    title: "การจัดนักศึกษาเข้าที่ปรึกษา",
    description:
      "จัดการการมอบหมายและกำหนดอาจารย์ที่ปรึกษาให้กับนักศึกษาในแต่ละภาคการศึกษา",
    href: "/assign-student",
  },
  {
    key: "supervisor-appointment",
    icon: <LuCalendarDays />,
    iconClass: "featIconOrange",
    title: "นัดหมายวันนิเทศ",
    description: "จัดการนัดหมายการนิเทศงาน",
    href: "#",
  },
  // {
  //   key: "weekly-report-student",
  //   icon: <LuClipboardList />,
  //   iconClass: "featIconTeal",
  //   title: "รายงานประจำสัปดาห์นักศึกษา",
  //   description: "บันทึกและส่งรายงานการปฏิบัติงานรายสัปดาห์ของนักศึกษา",
  //   href: "/weeklyReport-student",
  // },
  // {
  //   key: "final-report",
  //   icon: <LuBookOpen />,
  //   iconClass: "featIconPink",
  //   title: "รูปเล่มรายงานนักศึกษา",
  //   description: "รูปเล่มรายงานฉบับสมบูรณ์",
  //   href: "/report-student",
  // },
];
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
    important: true,
    fullWidth: true,
  },
];
type Props = {
  userInfo: UserInfo | null;
};

export default function TeacherDashboard({ userInfo }: Props) {
  const fullName = userInfo?.fullName ?? "—";
  const [uploadedDocIds, setUploadedDocIds] = useState<number[]>([]);
  const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);

  async function handleSendDocument(doc: DocItem) {
    if (!doc.docId) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";

    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      const docId = doc.docId;
      if (!docId) return;

      try {
        setUploadingDocId(docId);

        const result = await uploadDocument(file, docId);
        console.log("Upload result:", result);
        alert(`อัพโหลด "${doc.title}" สำเร็จแล้ว`);
        setUploadedDocIds((prev) =>
          prev.includes(docId) ? prev : [...prev, docId],
        );
      } catch (error) {
        console.error("Upload failed:", error);
        alert("อัพโหลดไม่สำเร็จ กรุณาลองใหม่");
      } finally {
        setUploadingDocId(null);
      }
    };

    fileInput.click();
  }

  useEffect(() => {
    let mounted = true;
    fetchDocumentExist()
      .then((ids) => {
        if (mounted) setUploadedDocIds(ids);
      })
      .catch((err) => console.error("fetchDocumentExist on mount failed", err));
    return () => {
      mounted = false;
    };
  }, []);

  async function handleDownload(doc: DocItem) {
    if (!doc.docId) return;
    try {
      const blob = await fetchDocument(doc.docId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = doc.title.replace(/[^a-z0-9ก-๙ _-]/gi, "-");
      a.download = `${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error("Download failed", error);
    }
  }

  async function handleDownloadAll() {
    try {
      const blob = await fetchAllDocuments();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `All_Documents.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error("Download all failed", error);
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.welcomeBanner} aria-label="ยินดีต้อนรับ">
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>ยินดีต้อนรับ, {fullName}</h1>
          <p className={styles.welcomeSubtitle}>
            จัดการข้อมูลสหกิจศึกษาของคุณได้ที่นี่
          </p>
        </div>
        {/* วงกลมตกแต่งด้านขวา */}
        <span className={`${styles.decoCircle} ${styles.decoCircle1}`} />
        <span className={`${styles.decoCircle} ${styles.decoCircle2}`} />
        <span className={`${styles.decoCircle} ${styles.decoCircle3}`} />
      </section>

      <section className={styles.featureSection} aria-label="ฟังก์ชันหลัก">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ฟังก์ชันหลัก</h2>
        </div>

        <div className={styles.featureGrid}>
          {features.map((f) => (
            <a key={f.key} href={f.href} className={styles.featureCard}>
              <div className={styles.featureCardHeader}>
                <div className={`${styles.featureIcon} ${styles[f.iconClass]}`}>
                  {f.icon}
                </div>
                <LuArrowRight className={styles.featureArrow} />
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
            </a>
          ))}
        </div>
      </section>

      <div className={styles.docDivider}>
        <span className={styles.docDividerLine} />
        <div className={styles.docAnchorPill}>
          <LuFileText />
          เอกสารและแบบฟอร์ม
        </div>
        <span className={styles.docDividerLine} />
      </div>

      <section className={styles.docSection} aria-label="เอกสารและแบบฟอร์ม">
        <div className={styles.docHeader}>
          <h2 className={styles.docHeaderTitle}>เอกสารและแบบฟอร์ม</h2>
          <div className={styles.docHeaderActions}>
            <button
              className={styles.btnDownloadAll}
              type="button"
              onClick={() => handleDownloadAll()}
            >
              <LuDownload /> ดาวน์โหลดทั้งหมด
            </button>
          </div>
        </div>

        <div className={styles.docGrid}>
          {documents.map((doc) => (
            <div
              key={doc.key}
              className={`${styles.docCard} ${doc.fullWidth ? styles.docCardFull : ""}`}
            >
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
                {doc.docId && (
                  <button
                    type="button"
                    className={styles.docBtnDownload}
                    onClick={() => handleDownload(doc)}
                  >
                    <LuDownload /> ดาวน์โหลด
                  </button>
                )}

                {doc.docId && (
                  <button
                    type="button"
                    className={styles.docBtnSendDoc}
                    onClick={() => handleSendDocument(doc)}
                    disabled={
                      uploadingDocId !== null && uploadingDocId !== doc.docId
                    }
                  >
                    {uploadingDocId === doc.docId ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 50 50"
                          style={{ marginLeft: 8 }}
                          aria-hidden
                        >
                          <g transform="translate(25 25)">
                            <g>
                              <path
                                d="M0,-20 A20,20 0 0,1 17.32,-10"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                              />
                              <animateTransform
                                attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                from="0"
                                to="360"
                                dur="0.9s"
                                repeatCount="indefinite"
                              />
                            </g>
                          </g>
                        </svg>
                        <span style={{ marginLeft: 6 }}>กำลังอัปโหลด...</span>
                      </>
                    ) : (
                      <>
                        <FiUploadCloud />
                        <span style={{ marginLeft: 6 }}>
                          {uploadedDocIds.includes(doc.docId)
                            ? "อัปโหลดใหม่"
                            : "อัปโหลด"}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
