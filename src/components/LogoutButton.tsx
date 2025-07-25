'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
    >
      Kijelentkezés
    </button>
  );
} 