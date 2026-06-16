import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Node runtime จำเป็น: self-signed cert dev ต้องใช้ NODE_EXTRA_CA_CERTS (Node-level)
// Edge runtime ไม่รองรับ Node cert store
export const runtime = "nodejs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Redirect ไป /login พร้อมลบ auth cookies ที่อาจค้างให้หมด
 * (backend /refresh return 401 ไม่ได้ส่ง Set-Cookie: delete กลับมา
 *  ถ้าไม่ cleanup ฝั่งนี้ cookie stale จะค้างอยู่ที่ browser)
 */
function redirectToLogin(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  // Path ต้องตรงกับตอน backend set (ทั้ง 3 ตัว set ด้วย Path="/")
  response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
  response.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
  response.cookies.set("csrf_token", "", { path: "/", maxAge: 0 });
  return response;
}

/**
 * Auth middleware
 * - มี access_token cookie  → ปล่อยผ่าน (backend จะ validate เอง)
 * - ไม่มี access_token, ไม่มี refresh_token → redirect /login (+ cleanup)
 * - ไม่มี access_token แต่มี refresh_token → call /refresh
 *     สำเร็จ → forward Set-Cookie ให้ browser + redirect กลับมาที่ URL เดิม
 *             (browser re-request พร้อม access_token ใหม่ → middleware เห็น cookie → ผ่าน)
 *     ล้มเหลว → redirect /login (+ cleanup)
 *
 * หมายเหตุ: backend set access_token cookie ด้วย Expires = JWT expiry
 *           → browser ลบ cookie อัตโนมัติเมื่อหมดอายุ = middleware รู้ได้โดยเช็ค existence
 */
export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token");
  if (accessToken) return NextResponse.next();

  const refreshToken = req.cookies.get("refresh_token");
  if (!refreshToken) {
    return redirectToLogin(req);
  }

  try {
    const res = await fetch(`${API_URL}/Login/refresh`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refreshToken.value}` },
    });

    if (!res.ok) {
      return redirectToLogin(req);
    }

    const redirect = NextResponse.redirect(req.url);
    const setCookies = res.headers.getSetCookie?.() ?? [];
    for (const c of setCookies) {
      redirect.headers.append("Set-Cookie", c);
    }
    return redirect;
  } catch (err) {
    console.error("Middleware refresh failed:", err);
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/form/:path*",
    "/student/:path*",
  ],
};
