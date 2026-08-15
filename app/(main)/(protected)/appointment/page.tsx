// import { getUserRole, getUserInfo } from '@/lib/auth';
import { getUserRole } from '@/lib/auth';
import TeacherAppointment  from '@/components/feature/appointment/TeacherAppointment';
import StudentAppointment  from '@/components/feature/appointment/StudentAppointment';
import { redirect } from 'next/navigation';

export default async function assignStudent() {
  const role = await getUserRole();
//   const userInfo = await getUserInfo();

  if (!role) return redirect('/login');
  if (role === 'teacher') return <TeacherAppointment />;
  if (role === 'student') return <StudentAppointment />;

  return <div>No access</div>;
}
