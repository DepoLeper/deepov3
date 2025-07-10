import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return users;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    redirect('/');
  }

  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Adminisztrációs Felület</h1>
          <p className="text-lg text-gray-400">
            Üdvözlünk, {session.user?.name}!
          </p>
        </div>

        {/* Új felhasználó meghívása */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Új felhasználó meghívása</h2>
          <form className="flex gap-4">
            <input
              type="email"
              placeholder="kolléga@t-depo.hu"
              className="flex-grow px-4 py-2 text-white bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Meghívás
            </button>
          </form>
        </div>

        {/* Felhasználók listája */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-semibold p-6">Felhasználók</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-gray-600">
                <tr>
                  <th className="p-6">Név</th>
                  <th className="p-6">Email</th>
                  <th className="p-6">Szerepkör</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="p-6">{user.name || '-'}</td>
                    <td className="p-6">{user.email}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 