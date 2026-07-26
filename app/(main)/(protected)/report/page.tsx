import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentThesis from "@/components/feature/thesis/StudentThesisReport";


export default async function Report() {
  const role =  await getUserRole();
  if (!role) return redirect("/login");
  if (role === "student") return <StudentThesis/>;
  return <div>No access</div>;
}