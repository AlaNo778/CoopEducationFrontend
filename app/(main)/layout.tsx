import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getUserInfo } from "@/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side fetch: ส่ง cookie access_token ไปให้ backend validate
  // React cache() ใน lib/auth dedupe ให้แล้ว → ถ้า page อื่นเรียกซ้ำใน render เดียว backend โดน hit ครั้งเดียว
  const userInfo = await getUserInfo();

  return (
    <>
      <Navbar userInfo={userInfo} />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer />
    </>
  );
}