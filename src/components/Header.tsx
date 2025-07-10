import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LogoutButton from './LogoutButton';

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-gray-800 bg-opacity-30 backdrop-blur-lg text-white p-4 shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Deepo AI Tool
        </Link>
        <div className="flex items-center gap-4">
          {session && (
            <>
              <Link href="/blog/generate" className="hover:text-blue-400 transition-colors">
                Blog Generátor
              </Link>
              {session.user?.role === 'admin' && (
                <Link href="/admin" className="hover:text-blue-400 transition-colors">
                  Admin
                </Link>
              )}
              <LogoutButton />
            </>
          )}
        </div>
      </nav>
    </header>
  );
} 