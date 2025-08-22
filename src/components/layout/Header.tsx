import Link from 'next/link';
import HeaderCartIcon from './HeaderCartIcon';
import { getAuthUser } from '@/app/auth/utils'; // Import getAuthUser
import { logout } from '@/app/auth/actions'; // Import logout action

const Header = async () => {
  const user = await getAuthUser(); // Fetch authenticated user

  return (
    <header className="bg-primary-700 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/" className="text-primary-100 hover:text-primary-300">동네 옷 가게</Link>
        </div>
        <nav className="flex items-center space-x-6">
          <button className="text-primary-100 hover:text-white">검색</button>
          {user ? (
            <>
              <Link href="/my-page" className="text-primary-100 hover:text-white">마이페이지</Link>
              <form action={logout}>
                <button type="submit" className="text-primary-100 hover:text-white cursor-pointer">로그아웃</button>
              </form>
            </>
          ) : (
            <Link href="/auth/signin" className="text-primary-100 hover:text-white">로그인</Link>
          )}
          <HeaderCartIcon />
        </nav>
      </div>
    </header>
  );
};

export default Header;
