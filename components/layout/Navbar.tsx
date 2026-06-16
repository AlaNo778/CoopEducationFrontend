"use client";
import styles from "./Navbar.module.css";
import type { Role } from "@/types/auth";
import type { UserInfo } from "@/lib/auth";
import { LuLogIn } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { clearToken, logout } from "@/services/authService";

type Props = {
  userInfo: UserInfo | null;
};

// Map role (backend ส่งมาเป็น English lowercase) → ป้ายภาษาไทย
const ROLE_LABEL_TH: Record<Role, string> = {
  student: "นักศึกษา",
  teacher: "อาจารย์",
  staff: "เจ้าหน้าที่",
  admin: "ผู้ดูแลระบบ",
};

export default function Navbar({ userInfo }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      await clearToken();
    } catch (err) {
      console.error(err);
    }
    router.push("/login");
  };

  // ถ้าดึง userInfo ไม่ได้ (token พัง / backend ล่ม) แสดง placeholder
  // ไม่เด้งออก login ที่ชั้นนี้ เพราะ middleware จัดการ auth flow อยู่แล้ว
  const fullName = userInfo?.fullName ?? "—";
  const roleLabel = userInfo ? ROLE_LABEL_TH[userInfo.roleName] ?? "—" : "—";

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <img src="/hat-icon-p.svg" alt="Hat Icon" className={styles.brandIconImg} />
        </div>
        <div className={styles.brandNameContainer}>
          <span className={styles.brandNameMain}>ระบบสหกิจศึกษา</span>
          <span className={styles.brandNameSub}>คณะวิทยาศาสตร์</span>
        </div>
      </div>
      <div className={styles.navLinks}>
        <div className={styles.infoContainer}>
          <span className={styles.nameText}>{fullName}</span>
          <span className={styles.roletext}>{roleLabel}</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.logoutIcon}>
          <button onClick={handleLogout}>
            <LuLogIn />ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>
  );
}
