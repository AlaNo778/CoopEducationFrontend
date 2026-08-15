import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserDetail from "@/components/feature/usersTable/UserDetail";

interface UsersDetailProps {
  params: Promise<{
    roleId: string;
    personId:string;
  }>;
}

export default async function UsersDetail({params,}: UsersDetailProps) {
  const role = await getUserRole();

  if (!role) {
    redirect("/login");
  }

  const { roleId, personId } = await params;

  return <UserDetail roleId={Number(roleId)} personId={Number(personId)}/>;
}