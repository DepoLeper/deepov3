import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {session ? (
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                D
              </div>
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4">
              Üdvözöl <span className="text-blue-600">DeepO</span>!
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A T-DEPO intelligens marketing asszisztense. Segítek blog cikkekben, termékleírásokban, 
              SEO optimalizálásban és minden marketing feladatban! 🚀
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Chat DeepO */}
            <Link href="/chat" className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Chat DeepO-val</h3>
                <p className="text-slate-600">Beszélgess velem természetes nyelven. Kérdezz, kérj segítséget, vagy csak beszélgessünk!</p>
                <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
                  Kezdjük el →
                </div>
              </div>
            </Link>

            {/* Blog Generator */}
            <Link href="/blog/generate" className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Blog Generátor</h3>
                <p className="text-slate-600">Professzionális blog cikkek létrehozása SEO optimalizálással és T-DEPO termékekkel.</p>
                <div className="mt-4 text-green-600 font-medium group-hover:text-green-700">
                  Új cikk írása →
                </div>
              </div>
            </Link>

            {/* Agent Test */}
            <Link href="/agent/test" className="group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl mb-4">🧪</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Agent Teszt</h3>
                <p className="text-slate-600">Teszteld a különböző agent implementációkat és hasonlítsd össze a teljesítményüket.</p>
                <div className="mt-4 text-purple-600 font-medium group-hover:text-purple-700">
                  Tesztelés →
                </div>
              </div>
            </Link>
          </div>

          {/* Dashboard Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Today's Summary */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                📊 Mai Összefoglaló
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Blog cikkek:</span>
                  <span className="font-bold text-slate-800">2 vázlat, 1 jóváhagyva</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">SEO pontszámok:</span>
                  <span className="font-bold text-green-600">Átlag: 8.2/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Új termékek:</span>
                  <span className="font-bold text-blue-600">3 téli termék (Tork)</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                📈 Aktuális Trendek
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">"téli tisztítás"</span>
                  <span className="font-bold text-green-600">+20% 📈</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">"kézfertőtlenítő"</span>
                  <span className="font-bold text-red-500">-5% 📉</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">"munkavédelem"</span>
                  <span className="font-bold text-green-600">+12% 📈</span>
                </div>
              </div>
            </div>
          </div>

          {/* DeepO Suggestions */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                D
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">DeepO javaslatok ma:</h3>
                <div className="space-y-3">
                  <p className="text-slate-700">
                    💡 <strong>Téma javaslat:</strong> "Téli munkavédelem az irodában" - észrevettem, hogy 3 új téli termékünk van!
                  </p>
                  <p className="text-slate-700">
                    📊 <strong>SEO tipp:</strong> A "kézhigiénia" kulcsszó népszerűsége csökken, inkább "munkavédelem"-re fókuszáljunk.
                  </p>
                  <p className="text-slate-700">
                    🎯 <strong>Kampány ötlet:</strong> Black Friday közeleg - készítsünk "téli akciós" tartalmat?
                  </p>
                </div>
                <div className="mt-4">
                  <Link href="/chat" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    💬 Beszélgessünk róla!
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Link */}
          {session.user?.role === 'admin' && (
            <div className="mt-8 text-center">
              <Link href="/admin" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                ⚙️ Admin Felület
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Login Section */
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-2xl border border-white/20 text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              D
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              DeepO - T-DEPO AI
            </h1>
            <p className="text-slate-600 mb-8">
              Az intelligens marketing asszisztens. Bejelentkezés szükséges a hozzáféréshez.
            </p>
            <Link href="/login">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all">
                Bejelentkezés
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
