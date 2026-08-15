import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersTable from "@/components/feature/usersTable/UsersTable";

interface UsersTableDetailProps {
  params: Promise<{
    roleId: string;
  }>;
}

export default async function UsersTableDetail({
  params,
}: UsersTableDetailProps) {
  const role = await getUserRole();

  if (!role) {
    redirect("/login");
  }

  const { roleId } = await params;

  return <UsersTable roleId={Number(roleId)} />;
}