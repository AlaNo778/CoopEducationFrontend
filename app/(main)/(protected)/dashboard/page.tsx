import { getUserRole, getUserInfo } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentDashboard from "@/components/feature/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/feature/dashboard/TeacherDashboard";
import AdminDashboard from "@/components/feature/dashboard/AdminDashboard";
import StaffDashboard from "@/components/feature/dashboard/StaffDashboard";

export default async function DashboardPage() {
  const role =  await getUserRole();
  const userInfo = await getUserInfo();
  
  // console.log("User role:", role);
  
  if (!role) return redirect("/login");
  if (role === "student") return <StudentDashboard userInfo={userInfo} />;
  if (role === "teacher") return <TeacherDashboard userInfo={userInfo} />;
  if (role === "admin") return <AdminDashboard  />;
  if (role === "staff") return <StaffDashboard  />; 

  return <div>No access</div>;
}