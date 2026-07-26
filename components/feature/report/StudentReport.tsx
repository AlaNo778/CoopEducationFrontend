"use client";
import { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import styles from "./StudentReport.module.css";
import { FaRegEye } from "react-icons/fa";

import {
  fetchReportAndThesis,
  uploadReport,
  fetchDocumentExist,
} from "../../../services/docService";
import NavigationDualBar from "@/components/layout/NavigationDualBar";

type DocItem = {
  key: string;
  iconClass: string;
  title: string;
  description: string;
  docId?: number;
};

const documents: DocItem[] = [
  {
    key: "weekly-report-1",
    iconClass: "docIconCyan",
    title: "Sc.สก-12 สัปดาห์ที่ 1",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 1",
    docId: 32,
  },
  {
    key: "weekly-report-2",
    iconClass: "docIconRose",
    title: "Sc.สก-12 สัปดาห์ที่ 2",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 2",
    docId: 33,
  },
  {
    key: "weekly-report-3",
    iconClass: "docIconPurple",
    title: "Sc.สก-12 สัปดาห์ที่ 3",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 3",
    docId: 34,
  },
  {
    key: "weekly-report-4",
    iconClass: "docIconAmber",
    title: "Sc.สก-12 สัปดาห์ที่ 4",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 4",
    docId: 35,
  },
  {
    key: "weekly-report-5",
    iconClass: "docIconRose",
    title: "Sc.สก-12 สัปดาห์ที่ 5",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 5",
    docId: 36,
  },
  {
    key: "weekly-report-6",
    iconClass: "docIconIndigo",
    title: "Sc.สก-12 สัปดาห์ที่ 6",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 6",
    docId: 37,
  },
  {
    key: "weekly-report-7",
    iconClass: "docIconEmerald",
    title: "Sc.สก-12 สัปดาห์ที่ 7",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 7",
    docId: 38,
  },
  {
    key: "weekly-report-8",
    iconClass: "docIconYellow",
    title: "Sc.สก-12 สัปดาห์ที่ 8",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 8",
    docId: 39,
  },
  {
    key: "weekly-report-9",
    iconClass: "docIconIndigo",
    title: "Sc.สก-12 สัปดาห์ที่ 9",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 9",
    docId: 40,
  },
  {
    key: "weekly-report-10",
    iconClass: "docIconCyan",
    title: "Sc.สก-12 สัปดาห์ที่ 10",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 10",
    docId: 41,
  },
  {
    key: "weekly-report-11",
    iconClass: "docIconLime",
    title: "Sc.สก-12 สัปดาห์ที่ 11",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 11",
    docId: 42,
  },
  {
    key: "weekly-report-12",
    iconClass: "docIconAmber",
    title: "Sc.สก-12 สัปดาห์ที่ 12",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 12",
    docId: 43,
  },
  {
    key: "weekly-report-13",
    iconClass: "docIconRose",
    title: "Sc.สก-12 สัปดาห์ที่ 13",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 13",
    docId: 44,
  },
  {
    key: "weekly-report-14",
    iconClass: "docIconViolet",
    title: "Sc.สก-12 สัปดาห์ที่ 14",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 14",
    docId: 45,
  },
  {
    key: "weekly-report-15",
    iconClass: "docIconEmerald",
    title: "Sc.สก-12 สัปดาห์ที่ 15",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 15",
    docId: 46,
  },
  {
    key: "weekly-report-16",
    iconClass: "docIconSky",
    title: "Sc.สก-12 สัปดาห์ที่ 16",
    description: "เอกสารรายงานประจำสัปดาห์ที่ 16",
    docId: 47,
  },
];

export default function StudentReport() {
  const [uploadedDocIds, setUploadedDocIds] = useState<number[]>([]);
  const [uploadReportDocId, setUploadReportDocId] = useState<number | null>(
    null,
  );

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
        setUploadReportDocId(docId);

        const result = await uploadReport(file, docId);
        console.log("Upload result:", result);

        const ids = await fetchDocumentExist();
        setUploadedDocIds(ids);

        alert(`อัพโหลด "${doc.title}" สำเร็จแล้ว`);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("อัพโหลดไม่สำเร็จ กรุณาลองใหม่");
      } finally {
        setUploadReportDocId(null);
      }
    };

    fileInput.click();
  }

  async function handlePreviewDocument(doc: DocItem) {
    if (!doc.docId) return;

    try {
      const fileUrl = await fetchReportAndThesis(doc.docId);
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
        <div className={styles.sectionHeader}>
          <div>
            <h1 className={styles.welcomeTitle}>ส่งรายงานประจำสัปดาห์</h1>
            <p className={styles.welcomeSubtitle}>
              บันทึกและส่งรายงานการปฏิบัติงานรายสัปดาห์
            </p>
          </div>
        </div>
      </section>
      <section className={styles.docSection}>
        <section className={styles.content}>
          <section>
            <div>
              <NavigationDualBar
                leftLabel="หน้าหลัก"
                leftHref="/dashboard"
                rightLabel="รูปเล่มรายงาน"
                rightHref="/report"
              />
            </div>
          </section>
          <section className={styles.bgGrid}>
            <div className={styles.docGrid}>
              {documents.map((doc) => (
                <div key={doc.key} className={`${styles.docCard}`}>
                  <div className={`${styles.docIcon} ${styles[doc.iconClass]}`}>
                    <span className={styles.docIconLabel}>PDF</span>
                  </div>

                  <div className={styles.docInfo}>
                    <h3 className={styles.docTitle}>{doc.title}</h3>
                    <p className={styles.docDescription}>{doc.description}</p>
                  </div>
                  <div className={styles.docActions}>
                    {doc.docId && (
                      <button
                        type="button"
                        className={styles.docBtnSendDoc}
                        onClick={() => handleSendDocument(doc)}
                        disabled={
                          uploadReportDocId !== null &&
                          uploadReportDocId !== doc.docId
                        }
                      >
                        {uploadReportDocId === doc.docId ? (
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
                            <span style={{ marginLeft: 6 }}>
                              กำลังอัปโหลด...
                            </span>
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
                    {doc.docId && uploadedDocIds.includes(doc.docId) && (
                      <button
                        type="button"
                        className={styles.docBtnPreview}
                        onClick={() => handlePreviewDocument(doc)}
                      >
                        <FaRegEye /> แสดงเอกสาร
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}
