import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb w-96 h-96 bg-violet-600 top-1/4 -left-48 animate-float" />
        <div className="orb w-80 h-80 bg-purple-600 top-1/2 right-1/4 animate-float-delayed" />
        <div className="orb w-72 h-72 bg-indigo-600 bottom-1/4 left-1/3 animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="glass-panel rounded-3xl p-12 max-w-2xl text-center">
          <h1 className="text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
            Academic Flashcards
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Estudia con estilo usando flashcards interactivas
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <button className="glass-panel-hover rounded-xl px-8 py-3 active:scale-95 transition-transform font-medium">
                Iniciar Sesión
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="glass-panel-hover rounded-xl px-8 py-3 active:scale-95 transition-transform font-medium">
                Crear Cuenta
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

