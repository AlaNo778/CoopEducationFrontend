import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentReport from "@/components/feature/report/StudentReport";


export default async function WeeklyReport() {
  const role =  await getUserRole();
  if (!role) return redirect("/login");
  if (role === "student") return <StudentReport/>;
  return <div>No access</div>;
}