import { getAuthUser } from '@/app/auth/utils';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import EditAddressClient from '../EditAddressClient';

interface EditAddressPageProps {
  params: {
    id: string;
  };
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const addressId = parseInt(params.id, 10);
  if (isNaN(addressId)) {
    redirect('/my-page'); // Redirect if ID is invalid
  }

  const address = await prisma.address.findUnique({
    where: { id: addressId, userId: user.id }, // Ensure user owns the address
  });

  if (!address) {
    redirect('/my-page'); // Redirect if address not found or not owned by user
  }

  // Pass only necessary address data to the client component
  const addressDataForClient = {
    id: address.id,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || '',
    city: address.city || '',
    postalCode: address.postalCode || '',
    isDefault: address.isDefault,
  };

  return <EditAddressClient address={addressDataForClient} />;
}
