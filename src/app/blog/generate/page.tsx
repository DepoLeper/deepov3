import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import BlogGeneratorForm from './BlogGeneratorForm';

export default async function BlogGeneratorPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Blogcikk Generátor</h1>
          <p className="text-lg text-gray-400">
            Töltsd ki az alábbi űrlapot a tökéletes SEO-barát cikk generálásához.
          </p>
        </div>
        <BlogGeneratorForm />
      </div>
    </div>
  );
} 