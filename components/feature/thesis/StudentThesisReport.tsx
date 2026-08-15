"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./StudentThesisReport.module.css";
import { FaFilePdf } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
// import NavigationDualBar from "@/components/layout/NavigationDualBar";
import {
  fetchReportAndThesis,
  uploadReport,
  fetchDocumentThesisExist,
  DocumentExistDto,
  fetchExistingReplyDocStatus,
} from "../../../services/docService";

type DocItem = {
  timeLine: string;
  title: string;
  description: string;
  docId?: number;
};

const filterDocId = [48, 49, 50, 51, 55];

const documents: DocItem[] = [
  {
    timeLine: "1/1/2569",
    title: "Thesis Draf 1",
    description: "เอกสารวิทยานิพนธ์แบบร่างที่ 1",
    docId: 48,
  },
  {
    timeLine: "5/1/2569",
    title: "Reply Thesis Draf 1",
    description: "เอกสารตอบกลับวิทยานิพนธ์แบบร่างที่ 1",
    docId: 51,
  },
  {
    timeLine: "10/1/2569",
    title: "Thesis Draf 2",
    description: "เอกสารวิทยานิพนธ์แบบร่างที่ 2",
    docId: 49,
  },
  {
    timeLine: "15/1/2569",
    title: "Reply Thesis Draf 2",
    description: "เอกสารตอบกลับวิทยานิพนธ์แบบร่างที่ 2",
    docId: 55,
  },
  {
    timeLine: "20/1/2569",
    title: "Thesis Final",
    description: "เอกสารวิทยานิพนธ์ที่ฉบับสมบูณร์",
    docId: 50,
  },
];

const getStatusMeta = (approved?: boolean) => {
  if (approved) {
    return {
      icon: <FaCheck />,
      label: "ตรวจสอบแล้ว",
      toneClass: styles.toneDone,
    };
  }
  return {
    icon: <FaFilePdf />,
    label: "รอดำเนินการ",
    toneClass: styles.tonePdf,
  };
};

async function fetchReplyDocStatus(): Promise<number[]> {
  const data = await fetchExistingReplyDocStatus();
  return data;
}

export default function StudentThesisReport() {
  const [uploadedDocIds, setUploadedDocIds] = useState<DocumentExistDto[]>([]);
  const [uploadReportDocId, setUploadReportDocId] = useState<number | null>(
    null,
  );
  const [replyDocStatus, setReplyDocStatus] = useState<number[]>([]);

  const mountedRef = useRef(true);

  // รวม logic fetch + filter ไว้ที่เดียว ใช้ได้ทั้งตอน mount และหลังอัปโหลดเสร็จ
  const refreshUploadedDocs = useCallback(async () => {
    const docs = await fetchDocumentThesisExist();
    const filteredDocs = docs.filter((d) => filterDocId.includes(d.docTypeId));
    if (mountedRef.current) {
      setUploadedDocIds(filteredDocs);
    }
    return filteredDocs;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refreshUploadedDocs().catch((err) =>
      console.error("fetchDocumentExist on mount failed", err),
    );
    return () => {
      mountedRef.current = false;
    };
  }, [refreshUploadedDocs]);

  useEffect(() => {
    let mounted = true;
    fetchReplyDocStatus()
      .then((status) => {
        if (mounted) setReplyDocStatus(status);
      })
      .catch((err) => console.error("fetchReplyDocStatus failed", err));
    return () => {
      mounted = false;
    };
  }, []);

  // หา record ที่ตรงกับ docId เพื่อดึงสถานะ approved จริงจากข้อมูลที่ fetch มา
  const getUploadedDoc = (docId?: number) =>
    uploadedDocIds.find((d) => d.docTypeId === docId);

  const isReplyDoc = (docId?: number) => docId === 51 || docId === 55;

  const isPreviousBlockApproved = (docId?: number) => {
    if (docId === 49) {
      return getUploadedDoc(48)?.approved === true;
    }

    if (docId === 50) {
      return getUploadedDoc(49)?.approved === true;
    }
    return true;
  };

  const shouldShowViewButton = (doc: DocItem) => {
    if (!doc.docId) return false;

    if (isReplyDoc(doc.docId)) {
      return replyDocStatus.includes(doc.docId);
    }

    return Boolean(getUploadedDoc(doc.docId));
  };

  const shouldShowUploadButton = (doc: DocItem) => {
    if (!doc.docId) return false;

    if (isReplyDoc(doc.docId)) {
      return false;
    }

    const uploadedDoc = getUploadedDoc(doc.docId);
    if (uploadedDoc) {
      return false;
    }

    return isPreviousBlockApproved(doc.docId);
  };
  const isProcessCompleted = getUploadedDoc(50)?.approved === true;

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

        await uploadReport(file, docId,null);

        await refreshUploadedDocs();

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
      const fileUrl = await fetchReportAndThesis(doc.docId,null);
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
            <h1 className={styles.welcomeTitle}>ส่งรูปเล่มรายงาน</h1>
            <p className={styles.welcomeSubtitle}>
              อัปโหลดรูปเล่มรายงานฉบับสมบูรณ์
            </p>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <section>
          {/* <NavigationDualBar
            leftLabel="หน้าหลัก"
            leftHref="/dashboard"
            rightLabel="ข้อมูลโปรไฟล์"
            rightHref="/profile"
          /> */}
        </section>
        <section className={styles.contener}>
          <section className={styles.timeline}>
            <div className={styles.timelineHeader}>
              <span className={styles.timelineEyebrow}>ภาพรวมกระบวนการ</span>
              <h3 className={styles.timelineTitle}>เส้นทางการส่งเอกสาร</h3>
            </div>

            <div className={styles.track}>
              <div className={styles.mainLine} aria-hidden="true" />
              {documents.map((doc, index) => {
                const side = index % 2 === 0 ? "right" : "left";
                const uploadedDoc = getUploadedDoc(doc.docId);
                const showViewButton = shouldShowViewButton(doc);
                const showUploadButton = shouldShowUploadButton(doc);
                const isReply = isReplyDoc(doc.docId);
                const meta = isReply
                  ? {
                      icon: showViewButton ? <FaCheck /> : <FaFilePdf />,
                      label: "",
                      toneClass: showViewButton
                        ? styles.toneDone
                        : styles.tonePdf,
                    }
                  : getStatusMeta(uploadedDoc?.approved);

                return (
                  <div
                    key={doc.docId ?? index}
                    className={`${styles.row} ${
                      side === "right" ? styles.rowRight : styles.rowLeft
                    }`}
                  >
                    <div className={styles.circle}>
                      <div
                        className={`${styles.innerCircle} ${meta.toneClass}`}
                      >
                        {meta.icon}
                      </div>
                    </div>

                    <div className={styles.cardWrap}>
                      <span className={styles.branchDate}>{doc.timeLine}</span>
                      <article className={styles.card}>
                        <header className={styles.cardHeader}>
                          <h4 className={styles.cardTitle}>{doc.title}</h4>
                          {(!showUploadButton || showViewButton) &&
                            !isReply && (
                              <span
                                className={`${styles.statusPill} ${meta.toneClass}`}
                              >
                                {meta.label}
                              </span>
                            )}
                          {/* {!isReply && (
                            <span
                              className={`${styles.statusPill} ${meta.toneClass}`}
                            >
                              {meta.label}
                            </span>
                          )} */}
                        </header>
                        <p className={styles.cardDescription}>
                          {doc.description}
                        </p>
                        <div className={styles.cardActions}>
                          {showUploadButton && (
                            <button
                              type="button"
                              className={styles.uploadBtn}
                              onClick={() => handleSendDocument(doc)}
                              disabled={uploadReportDocId === doc.docId}
                            >
                              {uploadReportDocId === doc.docId
                                ? "กำลังอัปโหลด..."
                                : "อัปโหลดไฟล์"}
                            </button>
                          )}
                          {showViewButton && (
                            <button
                              type="button"
                              className={styles.viewBtn}
                              onClick={() => handlePreviewDocument(doc)}
                            >
                              ดูเอกสาร
                            </button>
                          )}
                        </div>
                      </article>
                    </div>
                  </div>
                );
              })}

              <div className={styles.endRow}>
                <div
                  className={`${styles.endCircle} ${
                    isProcessCompleted ? styles.endCircleGreen : ""
                  }`}
                >
                  <FaCheck />
                </div>
              </div>
            </div>
            <p className={styles.endLabel}>การส่งเอกสารครบถ้วน</p>
          </section>
        </section>
      </section>
    </div>
  );
}
