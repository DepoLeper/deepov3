import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Deepo SEO Content Generator
        </h1>
        {session ? (
          <div className="space-y-4">
            <p className="text-xl">
              Üdvözlünk, {session.user?.name || 'Felhasználó'}!
            </p>
            <p>Sikeresen bejelentkeztél a rendszerbe.</p>
            {session.user?.role === 'admin' && (
              <Link href="/admin">
                <button className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 mr-2">
                  Admin Felület
                </button>
              </Link>
            )}
            <LogoutButton />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xl">
              A tartalom megtekintéséhez kérjük, jelentkezz be.
            </p>
            <Link href="/login">
              <button className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Bejelentkezés
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
