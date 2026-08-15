import { getUserRole } from "@/lib/auth";
import StudentDetailPage from "@/components/feature/assignStudent/studentDetail";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    studentCode: string;
  }>;
}

export default async function StudentDetail({ params }: Props) {
  const role = await getUserRole();

  const { studentCode } = await params;

  console.log("page studentCode:", studentCode);

  if (!role) return redirect("/login");

  if (role === "teacher") {
    return <StudentDetailPage studentCode={studentCode} />;
  }

  return <div>No access</div>;
}
