import { getAuthUser } from '@/app/auth/utils';
import { redirect } from 'next/navigation';
import EditProfileClient from './EditProfileClient';

export default async function EditProfilePage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Pass only necessary user data to the client component
  const userDataForClient = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
  };

  return <EditProfileClient user={userDataForClient} />;
}
