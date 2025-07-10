import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Ha nincs session vagy a felhasználó nem admin, átirányítás a főoldalra
  if (!session || session.user?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Adminisztrációs Felület</h1>
        <p className="text-xl">
          Üdvözlünk a védett admin oldalon, {session.user?.name}!
        </p>
        <p>Itt tudod majd kezelni a felhasználókat és egyéb beállításokat.</p>
      </div>
    </div>
  );
} 