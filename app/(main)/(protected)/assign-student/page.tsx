// import { getUserRole, getUserInfo } from '@/lib/auth';
import { getUserRole } from '@/lib/auth';
import TeacherAssignTeacher from '@/components/feature/assignStudent/teacherAssignStudent';
import { redirect } from 'next/navigation';

export default async function assignStudent() {
  const role = await getUserRole();
//   const userInfo = await getUserInfo();

  if (!role) return redirect('/login');
  if (role === 'teacher') return <TeacherAssignTeacher />;

  return <div>No access</div>;
}
