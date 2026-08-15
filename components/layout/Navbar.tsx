"use client";

import { Fragment, useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import type { Role } from "@/types/auth";
import type { UserInfo } from "@/lib/auth";
import { LuLogIn } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { clearToken, logout } from "@/services/authService";
import Image from "next/image";

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

type NavItem = {
  label: string;
  path: string;
  ariaLabel: string;
};

export default function Navbar({ userInfo }: Props) {
  const router = useRouter();

  const displayName = userInfo?.fullName ?? "—";

  const displayRole = userInfo
    ? ROLE_LABEL_TH[userInfo.roleName] ?? "—"
    : "—";

  const [updatedDisplayName, setUpdatedDisplayName] = useState<
    string | null
  >(null);

  useEffect(() => {
    const handleProfileUpdate = (event: Event) => {
      const customEvent =
        event as CustomEvent<{ fullName?: string }>;

      if (customEvent.detail?.fullName) {
        setUpdatedDisplayName(customEvent.detail.fullName);
      }
    };

    window.addEventListener(
      "profile-updated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "profile-updated",
        handleProfileUpdate
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      await clearToken();
    } catch (err) {
      console.error(err);
    }

    router.push("/login");
  };
  const fullName = updatedDisplayName ?? displayName;
  const roleLabel = displayRole;
  const navItems: NavItem[] = [
    {
      label: "หน้าหลัก",
      path: "/dashboard",
      ariaLabel: "กลับไปหน้าหลัก",
    },
  ];
  if (userInfo?.roleName === "student") {
    navItems.push(
      {
        label: "โปรไฟล์",
        path: "/profile",
        ariaLabel: "ไปหน้าโปรไฟล์",
      },
      {
        label: "ข้อมูลสถานสหกิจ",
        path: "/co-operation",
        ariaLabel: "ไปหน้าข้อมูลสถานสหกิจ",
      },
      {
        label: "นัดหมายนิเทศ",
        path: "/appointment",
        ariaLabel: "ไปหน้านัดหมายวันนิเทศ",
      },
      {
        label: "รายงานประจำสัปดาห์",
        path: "/weeklyReport",
        ariaLabel: "ไปหน้ารายงานประจำสัปดาห์",
      },
      {
        label: "รูปเล่มรายงาน",
        path: "/report",
        ariaLabel: "ไปหน้ารูปเล่มรายงาน",
      }
    );
  }
  if (userInfo?.roleName === "teacher") {
    navItems.push(
      {
        label: "การจัดนักศึกษาเข้าที่ปรึกษา",
        path: "/assign-student",
        ariaLabel: "ไปหน้าการจัดนักศึกษาเข้าที่ปรึกษา",
      },
      {
        label: "นัดหมายวันนิเทศ",
        path: "/appointment",
        ariaLabel: "ไปหน้านัดหมายวันนิเทศ",
      }
    );
  }
  if (userInfo?.roleName === "staff") {
    navItems.push(
      {
        label: "ข้อมูลเอกสารอาจารย์",
        path: "/usersTable/1",
        ariaLabel: "ไปหน้าข้อมูลเอกสารอาจารย์",
      },
      {
        label: "ข้อมูลเอกสารนักศึกษา",
        path: "/usersTable/2",
        ariaLabel: "ไปหน้าข้อมูลเอกสารนักศึกษา",
      }
    );
  }
  if (userInfo?.roleName === "admin") {
    navItems.push({
      label: "หน้าโปรไฟล์",
      path: "/profile",
      ariaLabel: "ไปหน้าโปรไฟล์",
    });
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <button
          type="button"
          className={styles.brandIcon}
          onClick={() => router.push("/dashboard")}
          aria-label="ไปที่หน้า dashboard"
        >
          <Image
            src="/hat-icon-p.svg"
            alt="Hat Icon"
            width={32}
            height={32}
            className={styles.brandIconImg}
          />
        </button>

        <button
          type="button"
          className={styles.brandNameContainer}
          onClick={() => router.push("/dashboard")}
          aria-label="กลับไปหน้า dashboard"
        >
          <span className={styles.brandNameMain}>
            ระบบสหกิจศึกษา
          </span>

          <span className={styles.brandNameSub}>
            คณะวิทยาศาสตร์
          </span>
        </button>
      </div>
      <div className={styles.toHome}>
        {navItems.map((item, index) => (
          <Fragment key={item.path}>
            {index > 0 && (
              <div className={styles.divider}></div>
            )}

            <div className={styles.navButton}>
              <button
                type="button"
                className={styles.brandNameContainer}
                onClick={() => router.push(item.path)}
                aria-label={item.ariaLabel}
              >
                <span className={styles.brandNameMain}>
                  {item.label}
                </span>
              </button>
            </div>
          </Fragment>
        ))}
      </div>
      <div className={styles.navLinks}>
        <div className={styles.infoContainer}>
          <span className={styles.nameText}>
            {fullName}
          </span>

          <span className={styles.roletext}>
            {roleLabel}
          </span>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.logoutIcon}>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="ออกจากระบบ"
          >
            <LuLogIn />
            ออกจากระบบ
          </button>
        </div>
      </div>

    </nav>
  );
}