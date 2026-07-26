// import { getUserRole, getUserInfo } from '@/lib/auth';
import { getUserRole } from '@/lib/auth';
import StudentCooperative from '@/components/feature/co-operative/StudentCo-operative';
import { redirect } from 'next/navigation';

export default async function CoopPage() {
  const role = await getUserRole();
  // const userInfo = await getUserInfo();

  if (!role) return redirect('/login');
  if (role === 'student') return <StudentCooperative />;

  return <div>No access</div>;
}
