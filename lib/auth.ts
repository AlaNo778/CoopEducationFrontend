import { cache } from "react";
import { cookies } from "next/headers";
import type { Role } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type UserInfo = {
  fullName: string;
  roleName: Role;
};

/**
 * ดึงข้อมูล user จาก backend โดยส่ง cookie access_token ไปให้ backend validate signature
 * - ถ้า token ไม่ valid / หมดอายุ / ไม่มี → backend คืน 401 → ฟังก์ชันนี้คืน null
 * - ใช้ React cache() เพื่อ dedupe request ภายใน server render เดียวกัน
 *   (layout + page เรียกซ้ำได้ โดย backend จะถูก hit แค่ครั้งเดียว)
 */
const fetchUserInfo = cache(async (): Promise<UserInfo | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/UserInfo`, {
      method: "GET",
      headers: {
        Cookie: `access_token=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json?.isError || !json?.data) return null;

    return {
      fullName: json.data.fullName,
      roleName: json.data.roleName as Role,
    };
  } catch (err) {
    console.error("fetchUserInfo failed:", err);
    return null;
  }
});

export async function getUserRole(): Promise<Role | null> {
  const info = await fetchUserInfo();
  return info?.roleName ?? null;
}

export async function getUserInfo(): Promise<UserInfo | null> {
  return fetchUserInfo();
}
