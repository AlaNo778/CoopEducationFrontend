"use client";
import styles from "./Dashboard.module.css";
import type { UserInfo } from "@/lib/auth";
import {
  LuBookOpen,
  LuArrowRight,
} from "react-icons/lu";
type Props = {
  userInfo: UserInfo | null;
};

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
    key: "teacher",
    icon: <LuBookOpen />,
    iconClass: "featIconBlue",
    title: "ข้อมูลเอกสารอาจารย์",
    description: "ดูรายละเอียดเอกสารสำหรับอาจารย์",
    href: "/usersTable/1",
  },
  {
    key: "student",
    icon: <LuBookOpen />,
    iconClass: "featIconPurple",
    title: "ข้อมูลเอกสารนักศึกษา",
    description: "ดูรายละเอียดเอกสารสำหรับนักศึกษา",
    href: "/usersTable/2",
  }
];

export default function StaffDashboard({ userInfo }: Props) {
  const fullName = userInfo?.fullName ?? "—";
  return (
    <div className={styles.page}>
      <section className={styles.welcomeBanner} aria-label="ยินดีต้อนรับ">
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>ยินดีต้อนรับ, {fullName}</h1>
          <p className={styles.welcomeSubtitle}>
            จัดการข้อมูลสหกิจศึกษาของคุณได้ที่นี่
          </p>
        </div>
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
    </div>
  );
}
