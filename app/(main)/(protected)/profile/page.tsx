import { getUserRole, getUserInfo } from "@/lib/auth";
import StudentProfile from "@/components/feature/profile/StudentProfile";
import { redirect } from "next/navigation";

export default async function profilePage() {
  const role =  await getUserRole();
  const userInfo = await getUserInfo();

  if (!role) return redirect("/login");
    if (role === "student") return <StudentProfile userInfo={userInfo} />;

  return <div>No access</div>;
}

