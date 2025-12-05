'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

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
        <div className="glass-panel rounded-3xl p-8 sm:p-12 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
              Bienvenido
            </h1>
            <p className="text-slate-300">
              Inicia sesión en Academic Flashcards
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="glass-panel border-white/20 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="glass-panel border-white/20 text-white placeholder:text-slate-400"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full glass-panel-hover active:scale-95 transition-transform font-medium"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link
              href="/auth/reset-password"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="text-slate-400">
              ¿No tienes cuenta?{' '}
              <Link
                href="/auth/signup"
                className="text-violet-300 hover:text-violet-200 transition-colors font-medium"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
