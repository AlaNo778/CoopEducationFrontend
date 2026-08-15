"use client";
import { useEffect, useState, useMemo } from "react";
import styles from "./UsersTable.module.css";
import Link from "next/link";
import { LuEye } from "react-icons/lu";
// import { LuExternalLink } from "react-icons/lu";
interface UsersTableProps {
  roleId: number;
}
interface Teacher {
  teacherId: number;
  userId: number;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  major: number;
  majorId: number;
  majorName: string;
}
interface Student {
  studentId: number;
  userId: number;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  gpax: number | null;
  totalCredits: number;
  majorId: number;
  majorName: string;
}
type UserRow = Teacher | Student;
function isTeacher(row: UserRow): row is Teacher {
  return (row as Teacher).teacherId !== undefined;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseAPI = (API_URL ?? "").replace(/\/$/, "");
const ENDPOINT = `${baseAPI}/CoopUsersTable`;
const ITEMS_PER_PAGE = 20;

export default function UsersTable({ roleId }: UsersTableProps) {
  const role = roleId;
  // 1) ข้อมูลจาก API
  const [data, setData] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // filter + search + pagination state
  const [selectedMajor, setSelectedMajor] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ---- 1) เรียก API ----
  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${ENDPOINT}?roleId=${role}`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          // backend ตอบ NotFound เมื่อไม่มีข้อมูล
          setData([]);
          return;
        }

        if (!res.ok) {
          throw new Error(`โหลดข้อมูลไม่สำเร็จ (HTTP ${res.status})`);
        }

        const json: UserRow[] = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [role]);

  // ---- 4) auto search: debounce 300ms ----
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // reset กลับหน้า 1 ทุกครั้งที่ filter/search/role เปลี่ยน
  //   useEffect(() => {
  //     setCurrentPage(1);
  //   }, [debouncedSearch, selectedMajor, role]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const handleMajorChange = (value: string) => {
    setSelectedMajor(value);
    setCurrentPage(1);
  };

  // ---- 3) ตัวเลือกของ filter (สาขาวิชา) ดึงจากข้อมูลจริงที่โหลดมา ----
  const majorOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => {
      if (row.majorName) set.add(row.majorName);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "th"));
  }, [data]);

  // ---- 3+4) รวม filter และ search เข้าด้วยกัน ----
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (selectedMajor && row.majorName !== selectedMajor) return false;
      if (!debouncedSearch) return true;

      const haystack = isTeacher(row)
        ? [row.firstName, row.lastName, row.email, row.phone, row.position]
        : [
            row.firstName,
            row.lastName,
            row.email,
            row.studentCode,
            row.faculty,
          ];

      return haystack
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(debouncedSearch));
    });
  }, [data, selectedMajor, debouncedSearch]);

  // ---- 5) pagination: 20 รายการต่อหน้า ----
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, safePage]);

  const startIndex =
    filteredData.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(safePage * ITEMS_PER_PAGE, filteredData.length);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  // เลขหน้าแบบมี ... เมื่อจำนวนหน้าเยอะ
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - delta && i <= safePage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className={styles.page}>
      <section className={styles.welcomeContent}>
        <div>
          <div>
            <h1 className={styles.welcomeTitle}>
              {role === 1 ? "รายชื่ออาจารย์" : "รายชื่อนักศึกษา"}
            </h1>

            <p className={styles.welcomeSubtitle}>
              {role === 1
                ? "ตารางข้อมูลรายชื่ออาจารย์คณะวิทยาศาสตร์"
                : "ตารางข้อมูลรายชื่อนักศึกษาคณะวิทยาศาสตร์"}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.headerBar}>
          {/* ---- 3) auto search ---- */}
          <div className={styles.searchbar}>
            <svg
              className={styles.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={
                role === 1
                  ? "ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                  : "ค้นหาชื่อ, รหัสนักศึกษา, อีเมล..."
              }
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className={styles.clearSearch}
                onClick={() => handleSearchChange("")}
                aria-label="ล้างคำค้นหา"
              >
                ×
              </button>
            )}
          </div>
          {/* ---- 4) filter ---- */}
          <div className={styles.filter}>
            <label className={styles.filterLabel} htmlFor="majorFilter">
              สาขาวิชา
            </label>
            <select
              id="majorFilter"
              className={styles.filterSelect}
              value={selectedMajor}
              onChange={(e) => handleMajorChange(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              {majorOptions.map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---- 2) ตาราง ---- */}
        <div className={styles.tableData}>
          {loading ? (
            <div className={styles.stateBox}>กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div className={styles.stateBox}>{error}</div>
          ) : filteredData.length === 0 ? (
            <div className={styles.stateBox}>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>#</th>
                    {role === 1 ? (
                      <>
                        <th className={styles.th}>ชื่อ - นามสกุล</th>
                        <th className={styles.th}>ตำแหน่ง</th>
                        <th className={styles.th}>สาขาวิชา</th>
                        <th className={styles.th}>อีเมล</th>
                        <th className={styles.th}>เบอร์โทร</th>
                        <th className={styles.th}></th>
                      </>
                    ) : (
                      <>
                        <th className={styles.th}>รหัสนักศึกษา</th>
                        <th className={styles.th}>ชื่อ - นามสกุล</th>
                        <th className={styles.th}>คณะ</th>
                        <th className={styles.th}>สาขาวิชา</th>
                        <th className={styles.th}>เกรดเฉลี่ย</th>
                        <th className={styles.th}>หน่วยกิตสะสม</th>
                        <th className={styles.th}>อีเมล</th>
                        <th className={styles.th}></th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr
                      key={isTeacher(row) ? row.teacherId : row.studentId}
                      className={styles.tr}
                    >
                      <td className={styles.td}>
                        {(safePage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      {isTeacher(row) ? (
                        <>
                          <td className={styles.td}>
                            {row.firstName} {row.lastName}
                          </td>
                          <td className={styles.td}>{row.position}</td>
                          <td className={styles.td}>{row.majorName}</td>
                          <td className={styles.td}>{row.email}</td>
                          <td className={styles.td}>{row.phone}</td>
                          <td>
                            <Link
                              href={`/usersTable/1/${row.teacherId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="ดูรายละเอียด"
                            >
                              <LuEye size={18} />
                            </Link>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className={styles.td}>{row.studentCode}</td>
                          <td className={styles.td}>
                            {row.firstName} {row.lastName}
                          </td>
                          <td className={styles.td}>{row.faculty}</td>
                          <td className={styles.td}>{row.majorName}</td>
                          <td className={styles.td}>
                            {typeof row.gpax === "number"
                              ? row.gpax.toFixed(2)
                              : "-"}
                          </td>
                          <td className={styles.td}>{row.totalCredits}</td>
                          <td className={styles.td}>{row.email}</td>
                          <td>
                            <Link
                              href={`/usersTable/2/${row.studentId}`}
                              aria-label="ดูรายละเอียด"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <LuEye size={18} />
                            </Link>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ---- 5) pagination ---- */}
        {!loading && !error && filteredData.length > 0 && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              แสดง {startIndex}-{endIndex} จาก {filteredData.length} รายการ
            </span>

            <div className={styles.paginationControls}>
              <button
                type="button"
                className={styles.pageButton}
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
              >
                ก่อนหน้า
              </button>

              {pageNumbers.map((p, i) =>
                p === "ellipsis" ? (
                  <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.pageButton} ${
                      p === safePage ? styles.pageButtonActive : ""
                    }`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                type="button"
                className={styles.pageButton}
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
