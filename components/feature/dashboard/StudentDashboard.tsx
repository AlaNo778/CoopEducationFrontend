'use client'
import styles from "./StudentDashboard.module.css";
import {
  LuFileText,
  LuBuilding2,
  LuUser,
  LuContact,
  LuCalendarDays,
  LuClipboardList,
  LuBookOpen,
  LuArrowRight,
  LuDownload,
  LuEye,
  LuStar, 
} from "react-icons/lu";
import { FiSend } from "react-icons/fi";
import { fetchDocument,fetchAllDocuments } from "../../../services/docService";
import type { UserInfo } from "@/lib/auth";

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
    description: "จัดการข้อมูลส่วนตัวและประวัติการศึกษา",
    href: "#",
  },
  {
    key: "company-info",
    icon: <LuBuilding2 />,
    iconClass: "featIconPurple",
    title: "ข้อมูลสถานสหกิจ",
    description: "ดูรายละเอียดสถานประกอบการที่ปฏิบัติงาน",
    href: "#",
  },
  {
    key: "supervisor-appointment",
    icon: <LuCalendarDays />,
    iconClass: "featIconOrange",
    title: "นัดหมายวันนิเทศ",
    description: "จัดการนัดหมายการนิเทศงาน",
    href: "#",
  },
  {
    key: "weekly-report",
    icon: <LuClipboardList />,
    iconClass: "featIconTeal",
    title: "ส่งรายงานประจำสัปดาห์",
    description: "บันทึกและส่งรายงานการปฏิบัติงานรายสัปดาห์",
    href: "#",
  },
  {
    key: "final-report",
    icon: <LuBookOpen />,
    iconClass: "featIconPink",
    title: "ส่งรูปเล่มรายงาน",
    description: "อัปโหลดรูปเล่มรายงานฉบับสมบูรณ์",
    href: "#",
  },
];

/* ============ Section 3: เอกสารและแบบฟอร์ม ============ */
type DocItem = {
  key: string;
  iconClass: string;
  title: string;
  description: string;
  hrefSendDoc: string;
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
    hrefSendDoc: "#",
  },
  {
    key: "sc-01",
    iconClass: "docIconRed",
    title: "Sc.สก-01",
    description: "แบบฟอร์มขอความอนุเคราะห์รับนักศึกษาเข้าปฏิบัติงานสหกิจศึกษา",
    hrefSendDoc: "#",
    docId: 1,
  },
  {
    key: "sc-03",
    iconClass: "docIconGreen",
    title: "Sc.สก-03",
    description: "แบบฟอร์มบันทึกข้อตกลงความร่วมมือ",
    hrefSendDoc: "#",
    docId: 3,
  },
  {
    key: "sc-04",
    iconClass: "docIconOrange",
    title: "Sc.สก-04",
    description: "แบบฟอร์มรายละเอียดการปฏิบัติงานสหกิจศึกษา",
    hrefSendDoc: "#",
    docId: 4,
  },
  {
    key: "sc-11",
    iconClass: "docIconGreen",
    title: "Sc.สก-11",
    description: "แบบฟอร์มประเมินผลการปฏิบัติงานโดยพนักงานพี่เลี้ยง",
    hrefSendDoc: "#",
    docId: 11,
  },
  {
    key: "sc-12",
    iconClass: "docIconPink",
    title: "Sc.สก-12",
    description: "แบบฟอร์มประเมินผลการปฏิบัติงานโดยอาจารย์นิเทศ",
    hrefSendDoc: "#",
    docId: 12,
  },
  {
    key: "sc-13",
    iconClass: "docIconBlue",
    title: "Sc.สก-13",
    description: "แบบฟอร์มประเมินสถานประกอบการ",
    hrefSendDoc: "#",
    docId: 13,
  },
  {
    key: "sc-14",
    iconClass: "docIconRed",
    title: "Sc.สก-14",
    description: "แบบฟอร์มรายงานผลการปฏิบัติงานสหกิจศึกษา",
    hrefSendDoc: "#",
    docId: 14,
  },
  {
    key: "consent",
    iconClass: "docIconTeal",
    title: "หนังสือยินยอมให้นักศึกษาไปปฏิบัติสหกิจศึกษา/ฝึกประสบการณ์ทำงาน",
    description: "เอกสารหนังสือยินยอมจากผู้ปกครองสำหรับนักศึกษาที่จะเข้าร่วมโครงการสหกิจศึกษา",
    hrefSendDoc: "#",
    docId: 31,
    important: true,
    fullWidth: true,
  },
];

type Props = {
  userInfo: UserInfo | null;
};

export default function StudentDashboard({ userInfo }: Props) {
  const fullName = userInfo?.fullName ?? "—";

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
          <p className={styles.welcomeSubtitle}>จัดการข้อมูลสหกิจศึกษาของคุณได้ที่นี่</p>
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
            <button className={styles.btnDownloadAll} type="button" onClick={() => handleDownloadAll()}>
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

                    {doc.hrefSendDoc && (
                      <a href={doc.hrefSendDoc} className={styles.docBtnSendDoc}>
                        <FiSend /> ส่งเอกสาร
                      </a>
                    )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
